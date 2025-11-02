import { test, expect, devices } from '@playwright/test';
import { CheckersPage, PieceName } from '../pages/CheckersPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Responsiveness (Mobile)', () => {
  let checkersPage: CheckersPage;

  // Use a mobile viewport for all tests in this file
  // test.use({ ...devices['iPhone 13'] });

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.navigate();
  });

  test('Mobile - Render', async ({ page }) => {
    
  });

  test('Mobile - Play', async ({ page }) => {
    
  });

  test('Mobile - Restart', async ({ page }) => {
    
  });
});