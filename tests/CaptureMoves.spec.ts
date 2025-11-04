import { test, expect } from '../fixtures/Checkers.fixture';
import { PieceName, PieceState } from '../pages/CheckersPage';

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

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[4][4]).toBe(PieceState.Red);
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[3][3]).toBe(PieceState.Empty);

    expect(await checkersPage.getMessageText()).toContain("Select an orange piece to move.");
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

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[3][3]).toBe(PieceState.Empty);
    expect(currentBoard[4][4]).toBe(PieceState.Red);
    expect(await checkersPage.getMessageText()).toContain("Complete the double jump or click on your piece to stay still.");

    await move.jumpTo({ x: 6, y: 6 });

    currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[5][5]).toBe(PieceState.Empty);
    expect(currentBoard[6][6]).toBe(PieceState.Red);
  });

  test('Mandatory Multi-Jump Continuation - Other Piece', async ({ checkersPage }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
      { x: 0, y: 0, piece: "red" },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 4, y: 4 });
    await checkersPage.selectPiece({ x: 0, y: 0 });

    const currentBoard = await checkersPage.getVisualBoardState();
    expect(currentBoard[0][0]).toBe("red - selected");
    expect(currentBoard[4][4]).toBe("red"); // No longer selected
    expect(currentBoard[2][2]).toBe("empty");
  });

  test('Multi-Jump Continuation - Stay Still', async ({ checkersPage }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "red" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 5, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 4, y: 4 });
    await checkersPage.clickSquare(4, 4);
    
    expect(await checkersPage.getMessageText()).toContain("You lose. Game over.");

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[4][4]).toBe(PieceState.Empty); 
    expect(currentBoard[3][3]).not.toBe(PieceState.Empty);
  });
});