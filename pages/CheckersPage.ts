import { Page, Locator, expect } from '@playwright/test';

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
  readonly rulesLinkHref: string = 'https://en.wikipedia.org/wiki/English_draughts#Starting_position';

  constructor(private page: Page) {
    this.messageLocator = this.page.locator('#message');
    this.pageHeader = this.page.getByRole('heading', { name: 'Checkers' });
    this.rulesLink = this.page.getByRole('link', { name: 'Rules' });
    this.restartLink = this.page.getByRole('link', { name: 'Restart...' });
  }

  // Maps logical state numbers to their base image filename
  private readonly pieceImageMap = {
    [PieceState.Red]: 'you1.gif',
    [PieceState.Blue]: 'me1.gif',
    [PieceState.RedKing]: 'you1k.gif',
    [PieceState.BlueKing]: 'me1k.gif',
  };

  // Maps all image filenames to the string state used in tests
  private readonly visualStateMap: { [key: string]: string } = {
    'you1.gif': 'red',
    'me1.gif': 'blue',
    'you1k.gif': 'redKing',
    'me1k.gif': 'blueKing',
    'you2.gif': 'red - selected',
    'me2.gif': 'blue - selected',
    'you2k.gif': 'redKing - selected',
    'me2k.gif': 'blueKing - selected',
    'gray.gif': 'empty',
    'black.gif': 'non-playable',
  };

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
    await this.selectPiece(to);
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

  async setBoard(pieces: { x: number; y: number; piece: PieceState }[]) {
    
    // Pass both the pieces and our new map into the browser context
    await this.page.evaluate(({ piecesToPlace, imageMap }) => {
      const win = window as any;
      const board = win.board; // This IS global
      const draw = win.draw; // This IS global

      // 1. Clear the logical board
      for (let i = 0; i < 8; i++) {
        board[i] = new Array();
        for (let j = 0; j < 8; j++) {
          board[i][j] = 0;
        }
      }
  
      // This mimics the original Board() constructor...
      board[-2] = [0,0,0,0,0,0,0,0];
      board[-1] = [0,0,0,0,0,0,0,0];
      board[8] = [0,0,0,0,0,0,0,0];
      board[9] = [0,0,0,0,0,0,0,0];

      // 3. Set the pieces on the board.
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

      // 5. Reset all global state variables...
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
      win.document.getElementById('message').innerText = 'Select an orange piece to move.';

      function getImgName(piece: number, i: number, j: number): string {
        const imageName = (imageMap as any)[piece];
        if (imageName) return imageName;

        return ((i % 2) + j) % 2 === 0 ? 'gray.gif' : 'black.gif';
      }

    }, { piecesToPlace: pieces, imageMap: this.pieceImageMap });
  }

  async getLogicalBoardState(): Promise<LogicalBoard> {
    const boardState = await this.page.evaluate(() => {
      const win = window as any;
      return win.board;
    });
    return boardState as LogicalBoard;
  }

  private getVisualStateFromSrc(src: string | null): string {
      if (!src) return 'unknown';
      const matchingKey = Object.keys(this.visualStateMap).find(key => src.includes(key));

      return matchingKey ? this.visualStateMap[matchingKey] : 'unknown';
  }

  async getVisualBoardState(): Promise<string[][]> {
    const boardState = Array(8).fill(null).map(() => Array(8).fill("unknown"));

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const imageSrc = await this.getSquareLocator(i, j).getAttribute('src');
        boardState[i][j] = this.getVisualStateFromSrc(imageSrc);
      }
    }
    
    return boardState;
  }
}

  