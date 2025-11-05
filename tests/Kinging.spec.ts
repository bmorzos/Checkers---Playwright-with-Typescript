import { test, expect } from '../fixtures/Checkers.fixture';
import { PieceState } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Kinging Mechanics', () => {

  test('Become King - Simple Move', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 2, y: 6, piece: PieceState.Red },
      { x: 7, y: 7, piece: PieceState.Blue },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 6 }, { x: 1, y: 7 });

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[1][7]).toBe(PieceState.RedKing);
  });

  test('Become King - Capture Move', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 1, y: 5, piece: PieceState.Red },
      { x: 2, y: 6, piece: PieceState.Blue },
      { x: 7, y: 7, piece: PieceState.Blue },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 1, y: 5 }, { x: 3, y: 7 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[3][7]).toBe(PieceState.RedKing);
    expect(currentBoard[2][6]).toBe(PieceState.Empty);
  });

  test('King Move - Backward-Left', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 2, y: 2, piece: PieceState.RedKing },
      { x: 7, y: 7, piece: PieceState.Blue },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 1 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[3][1]).toBe(PieceState.RedKing);
  });

  test('King Move - Backward-Right', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 2, y: 2, piece: PieceState.RedKing },
      { x: 7, y: 7, piece: PieceState.Blue },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 1, y: 1 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[1][1]).toBe(PieceState.RedKing);
  });

  test('King Capture - Backward', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 2, y: 2, piece: PieceState.RedKing },
      { x: 1, y: 1, piece: PieceState.Blue },
      { x: 7, y: 7, piece: PieceState.Blue },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 0, y: 0 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[1][1]).toBe(PieceState.Empty);
    expect(currentBoard[0][0]).toBe(PieceState.RedKing);
  });

  test('King Multi-Jump - Mixed Direction', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 2, y: 2, piece: PieceState.RedKing },
      { x: 3, y: 3, piece: PieceState.Blue },
      { x: 5, y: 3, piece: PieceState.Blue },
      { x: 7, y: 7, piece: PieceState.Blue },
    ];
    await checkersPage.setBoard(setup);
    const move = await checkersPage.startMove({ x: 2, y: 2 });
    await move.jumpTo({ x: 4, y: 4 });
    await checkersPage.waitForGlobalWait();

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[4][4]).toBe(PieceState.RedKing);
    expect(currentBoard[3][3]).toBe(PieceState.Empty);
    await expect(checkersPage.messageLocator).toContainText("Complete the double jump or click on your piece to stay still.");
    
    await move.jumpTo({ x: 6, y: 2 });

    currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[6][2]).toBe(PieceState.RedKing);
    expect(currentBoard[5][3]).toBe(PieceState.Empty);
  });

  test.fail('Kinging Mid-Multi-Jump', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 5, y: 5, piece: PieceState.Red },
      { x: 4, y: 6, piece: PieceState.Blue },
      { x: 2, y: 6, piece: PieceState.Blue }, // The second piece to be jumped
      { x: 7, y: 7, piece: PieceState.Blue }, // Extra piece
    ];
    await checkersPage.setBoard(setup);
    const move = await checkersPage.startMove({ x: 5, y: 5 });
    await move.jumpTo({ x: 3, y: 7 });

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[3][7]).toBe(PieceState.RedKing);
    expect(currentBoard[4][6]).toBe(PieceState.Empty);

    await expect(checkersPage.messageLocator).toContainText(
      "Complete the double jump or click on your piece to stay still."
    );
    
    // THIS TEST WILL FAIL: The actual message will be 
    // "Select an orange piece to move." because the game bug
    // prematurely ends the player's turn.
    
    // This code will not be reached due to the failed assertion,
    await move.jumpTo({ x: 1, y: 5 });
    currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[1][5]).toBe(PieceState.RedKing);
    expect(currentBoard[2][6]).toBe(PieceState.Empty);
  });

  test.only('Computer gets Kinged', async ({ checkersPage}) => {
    const setup: { x: number; y: number; piece: PieceState }[] = [
      { x: 7, y: 1, piece: PieceState.Blue },
      { x: 2, y: 2, piece: PieceState.Red },
    ];
    await checkersPage.setBoard(setup);
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 3 });
    await checkersPage.waitForGlobalWait();
    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[6][0]).toBe(PieceState.BlueKing);
  });
});