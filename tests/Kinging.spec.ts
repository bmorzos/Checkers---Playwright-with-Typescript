import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName } from '../pages/CheckersPage';

test.describe('Kinging Mechanics', () => {
  let checkersPage: CheckersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.navigate();
  });

  test('Become King - Simple Move', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 6, piece: "red" as PieceName },
      { x: 7, y: 7, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 6);
    await checkersPage.clickSquare(1, 7);
    await checkersPage.clickSquare(1, 7);
    await checkersPage.skipGameWait();

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[1][7]).toBe('redKing');
  });

  test('Become King - Capture Move', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 1, y: 5, piece: "red" as PieceName },
      { x: 2, y: 6, piece: "blue" as PieceName },
      { x: 7, y: 7, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(1, 5);
    await checkersPage.clickSquare(3, 7);
    await checkersPage.skipGameWait();

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[3][7]).toBe('redKing');
    expect(currentBoard[2][6]).toBe('empty');
  });

  test('King Move - Backward-Left', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" as PieceName },
      { x: 7, y: 7, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(3, 1);
    await checkersPage.skipGameWait();

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('empty');
    expect(currentBoard[3][1]).toBe('redKing');
  });

  test('King Move - Backward-Right', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" as PieceName },
      { x: 7, y: 7, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(1, 1);
    await checkersPage.skipGameWait();

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('empty');
    expect(currentBoard[1][1]).toBe('redKing');
  });

  test('King Capture - Backward', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" as PieceName },
      { x: 1, y: 1, piece: "blue" as PieceName },
      { x: 7, y: 7, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.clickSquare(0, 0);
    await checkersPage.skipGameWait();

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('empty');
    expect(currentBoard[1][1]).toBe('empty');
    expect(currentBoard[0][0]).toBe('redKing');
  });

  test('King Multi-Jump - Mixed Direction', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" as PieceName },
      { x: 3, y: 3, piece: "blue" as PieceName },
      { x: 5, y: 3, piece: "blue" as PieceName },
      { x: 7, y: 7, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    let currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('redKing - selected');

    await checkersPage.clickSquare(4, 4);
    await checkersPage.skipGameWait();

    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[4][4]).toBe('redKing');
    expect(currentBoard[3][3]).toBe('empty');

    await checkersPage.clickSquare(6, 2);
    await checkersPage.skipGameWait();

    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[6][2]).toBe('redKing');
    expect(currentBoard[5][3]).toBe('empty');
  });

  test('Kinging Mid-Multi-Jump', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 5, y: 5, piece: "red" as PieceName },
      { x: 4, y: 6, piece: "blue" as PieceName },
      { x: 2, y: 6, piece: "blue" as PieceName },
      { x: 7, y: 7, piece: "blue" as PieceName },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(5, 5);
    await checkersPage.clickSquare(3, 7);
    await checkersPage.skipGameWait();

    let currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[3][7]).toBe('redKing');
    expect(currentBoard[4][6]).toBe('empty');

    await checkersPage.clickSquare(1, 5);
    await checkersPage.skipGameWait();

    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[1][5]).toBe('redKing');
    expect(currentBoard[2][6]).toBe('empty');
  });
});

