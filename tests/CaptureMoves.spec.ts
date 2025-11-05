import { test, expect } from '../fixtures/Checkers.fixture';
import { PieceName, PieceState } from '../pages/CheckersPage';

const COMPUTER_THINK_TIME = 10000;

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Capture Mechanics', () => {

  test('Simple Capture', async ({ checkersPage }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 4, y: 4 });

    await expect(checkersPage.messageLocator).toHaveText("Make a move.", {
      timeout: COMPUTER_THINK_TIME 
    });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[4][4]).toBe(PieceState.Red);
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[3][3]).toBe(PieceState.Empty);
    expect(currentBoard[7][7]).not.toBe(PieceState.Blue);
  });

  test('Multi-Jump Sequence', async ({ checkersPage }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);
    const move = await checkersPage.startMove({ x: 2, y: 2 });
    await move.jumpTo({ x: 4, y: 4 });
    await checkersPage.waitForGlobalWait();

    await expect(checkersPage.messageLocator).toHaveText(
      "Complete the double jump or click on your piece to stay still."
    );

    await move.jumpTo({ x: 6, y: 6 });
    await checkersPage.waitForGlobalWait();

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[3][3]).toBe(PieceState.Empty);
    expect(currentBoard[6][6]).toBe(PieceState.Empty);
    expect(currentBoard[5][5]).toBe(PieceState.Blue);
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[4][4]).toBe(PieceState.Empty);
    expect(currentBoard[7][7]).toBe(PieceState.Empty);

    await expect(checkersPage.messageLocator).toHaveText("You lose. Game over.", {
      timeout: COMPUTER_THINK_TIME
    });
  });

  test('Mandatory Multi-Jump Continuation - Other Piece', async ({ checkersPage }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
      { x: 0, y: 0, piece: "red" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 4, y: 4 });
    await checkersPage.waitForGlobalWait();

    await expect(checkersPage.messageLocator).toHaveText(
      "Complete the double jump or click on your piece to stay still."
    );

    await checkersPage.selectPiece({ x: 0, y: 0 });

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[0][0]).toBe("red - selected");
    expect(currentBoard[4][4]).toBe("red");
    expect(currentBoard[2][2]).toBe("empty");
  });

  test('Multi-Jump Continuation - Stay Still', async ({ checkersPage }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 4, y: 4 });
    await checkersPage.waitForGlobalWait();
    await expect(checkersPage.messageLocator).toHaveText(
      "Complete the double jump or click on your piece to stay still."
    );

    await checkersPage.clickSquare(4, 4);
    await checkersPage.waitForGlobalWait();

    await expect(checkersPage.messageLocator).toHaveText("You lose. Game over.", {
      timeout: COMPUTER_THINK_TIME
    });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[4][4]).toBe(PieceState.Empty);
    expect(currentBoard[3][3]).toBe(PieceState.Blue);
  });
});