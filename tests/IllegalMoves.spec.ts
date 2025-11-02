import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName, PieceState } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Rules Enforcement & Illegal Moves', () => {
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

  test('Click Empty Square', async ({ page }) => {
    await checkersPage.clickSquare(3, 3);
    
    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[3][3]).toBe(PieceState.Empty);
    expect(await checkersPage.getMessageText()).toContain("Click on your orange piece");
  });

  test('Click Opponent Piece', async ({ page }) => {
    await checkersPage.clickSquare(7, 7);
    
    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[7][7]).toBe(PieceState.Blue);
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(await checkersPage.getMessageText()).toContain("Click on your orange piece");
  });

  test('Backwards', async ({ page }) => {
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 1, y: 1 });
    
    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[1][1]).toBe(PieceState.Empty);
  });

  test('Horizontal', async ({ page }) => {
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 2 });
    
    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
  });

  test('Vertical', async ({ page }) => {
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 2, y: 3 });
    
    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
  });

  test('Occupied by Self', async ({ page }) => {
    await checkersPage.selectPiece({ x: 2, y: 2 });
    await checkersPage.selectPiece({ x: 4, y: 2 });
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
    expect(finalBoard[4][2]).toBe('red - selected');
  });

  test('Occupied by Opponent, No Capture', async ({ page }) => {
    const adjacentSetup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
    ];
    await checkersPage.setBoard(adjacentSetup);

    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 3 });
    
    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[3][3]).toBe(PieceState.Blue);
  });
  
  test('Long Diagonal, No Capture', async ({ page }) => {
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 4, y: 4 });
    
    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[4][4]).toBe(PieceState.Empty);
  });
  
  test('During Opponent Turn', async ({ page }) => {
    await checkersPage.selectPiece({ x: 2, y: 2 });
    await checkersPage.clickSquare(1, 3);

    expect(await checkersPage.getMessageText()).toContain("Select an orange piece to move.");
    
    await checkersPage.clickSquare(4, 2);

    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard[4][2]).toBe(PieceState.Red);
    expect(finalBoard[1][3]).toBe(PieceState.Red);
  });
});