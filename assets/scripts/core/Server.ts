import { PayTable, payTable } from "../enums/PayTable";
import { Payline, paylines } from "./Paylines";

export type SpinResult = {
  symbols: number[][];
  winLines: WinLines[];
  winAmount: number;
};

export type WinLines = {
  line: number;
  symbol: number;
  count: number;
};

type WinScore = {
  line: number;
  symbol: number;
  count: number;
  win: number;
};

const SYMBOL_WILD_ID = 0;
/**
 * normaly  we get thos info from server, but for this demo we will generate it on client side
 */
export class Server {
  private paylines: Payline[] = paylines;
  private payTable: PayTable = payTable;

  getSpinResult(): SpinResult {
    const result: number[][] = [];

    // 5 reels (kolumn), 3 rows
    for (let col = 0; col < 5; col++) {
      const reel: number[] = [];

      for (let row = 0; row < 3; row++) {
        reel.push(Math.floor(Math.random() * 10));
      }

      result.push(reel);
    }

    const winLines = this.checkWins(result);

    return {
      symbols: result,
      winLines,
      winAmount: this.calculateWin(winLines),
    };
  }

  checkWins(board: number[][]): WinLines[] {
    const wins: WinLines[] = [];

    this.paylines.forEach((line, lineIndex) => {
      // map payline -> board[col][row]
      const symbols = line.map((row, col) => board[col][row]);

      // find first non-wild symbol
      let baseSymbol = symbols.find((s) => s !== SYMBOL_WILD_ID);

      // if only wilds -> wild becomes base
      if (baseSymbol === undefined) {
        baseSymbol = SYMBOL_WILD_ID;
      }

      let count = 0;

      // left-to-right evaluation
      for (let col = 0; col < symbols.length; col++) {
        const symbol = symbols[col];

        if (symbol === baseSymbol || symbol === SYMBOL_WILD_ID) {
          count++;
        } else {
          break;
        }
      }

      // min 3 match rule
      if (count >= 3) {
        wins.push({
          line: lineIndex,
          symbol: baseSymbol,
          count,
        });
      }
    });

    return wins;
  }

  calculateWin(wins: WinLines[]): number {
    let total = 0;

    const details: WinScore[] = [];

    for (const winLine of wins) {
      const symbolTable = this.payTable[winLine.symbol];

      if (!symbolTable) continue;

      const payout = symbolTable[winLine.count];

      if (!payout) continue;

      total += payout;
    }

    return total;
  }
}
