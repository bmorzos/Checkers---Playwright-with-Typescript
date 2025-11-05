import { test, expect } from '../fixtures/Checkers.fixture';
import { PieceState } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Rules Enforcement & Illegal Moves', () => {

  test('Click Empty Square', async ({ basicBoardPage }) => {
    await basicBoardPage.clickSquare(3, 3);
    
    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[3][3]).toBe(PieceState.Empty);
    await expect(basicBoardPage.messageLocator).toContainText("Click on your orange piece");
  });

  test('Click Opponent Piece', async ({ basicBoardPage }) => {
    await basicBoardPage.clickSquare(7, 7);
    
    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[7][7]).toBe(PieceState.Blue);
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    await expect(basicBoardPage.messageLocator).toContainText("Click on your orange piece");
  });

  test('Backwards', async ({ basicBoardPage }) => {
    await basicBoardPage.movePiece({ x: 2, y: 2 }, { x: 1, y: 1 });
    
    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[1][1]).toBe(PieceState.Empty);
  });

  test('Horizontal', async ({ basicBoardPage }) => {
    await basicBoardPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 2 });
    
    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
  });

  test('Vertical', async ({ basicBoardPage }) => {
    await basicBoardPage.movePiece({ x: 2, y: 2 }, { x: 2, y: 3 });
    
    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
  });

  test('Occupied by Self', async ({ basicBoardPage }) => {
    await basicBoardPage.selectPiece({ x: 2, y: 2 });
    await basicBoardPage.selectPiece({ x: 4, y: 2 });
    
    const finalBoard = await basicBoardPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
    expect(finalBoard[4][2]).toBe('red - selected');
  });

  test('Occupied by Opponent, No Capture', async ({ basicBoardPage }) => {
    const adjacentSetup: { x: number; y: number; piece: PieceState }[] = [
      { x: 2, y: 2, piece: PieceState.Red },
      { x: 3, y: 3, piece: PieceState.Blue },
    ];
    await basicBoardPage.setBoard(adjacentSetup);
    await basicBoardPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 3 });
    
    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[3][3]).toBe(PieceState.Blue);
  });
  
  test('Long Diagonal, No Capture', async ({ basicBoardPage }) => {
    await basicBoardPage.movePiece({ x: 2, y: 2 }, { x: 4, y: 4 });
    
    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Red);
    expect(finalBoard[4][4]).toBe(PieceState.Empty);
  });
  
  test('During Opponent Turn', async ({ basicBoardPage }) => {
    await basicBoardPage.selectPiece({ x: 2, y: 2 });
    await basicBoardPage.clickSquare(1, 3);

    await expect(basicBoardPage.messageLocator).toContainText("Select an orange piece to move.");
    
    await basicBoardPage.clickSquare(4, 2);

    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[4][2]).toBe(PieceState.Red);
    expect(finalBoard[1][3]).toBe(PieceState.Red);
  });
});