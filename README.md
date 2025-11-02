Playwright Checkers Test Automation ♟️

This repository contains an end-to-end automated test suite for the web-based Checkers game on gamesforthebrain.com.

It is built with Playwright and TypeScript. It demonstrates a robust Page Object Model (POM) implementation designed to test complex UI interactions and game logic.

🚀 Technology Stack

Playwright: For browser automation and testing.

TypeScript: For type safety and modern JavaScript features.

Node.js: As the runtime environment.

✨ Key Features

This framework is built to be resilient and efficient.

Page Object Model (POM): All logic for interacting with the checkers page is encapsulated in pages/CheckersPage.ts. This makes tests clean and readable.

Custom Board Setup: A powerful setBoard() function directly manipulates the game's internal JavaScript variables. This allows tests to create any board scenario instantly, bypassing slow UI setup.

Visual State Parsing: The getVisualBoardState() method reads the DOM (specifically, the src attribute of each piece's <img> tag) to determine the true visual state of the board. This is crucial for verifying "selected" states, which don't exist in the game's data layer.

Comprehensive Test Suites: Tests are organized by feature:

BasicMoves.spec.ts: Validates simple piece movement and deselection.

Kinging.spec.ts: Validates all logic related to a piece becoming a king and a king's movement.

IllegalMoves.spec.ts: Confirms that the game logic correctly prevents invalid moves.

🏁 Getting Started

1. Prerequisites

Make sure you have Node.js (v16 or higher) installed on your machine.

2. Installation

Clone the repository:

git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME


Install the NPM dependencies:

npm install


Install the Playwright browsers:

npx playwright install


🧪 Running Tests

Here are the most common ways to run the test suite.

Run All Tests

To execute the entire test suite in headless mode (no browser window shown):

npx playwright test


Run in Headed Mode

To watch the tests execute in a live browser window:

npx playwright test --headed


Run a Specific File

To run all tests within a single file (e.g., Kinging.spec.ts):

npx playwright test tests/Kinging.spec.ts


Open the UI Test Runner

To open Playwright's interactive test runner, which is great for debugging:

npx playwright test --ui


📊 Viewing Reports

After a test run, you can open the detailed HTML report to see results, traces, and screenshots.

npx playwright show-report
