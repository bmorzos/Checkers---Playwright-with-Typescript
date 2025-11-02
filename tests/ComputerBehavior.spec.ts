import { test, expect } from '@playwright/test';
import { CheckersPage, PieceName } from '../pages/CheckersPage';

test.describe('Checkers Computer Behavior (Sanity Checks)', () => {
  let checkersPage: CheckersPage;

  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page);
    await checkersPage.navigate();
  });

  test('Computer - Valid Move', async ({ page }) => {
    // Test logic goes here
  });

  test('Computer - Capture', async ({ page }) => {
    // Test logic goes here
  });

  test('Computer - Kinging', async ({ page }) => {
    // Test logic goes here
  });
});
