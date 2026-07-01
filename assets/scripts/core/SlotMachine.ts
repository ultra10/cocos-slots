import { _decorator, Component } from "cc";

import { EventBus } from "../util/EventBus";
import { GameEvents } from "../enums/GameEvents";
import { Reel } from "../slot/Reel";
import { Server, SpinResult } from "./Server";
import { paylines, Paylines } from "./Paylines";
import { Win } from "./Win";

const { ccclass, property } = _decorator;

@ccclass("SlotMachine")
export class SlotMachine extends Component {
  private reels: Reel[] = [];
  private server: Server;
  private spinning: boolean = false;
  private stoppedReelsCount: number = 0;

  private lastSpinResult: SpinResult | null = null;

  @property(Paylines)
  paylines: Paylines = null!;

  @property(Win)
  win: Win = null!;

  onLoad() {
    const reelsNode = this.node.children[0];

    this.server = new Server();

    this.reels = reelsNode.children
      .map((node) => node.getComponent(Reel))
      .filter((reel): reel is Reel => reel !== null);

    EventBus.on(GameEvents.SPIN_REQUEST, () => {
      this.spin();
    });

    EventBus.on(GameEvents.REEL_STOPPED, () => {
      this.onReelStopped();
    });
  }

  spin() {
    if (this.spinning) {
      return;
    }
    EventBus.emit(GameEvents.SPIN_STARTED);
    this.paylines.hideAllLines();
    this.win.hide();

    this.spinning = true;
    const result = this.server.getSpinResult();
    this.lastSpinResult = result;
    console.log("Spin result:", result);

    this.reels.forEach((reel, index) => {
      reel.stopHighlight(); // Stop any previous highlights before spinning
      reel.spin(result.symbols[index]);
    });
  }

  onReelStopped() {
    this.stoppedReelsCount++;
    if (this.stoppedReelsCount >= this.reels.length) {
      EventBus.emit(GameEvents.ALL_REELS_STOPPED);
      this.stoppedReelsCount = 0;
      this.spinning = false;
      if (this.lastSpinResult) {
        if (this.lastSpinResult.winLines.length > 0) {
          this.lastSpinResult.winLines.forEach((winLine) => {
            this.paylines.showLine(winLine.line);
          });
        }

        if (this.lastSpinResult.winAmount > 0) {
          this.win.show(this.lastSpinResult.winAmount);
        }

        this.highlightWins();
      }
      this.lastSpinResult = null;
    }
  }

  private highlightWins() {
    if (!this.lastSpinResult) return;

    this.lastSpinResult.winLines.forEach((win) => {
      const payline = paylines[win.line];

      for (let reelIndex = 0; reelIndex < win.count; reelIndex++) {
        const row = payline[reelIndex];

        const reel = this.reels[reelIndex];
        if (!reel) continue;
        reel.highlightSymbol(row);
      }
    });
  }

  onDestroy() {
    EventBus.off(GameEvents.SPIN_REQUEST, this.spin);
    EventBus.off(GameEvents.REEL_STOPPED, this.onReelStopped);
  }
}
