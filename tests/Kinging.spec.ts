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
      { x: 2, y: 6, piece: "red" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 6);
    await checkersPage.completeMove(1, 7);

    let currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[1][7]).toBe('redKing - selected');

    await checkersPage.completeMove(1, 7);
    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[1][7]).toBe('redKing'); // Deselect piece
  });

  test('Become King - Capture Move', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 1, y: 5, piece: "red" },
      { x: 2, y: 6, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(1, 5);
    await checkersPage.completeMove(3, 7);

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[3][7]).toBe('redKing - selected');
    expect(currentBoard[2][6]).toBe('empty');
  });

  test('King Move - Backward-Left', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(3, 1);

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('empty');
    expect(currentBoard[3][1]).toBe('redKing - selected');
  });

  test('King Move - Backward-Right', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(1, 1);

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('empty');
    expect(currentBoard[1][1]).toBe('redKing - selected');
  });

  test('King Capture - Backward', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 1, y: 1, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(0, 0);

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('empty');
    expect(currentBoard[1][1]).toBe('empty');
    expect(currentBoard[0][0]).toBe('redKing - selected');
  });

  test('King Multi-Jump - Mixed Direction', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 3, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.clickSquare(2, 2);

    let currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[2][2]).toBe('redKing - selected');

    await checkersPage.completeMove(4, 4);

    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[4][4]).toBe('redKing - selected');
    expect(currentBoard[3][3]).toBe('empty');

    await checkersPage.completeMove(6, 2);

    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[6][2]).toBe('redKing - selected');
    expect(currentBoard[5][3]).toBe('empty');
  });

  test('Kinging Mid-Multi-Jump', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 5, y: 5, piece: "red" },
      { x: 4, y: 6, piece: "blue" },
      { x: 2, y: 6, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(5, 5);
    await checkersPage.completeMove(3, 7);

    let currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[3][7]).toBe('redKing - selected');
    expect(currentBoard[4][6]).toBe('empty');

    await checkersPage.completeMove(1, 5);

    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[1][5]).toBe('redKing - selected');
    expect(currentBoard[2][6]).toBe('empty');
  });
});

