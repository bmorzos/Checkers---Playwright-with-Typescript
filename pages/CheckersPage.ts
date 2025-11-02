import { Page } from '@playwright/test';

export type PieceName = "red" | "blue" | "redKing" | "blueKing";

export class CheckersPage {
  private pieceMap: { [key: string]: number } = {
    "red": 1,
    "blue": -1,
    "redKing": 1.1,
    "blueKing": -1.1,
  };

  private reversePieceMap: { [key: number]: string } = {
    1: "red",
    "-1": "blue",
    1.1: "redKing",
    "-1.1": "blueKing",
    0: "empty"
  };
  
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://www.gamesforthebrain.com/game/checkers/');
  }

  async clickSquare(x: number, y: number) {
    await this.page.locator(`img[name="space${x}${y}"]`).click();
  }

  async getBoardState(): Promise<any[][]> {
    return await this.page.evaluate(() => (window as any).board);
  }

  async skipGameWait() {
    await this.page.evaluate(() => {
      const win = window as any;
      win.g_wait = false;
      win.my_turn = true;
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
      const board = win.board;
      const draw = win.draw;

      function getImgName(piece: number, i: number, j: number): string {
        if (piece === 1) return 'you1.gif';
        if (piece === -1) return 'me1.gif';
        if (piece === 1.1) return 'you1k.gif';
        if (piece === -1.1) return 'me1k.gif';
        return ((i % 2) + j) % 2 === 0 ? 'gray.gif' : 'black.gif';
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          board[i][j] = 0;
        }
      }

      for (const piece of piecesToPlace) {
        board[piece.x][piece.y] = piece.piece;
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          draw(i, j, getImgName(piece, i, j));
        }
      }
    }, piecesForGame);

    await this.skipGameWait();
  }

  async getCurrentMessage(): Promise<string | null> {
    const messageElement = this.page.locator('#message');
    return await messageElement.textContent();
  }

  async getVisualBoardState(): Promise<string[][]> {
    const dataBoard = await this.getReadableBoardState();

    const visualState = await this.page.evaluate(() => {
      const images = document.querySelectorAll('#board img');
      const visualBoard: { [key: string]: string } = {};
      
      images.forEach(img => {
        const name = img.getAttribute('name'); // e.g., "space22"
        const src = img.getAttribute('src') || '';
        
        let state = 'unknown';
        if (src.includes('you2.gif') || src.includes('me2.gif')) {
          state = 'selected';
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

    // 3. Merge the data board with the visual "selected" state
    for (let j = 0; j < 8; j++) { // y-axis
      for (let i = 0; i < 8; i++) { // x-axis
        const name = `space${i}${j}`;
        if (visualState[name] === 'selected') {
          dataBoard[i][j] = 'selected';
        }
      }
    }
    
    return dataBoard;
  }

  async getReadableBoardState(): Promise<string[][]> {
    const numericBoard = await this.getBoardState();
    const readableBoard = Array(8).fill(null).map(() => Array(8).fill("empty"));

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = numericBoard[i][j];
            readableBoard[i][j] = this.reversePieceMap[piece] || 'empty';
        }
    }
    return readableBoard;
  }
}

