import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName, PieceState } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

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

    await checkersPage.movePiece({ x: 2, y: 6 }, { x: 1, y: 7 });

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[1][7]).toBe(PieceState.RedKing);
  });

  test('Become King - Capture Move', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 1, y: 5, piece: "red" },
      { x: 2, y: 6, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.movePiece({ x: 1, y: 5 }, { x: 3, y: 7 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[3][7]).toBe(PieceState.RedKing);
    expect(currentBoard[2][6]).toBe(PieceState.Empty);
  });

  test('King Move - Backward-Left', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 1 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[3][1]).toBe(PieceState.RedKing);
  });

  test('King Move - Backward-Right', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 1, y: 1 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[1][1]).toBe(PieceState.RedKing);
  });

  test('King Capture - Backward', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 1, y: 1, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);

    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 0, y: 0 });

    const currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[2][2]).toBe(PieceState.Empty);
    expect(currentBoard[1][1]).toBe(PieceState.Empty);
    expect(currentBoard[0][0]).toBe(PieceState.RedKing);
  });

  test('King Multi-Jump - Mixed Direction', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 2, y: 2, piece: "redKing" },
      { x: 3, y: 3, piece: "blue" },
      { x: 5, y: 3, piece: "blue" },
      { x: 7, y: 7, piece: "blue" },
    ];
    await checkersPage.setBoard(setup);
    
    const move = await checkersPage.startMove({ x: 2, y: 2 });
    await move.jumpTo({ x: 4, y: 4 });

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[4][4]).toBe(PieceState.RedKing);
    expect(currentBoard[3][3]).toBe(PieceState.Empty);
    expect(await checkersPage.getMessageText()).toContain("Complete the double jump or click on your piece to stay still.");
    
    await move.jumpTo({ x: 6, y: 2 });

    currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[6][2]).toBe(PieceState.RedKing);
    expect(currentBoard[5][3]).toBe(PieceState.Empty);
  });

  test('Kinging Mid-Multi-Jump', async ({ page }) => {
    const setup: { x: number; y: number; piece: PieceName }[] = [
      { x: 5, y: 5, piece: "red" },
      { x: 4, y: 6, piece: "blue" },
      { x: 2, y: 6, piece: "blue" }, // The second piece to be jumped
      { x: 7, y: 7, piece: "blue" }, // Extra piece
    ];
    await checkersPage.setBoard(setup);

    const move = await checkersPage.startMove({ x: 5, y: 5 });
    
    await move.jumpTo({ x: 3, y: 7 });

    let currentBoard = await checkersPage.getLogicalBoardState();
    expect(currentBoard[3][7]).toBe(PieceState.RedKing);
    expect(currentBoard[4][6]).toBe(PieceState.Empty);
    
    expect(await checkersPage.getMessageText()).toContain(
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
});