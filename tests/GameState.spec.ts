import { test, expect } from '../fixtures/Checkers.fixture';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Game State & UI Feedback', () => {

  test('Initial board state is correct', async ({ checkersPage, initialBoardState }) => {
    const actualBoard = await checkersPage.getLogicalBoardState();
    expect(actualBoard).toEqual(initialBoardState);
    await expect(checkersPage.pageHeader).toBeVisible();
    await expect(checkersPage.messageLocator).toBeVisible();
    await expect(checkersPage.restartLink).toBeVisible();
    await expect(checkersPage.rulesLink).toBeVisible();
    await expect(checkersPage.rulesLink).toHaveAttribute(
      'href',
      checkersPage.rulesLinkHref
    );
  });

  test('Restart Button - Mid-Game', async ({ checkersPage, initialBoardState }) => {
    await checkersPage.movePiece({ x: 2, y: 2 }, { x: 3, y: 3 });
    
    const modifiedBoard = await checkersPage.getLogicalBoardState();
    expect(modifiedBoard).not.toEqual(initialBoardState);

    await checkersPage.restartLink.click();
    await expect(checkersPage.messageLocator).toBeVisible();

    const finalBoard = await checkersPage.getLogicalBoardState();
    expect(finalBoard).toEqual(initialBoardState);
  });

  test.skip('Computer Move Visual', async ({ checkersPage }) => {
    
  });

  test.skip('Win Condition - Capture All', async ({ checkersPage }) => {
    
  });

  test.skip('Loss Condition - No Pieces', async ({ checkersPage }) => {
    
  });

  test.skip('Loss Condition - No Moves', async ({ checkersPage }) => {

  });
  
});