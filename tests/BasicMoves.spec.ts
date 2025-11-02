import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName, PieceState } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Basic Mechanics', () => {
  let checkersPage: CheckersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.navigate();

    const basicSetup: { x: number; y: number; piece: PieceName }[] = [
        { x: 2, y: 2, piece: "red" },
        { x: 4, y: 2, piece: "red" },
        { x: 7, y: 7, piece: "blue" },
    ];

    await checkersPage.setBoard(basicSetup);
  });

  test('Select Piece', async ({ page }) => {
    await checkersPage.selectPiece({ x: 2, y: 2 });
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red - selected');
  });

  test('Deselect Piece', async ({ page }) => {
    await checkersPage.selectPiece({ x: 2, y: 2 });
    await checkersPage.selectPiece({ x: 2, y: 2 });

    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
  });

  test('Switch Selection', async ({ page }) => {
    await checkersPage.selectPiece({ x: 2, y: 2 });
    await checkersPage.selectPiece({ x: 4, y: 2 });

    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
    expect(finalBoard[4][2]).toBe('red - selected');
  });

  test('Valid Forward-Left Move', async ({ page }) => {
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 3 });

    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Empty);
    expect(finalBoard[3][3]).toBe(PieceState.Red);

    expect(await checkersPage.getMessageText()).toContain('Select an orange piece to move.');
  });

  test('Valid Forward-Right Move', async ({ page }) => {
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 1, y: 3 });

    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Empty);
    expect(finalBoard[1][3]).toBe(PieceState.Red);

    expect(await checkersPage.getMessageText()).toContain('Select an orange piece to move.');
  });
});