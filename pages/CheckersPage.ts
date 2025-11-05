import { Page, Locator, expect } from '@playwright/test';

export type PieceName = "red" | "blue" | "redKing" | "blueKing";
export type Coords = { x: number; y: number };
export type LogicalBoard = number[][];

export enum PieceState {
  Empty = 0,
  Red = 1,
  Blue = -1,
  RedKing = 1.1,
  BlueKing = -1.1,
}

export class MoveInProgress {
  constructor(private checkersPage: CheckersPage) {}

  async jumpTo(to: Coords) {
    await this.checkersPage.clickSquare(to.x, to.y);
  }
}

export class CheckersPage {
  readonly messageLocator: Locator;
  readonly pageHeader: Locator;
  readonly rulesLink: Locator;
  readonly restartLink: Locator;

  private pieceMap: { [key in PieceName]: number } = {
    "red": 1,
    "blue": -1,
    "redKing": 1.1,
    "blueKing": -1.1,
  };

  readonly rulesLinkHref: string = 'https://en.wikipedia.org/wiki/English_draughts#Starting_position';

  constructor(private page: Page) {
    this.messageLocator = this.page.locator('#message');
    this.pageHeader = this.page.getByRole('heading', { name: 'Checkers' });
    this.rulesLink = this.page.getByRole('link', { name: 'Rules' });
    this.restartLink = this.page.getByRole('link', { name: 'Restart...' });
  }

  async navigate() {
    await this.page.goto('/game/checkers/');
  }

  getSquareLocator(x: number, y: number): Locator {
    return this.page.locator(`img[name="space${x}${y}"]`);
  }

  async clickSquare(x: number, y: number) {
    await this.getSquareLocator(x, y).click();
  }

  async selectPiece(coords: Coords) {
    await this.clickSquare(coords.x, coords.y);
  }

  async movePiece(from: Coords, to: Coords) {
    await this.selectPiece(from);
    await this.clickSquare(to.x, to.y);
  }

  async startMove(from: Coords): Promise<MoveInProgress> {
    await this.selectPiece(from);
    return new MoveInProgress(this);
  }

  async waitForGlobalWait(): Promise<void> {
    await this.page.waitForFunction(() => (window as any).g_wait === false, {
      timeout: 3000
    });
  }

  async setBoard(pieces: { x: number; y: number; piece: PieceName }[]) {
    
    const piecesForGame = pieces.map(p => ({
      x: p.x,
      y: p.y,
      piece: this.pieceMap[p.piece] || 0,
    }));

    await this.page.evaluate((piecesToPlace) => {
      const win = window as any;
      const board = win.board; // This IS global
      const draw = win.draw; // This IS global

      // 1. Clear the logical board
      for (let i = 0; i < 8; i++) {
        board[i] = new Array(); // Ensure it's a new array
        for (let j = 0; j < 8; j++) {
          board[i][j] = 0;
        }
      }

  
      // This mimics the original Board() constructor and prevents AI crashes.
      // We fill them with 0s to prevent 'integ(undefined)' which returns 'null'.
      board[-2] = [0,0,0,0,0,0,0,0];
      board[-1] = [0,0,0,0,0,0,0,0];
      board[8] = [0,0,0,0,0,0,0,0];
      board[9] = [0,0,0,0,0,0,0,0];


      // 3. Set the pieces on the board. The AI reads this.
      for (const p of piecesToPlace) {
        board[p.x][p.y] = p.piece;
      }

      // 4. Redraw the visual board
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          draw(i, j, getImgName(piece, i, j));
        }
      }

      // 5. Reset all global state variables from the game's source code!
      win.g_wait = false;
      win.my_turn = true;
      win.piece_toggled = false;
      win.double_jump = false;
      win.comp_move = false;
      win.game_is_over = false;
      win.safe_from = null;
      win.safe_to = null;
      win.toggler = null;
      win.togglers = 0;
      
      // Also reset the UI feedback
      win.document.getElementById('message').innerText = 'Select an orange piece to move.';

      // Helper function (must be inside evaluate)
      function getImgName(piece: number, i: number, j: number): string {
        if (piece === 1) return 'you1.gif';
        if (piece === -1) return 'me1.gif';
        if (piece === 1.1) return 'you1k.gif';
        if (piece === -1.1) return 'me1k.gif';
        return ((i % 2) + j) % 2 === 0 ? 'gray.gif' : 'black.gif';
      }

    }, piecesForGame);
  }


  async getMessageText(): Promise<string> {
    return await this.messageLocator.textContent() || "";
  }

  async getLogicalBoardState(): Promise<LogicalBoard> {
    const boardState = await this.page.evaluate(() => {
      const win = window as any;
      return win.board;
    });
    return boardState as LogicalBoard;
  }

  async getVisualBoardState(): Promise<string[][]> {
    const visualState = await this.page.evaluate(() => {
      const images = document.querySelectorAll('#board img');
      const visualBoard: { [key: string]: string } = {};

      images.forEach(img => {
        const name = img.getAttribute('name'); // e.g., "space22"
        const src = img.getAttribute('src') || '';
        
        let state = 'unknown';
        if (src.includes('you2.gif')) {
          state = 'red - selected';
        } else if (src.includes('me2.gif')) {
          state = 'blue - selected';
        } else if (src.includes('you2k.gif')) {
          state = 'redKing - selected';
        } else if (src.includes('me2k.gif')) {
          state = 'blueKing - selected';
        } else if (src.includes('you1k.gif')) {
          state = 'redKing';
        } else if (src.includes('me1k.gif')) {
          state = 'blueKing';
        } else if (src.includes('you1.gif')) {
          state = 'red';
        } else if (src.includes('me1.gif')) {
          state = 'blue';
        } else if (src.includes('gray.gif')) {
          state = 'empty';
        } else if (src.includes('black.gif')) {
          state = 'non-playable';
        }

        if (name) {
          visualBoard[name] = state;
        }
      });
      return visualBoard;
    });

    // Re-map the flat object to a 2D array
    const finalBoard = Array(8).fill(null).map(() => Array(8).fill("unknown"));
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        const name = `space${i}${j}`;
        if (visualState[name]) {
          finalBoard[i][j] = visualState[name];
        }
      }
    }
    return finalBoard;
  }
}

  