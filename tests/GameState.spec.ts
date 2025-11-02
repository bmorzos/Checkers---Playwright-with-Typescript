import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName, PieceState } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Game State & UI Feedback', () => {
  let checkersPage: CheckersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.navigate();
  });

  test('Restart Button - Mid-Game', async ({ page }) => {
    
  });

  test('Computer Move Visual', async ({ page }) => {
    
  });

  test('Win Condition - Capture All', async ({ page }) => {
    
  });

  test('Loss Condition - No Pieces', async ({ page }) => {
    
  });

  test('Loss Condition - No Moves', async ({ page }) => {
    
  });
});