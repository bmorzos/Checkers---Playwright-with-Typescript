# Playwright Checkers Test automation ♟️

This repository contains an end-to-end automated test suite for the web-based [Checkers game on gamesforthebrain.com](https://www.gamesforthebrain.com/game/checkers/).

It is built with **Playwright** and **TypeScript**. It demonstrates a robust Page Object Model (POM) implementation designed to test complex UI interactions and game logic.

## 🚀 Technology Stack

* [**Playwright**](https://playwright.dev/): For browser automation and testing.
* [**TypeScript**](https://www.typescriptlang.org/): For type safety and modern JavaScript features.
* [**Node.js**](https://nodejs.org/): As the runtime environment.

## ✨ Key Features

This framework is built to be resilient and efficient.

* **Page Object Model (POM)**: All logic for interacting with the checkers page is encapsulated in `pages/CheckersPage.ts`. This makes tests clean and readable.
* **Custom Board Setup**: A powerful `setBoard()` function directly manipulates the game's internal JavaScript variables. This allows tests to create *any* board scenario instantly, bypassing slow UI setup.
* **Visual State Parsing**: The `getVisualBoardState()` method reads the DOM (specifically, the `src` attribute of each piece's `<img>` tag) to determine the true visual state of the board. This is crucial for verifying "selected" states, which don't exist in the game's data layer.
* **Comprehensive Test Suites**: Tests are organized by feature:
    * `BasicMoves.spec.ts`: Validates simple piece movement and deselection.
    * `Kinging.spec.ts`: Validates all logic related to a piece becoming a king and a king's movement.
    * `IllegalMoves.spec.ts`: Confirms that the game logic correctly prevents invalid moves.

## 🏁 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.

### Installation

1.  **Clone the repository:**
    (Replace `YOUR_USERNAME/YOUR_REPO_NAME` with your actual repository path)

    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
    cd YOUR_REPO_NAME
    ```

2.  **Install the NPM dependencies:**

    ```bash
    npm install
    ```

3.  **Install the Playwright browsers:**

    ```bash
    npx playwright install
    ```

## 🧪 Running Tests

Here are the most common ways to run the test suite.

### Run All Tests

To execute the entire test suite in headless mode (no browser window shown):

```bash
npx playwright test
```

### Run in Headed Mode

To watch the tests execute in a live browser window:

```bash
npx playwright test --headed
```

### Run a Specific File

To run all tests within a single file (e.g., Kinging.spec.ts):

```bash
npx playwright test tests/Kinging.spec.ts
```

### Open the UI Test Runner

To open Playwright's interactive test runner, which is great for debugging:

```bash
npx playwright test --ui
```

## 📊 Viewing Reports

After a test run, you can open the detailed HTML report to see results, traces, and screenshots.

```bash
npx playwright show-report
```
