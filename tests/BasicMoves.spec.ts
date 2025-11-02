import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName } from '../pages/CheckersPage';

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
    await checkersPage.clickSquare(2, 2);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red - selected');
  });

  test('Deselect Piece', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(2, 2);

    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
  });

  test('Switch Selection', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(4, 2);

    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
    expect(finalBoard[4][2]).toBe('red - selected');
  });

  test('Valid Forward-Left Move', async ({ page }) => {
    await checkersPage.clickSquare(2, 2); 
    await checkersPage.completeMove(3, 3);

    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('empty');
    expect(finalBoard[3][3]).toBe('red - selected');

    expect(await checkersPage.getCurrentMessage()).toContain('Select an orange piece to move.');
  });

  test('Valid Forward-Right Move', async ({ page }) => {
    await checkersPage.clickSquare(2, 2); 
    await checkersPage.completeMove(1, 3);

    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('empty');
    expect(finalBoard[1][3]).toBe('red - selected');

    expect(await checkersPage.getCurrentMessage()).toContain('Select an orange piece to move.');
  });
});

