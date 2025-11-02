import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName } from '../pages/CheckersPage';

test.describe('Checkers Rules Enforcement & Illegal Moves', () => {
  let checkersPage: CheckersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.navigate();

    const basicSetup: { x: number; y: number; piece: PieceName }[] = [
        { x: 2, y: 2, piece: "red" as PieceName },
        { x: 4, y: 2, piece: "red" as PieceName },
        { x: 7, y: 7, piece: "blue" as PieceName },
    ];

    await checkersPage.setBoard(basicSetup);
  });

  test('Click Empty Square', async ({ page }) => {
    await checkersPage.clickSquare(1, 2);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
    expect(finalBoard[1][2]).toBe('empty');
    expect(await checkersPage.getCurrentMessage()).toContain("Select an orange piece to move.");
  });

  test('Click Opponent Piece', async ({ page }) => {
    await checkersPage.clickSquare(7, 7);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[7][7]).toBe('blue');
    expect(finalBoard[2][2]).toBe('red');
    expect(await checkersPage.getCurrentMessage()).toContain("Click on your orange piece");
  });

  test('Backwards', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(1, 1);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('selected');
    expect(finalBoard[1][1]).toBe('empty');
  });

  test('Horizontal', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(3, 2);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('selected');
    expect(finalBoard[3][2]).toBe('empty');
  });

  test('Vertical', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(2, 3);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('selected');
    expect(finalBoard[2][3]).toBe('empty');
  });

  test('Dark Square', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(1, 1);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('selected');
    expect(finalBoard[1][1]).toBe('empty');
  });

  test('Occupied by Self', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(4, 2);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
    expect(finalBoard[4][2]).toBe('selected');
  });

  test('Occupied by Opponent, No Capture', async ({ page }) => {
    const adjacentSetup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" as PieceName },
      { x: 3, y: 3, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(adjacentSetup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(3, 3);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('selected');
    expect(finalBoard[3][3]).toBe('blue');
  });
  
  test('Long Diagonal, No Capture', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(4, 4);
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('selected');
    expect(finalBoard[4][4]).toBe('empty');
  });
  
  test('During Opponent Turn', async ({ page }) => {
    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(1, 3);

    await checkersPage.clickSquare(4, 2);

    expect(await checkersPage.getCurrentMessage()).toContain("Please wait.");
    
    const finalBoard = await checkersPage.getVisualBoardState();
    expect(finalBoard[4][2]).toBe('red');
  });
});

