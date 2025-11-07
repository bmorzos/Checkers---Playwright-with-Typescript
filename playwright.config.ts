import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  expect: {
    toHaveScreenshot: {
      // An acceptable pixel difference. Prevents failures from
      // tiny anti-aliasing changes between runs.
      maxDiffPixels: 100,
      
      // Helps stabilize tests by disabling animations
      animations: 'disabled',
      caret: 'hide',
    }
  },
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://www.gamesforthebrain.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      testIgnore: /.*MobileTests.spec.ts/,
      use: {
        ...devices['Desktop Chrome'],
       },
    },

    {
      name: 'firefox',
      testIgnore: /.*MobileTests.spec.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        },
    },

    {
      name: 'webkit',
      testIgnore: /.*MobileTests.spec.ts/,
      use: { 
        ...devices['Desktop Safari'],
       },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      testMatch: /.*MobileTests.spec.ts/,
      use: { 
        ...devices['Pixel 9'],
       },
    },
    {
      name: 'Mobile Safari',
      testMatch: /.*MobileTests.spec.ts/,
      use: { 
        ...devices['iPhone 12'],
       },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
