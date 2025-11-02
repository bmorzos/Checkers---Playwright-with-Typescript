import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName } from '../pages/CheckersPage';

test.describe('Checkers Capture Mechanics', () => {
  let checkersPage: CheckersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.navigate();
  });

  test('Simple Capture', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(4, 4);

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[4][4]).toBe("red - selected");
    expect(currentBoard[2][2]).toBe("empty");
    expect(currentBoard[3][3]).toBe("empty");

    expect(await checkersPage.getCurrentMessage()).toContain("Select an orange piece to move.");
  });

  test('Multi-Jump Sequence', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(4, 4);

    let currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[3][3]).toBe("empty");
    expect(currentBoard[4][4]).toBe("red - selected");

    expect(await checkersPage.getCurrentMessage()).toContain("Complete the double jump or click on your piece to stay still.");

    await checkersPage.completeMove(6, 6);

    currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[5][5]).toBe("empty");

    expect(await checkersPage.getCurrentMessage()).toContain("Complete the double jump or click on your piece to stay still.");
  });

  test('Mandatory Multi-Jump Continuation - Other Piece', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
      { x: 0, y: 0, piece: "red" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(4, 4);
    await checkersPage.clickSquare(0, 0);

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[0][0]).toBe("red - selected");
    expect(currentBoard[4][4]).toBe("red");
    expect(currentBoard[2][2]).toBe("empty");
  });

  test('Multi-Jump Continuation - Stay Still', async ({ page }) => {

    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.clickSquare(2, 2);
    await checkersPage.completeMove(4, 4);

    await checkersPage.clickSquare(4, 4);
    expect(await checkersPage.getCurrentMessage()).toContain("You lose. Game over.");

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[4][4]).toBe("empty"); // Computer takes the piece
    expect(currentBoard[2][2]).toBe("empty");
    expect(currentBoard[3][3]).toBe("blue - selected");
  });
});

