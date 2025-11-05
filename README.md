# Playwright Checkers Test Automation ♟️

![Playwright Tests](https://img.shields.io/badge/tests-Playwright-2EAD33?logo=playwright)

This repository contains an end-to-end automated test suite for the web-based [Checkers game on gamesforthebrain.com](https://www.gamesforthebrain.com/game/checkers/).

This project serves as a practical portfolio piece, demonstrating a robust Page Object Model (POM) implementation designed to test complex UI interactions, stateful game logic, and advanced automation techniques.

## 🚀 Technology Stack

* **[Playwright](https://playwright.dev/)**: For browser automation and testing.
* **[TypeScript](https://www.typescriptlang.org/)**: For type safety and modern JavaScript features.
* **[Node.js](https://nodejs.org/)**: As the runtime environment.

## ✨ Key Features

This framework is built to be resilient and efficient, with several key design patterns:

* **Page Object Model (POM)**: All logic for interacting with the checkers page is encapsulated in `pages/CheckersPage.ts`, making tests clean and readable.
* **Custom Board Setup**: A powerful `setBoard()` function directly manipulates the game's internal JavaScript variables. This allows tests to create *any* board scenario instantly, bypassing slow UI setup and ensuring perfect test isolation.
* **Logical & Visual State Parsing**:
    * `getLogicalBoardState()`: Reads the game's internal `board` array to verify the data state.
    * `getVisualBoardState()`: Reads the DOM (the `src` attribute of each `<img>` tag) to verify the UI state, which is crucial for testing "selected" pieces that don't exist in the data layer.
* **Custom Fixtures**: The `fixtures/Checkers.fixture.ts` file creates custom test fixtures (like `basicBoardPage`) that provide a pre-configured board state for specific test suites, reducing boilerplate code.

## 📂 Test Suites

Tests are organized by feature, demonstrating comprehensive coverage of the game's mechanics:

* `GameState.spec.ts`: Verifies the initial board state and core UI elements.
* `BasicMoves.spec.ts`: Validates simple piece selection, deselection, and movement.
* `IllegalMoves.spec.ts`: Confirms that the game logic correctly prevents invalid moves (e.g., moving backward, landing on your own piece).
* `CaptureMoves.spec.ts`: Tests single-jump and multi-jump capture mechanics.
* `Kinging.spec.ts`: Validates all logic for a piece becoming a king and a king's unique movement (including backward captures).
* `MobileTests.spec.ts`: Checks the responsiveness and basic functionality of the site on a mobile viewport.

## 🏁 Getting Started

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.

### 2. Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  Install the NPM dependencies:
    ```bash
    npm install
    ```

3.  Install the Playwright browsers:
    ```bash
    npx playwright install
    ```

## 🧪 Running Tests

### Run All Tests (Headless)

To execute the entire test suite in headless mode across all browsers defined in the config:

```bash
npx playwright test
```

### Run Tests in UI Mode
To open the Playwright UI Mode for a "time-traveling" debugger experience:

```Bash

npx playwright test --ui
```

### View the HTML Report
After a test run, view the full HTML report:

```Bash

npx playwright show-report
```
