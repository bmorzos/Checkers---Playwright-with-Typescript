import { test, expect } from '../fixtures/Checkers.fixture';
import { PieceState } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Basic Mechanics', () => {

  test('Select Piece', async ({ basicBoardPage }) => {
    await basicBoardPage.selectPiece({ x: 2, y: 2 });

    const finalBoard = await basicBoardPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red - selected');
  });

  test('Deselect Piece', async ({ basicBoardPage }) => {
    await basicBoardPage.selectPiece({ x: 2, y: 2 });
    await basicBoardPage.selectPiece({ x: 2, y: 2 });

    const finalBoard = await basicBoardPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
  });

  test('Switch Selection', async ({ basicBoardPage }) => {
    await basicBoardPage.selectPiece({ x: 2, y: 2 });
    await basicBoardPage.selectPiece({ x: 4, y: 2 });

    const finalBoard = await basicBoardPage.getVisualBoardState();
    expect(finalBoard[2][2]).toBe('red');
    expect(finalBoard[4][2]).toBe('red - selected');
  });

  test('Valid Forward-Left Move', async ({ basicBoardPage }) => {
    await basicBoardPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 3 });

    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Empty);
    expect(finalBoard[3][3]).toBe(PieceState.Red);

    await expect(basicBoardPage.messageLocator).toContainText('Select an orange piece to move.');
  });

  test('Valid Forward-Right Move', async ({ basicBoardPage }) => {
    await basicBoardPage.movePiece({ x: 2, y: 2 }, { x: 1, y: 3 });

    const finalBoard = await basicBoardPage.getLogicalBoardState();
    expect(finalBoard[2][2]).toBe(PieceState.Empty);
    expect(finalBoard[1][3]).toBe(PieceState.Red);

    await expect(basicBoardPage.messageLocator).toContainText('Select an orange piece to move.');
  });
});