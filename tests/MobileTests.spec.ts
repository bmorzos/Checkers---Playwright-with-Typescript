import { test, expect } from '../fixtures/Checkers.fixture';
import { devices } from '@playwright/test';

// Use a mobile viewport for all tests in this file
test.use({ ...devices['iPhone 13'] });

test.describe.configure({ mode: 'parallel' });

test.describe('Checkers Responsiveness (Mobile)', () => {

  test('Mobile - Render', async ({ checkersPage}) => {
    await expect(checkersPage.pageHeader).toBeVisible();
    await expect(checkersPage.messageLocator).toBeVisible();
    await expect(checkersPage.restartLink).toBeVisible();
  });

  test.skip('Mobile - Play', async ({ checkersPage}) => {
    
  });

  test.skip('Mobile - Restart', async ({ checkersPage}) => {
    
  });
});