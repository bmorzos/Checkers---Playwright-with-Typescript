import { test as base } from '@playwright/test';
import { CheckersPage, PieceName } from '../pages/CheckersPage';

type MyFixtures = {
  checkersPage: CheckersPage;
  basicBoardPage: CheckersPage;
  initialBoardState: number[][];
};

const basicSetup: { x: number; y: number; piece: PieceName }[] = [
  { x: 2, y: 2, piece: "red" },
  { x: 4, y: 2, piece: "red" },
  { x: 7, y: 7, piece: "blue" },
];

const initialBoardState: number[][] = [
  [1, 0, 1, 0, 0, 0, -1, 0], // x=0
  [0, 1, 0, 0, 0, -1, 0, -1], // x=1
  [1, 0, 1, 0, 0, 0, -1, 0], // x=2
  [0, 1, 0, 0, 0, -1, 0, -1], // x=3
  [1, 0, 1, 0, 0, 0, -1, 0], // x=4
  [0, 1, 0, 0, 0, -1, 0, -1], // x=5
  [1, 0, 1, 0, 0, 0, -1, 0], // x=6
  [0, 1, 0, 0, 0, -1, 0, -1], // x=7
  [], //game padding
  [], //game padding
];

export const test = base.extend<MyFixtures>({
  
  checkersPage: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (
        url.includes('googlesyndication.com') ||
        url.includes('criteo.com') ||
        url.includes('doubleclick.net')
      ) {
        return route.abort();
      }
      return route.continue();
    });
    const checkersPage = new CheckersPage(page);
    await checkersPage.navigate();
    await use(checkersPage);
  },

  basicBoardPage: async ({ checkersPage }, use) => {
    await checkersPage.setBoard(basicSetup);
    await use(checkersPage);
  },

  initialBoardState: async ({}, use) => {
    await use(initialBoardState);
  },

});

export { expect } from '@playwright/test';