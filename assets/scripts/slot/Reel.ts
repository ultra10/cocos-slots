import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  Vec3,
  SpriteFrame,
} from "cc";

import { Symbol } from "./Symbol";
import { EventBus } from "../util/EventBus";
import { GameEvents } from "../enums/GameEvents";

const { ccclass, property } = _decorator;

@ccclass("Reel")
export class Reel extends Component {
  @property(Prefab)
  symbolPrefab!: Prefab;

  @property(Node)
  container!: Node;

  @property([SpriteFrame])
  symbolFrames: SpriteFrame[] = [];

  symbols: Symbol[] = [];

  symbolHeight = 192;

  private spinning = false;
  private speed = 1800;
  private spinTime = 0;
  private target: number[] = [];
  private isChangedThisSpin: boolean[] = [false, false, false];
  private highlighted: Set<Symbol> = new Set();

  onLoad() {
    this.createSymbols();
  }

  createSymbols() {
    for (let i = 0; i < 5; i++) {
      const node = instantiate(this.symbolPrefab);

      node.setParent(this.container);

      node.position = new Vec3(0, -i * this.symbolHeight, 0);

      const symbol = node.getComponent(Symbol)!;

      const id = Math.floor(Math.random() * this.symbolFrames.length);

      symbol.setSymbol(`ID-${id}`, this.symbolFrames[id]);

      this.symbols.push(symbol);
    }
  }

  spin(result: number[]) {
    if (this.spinning) return;

    this.target = result;

    this.spinning = true;

    this.spinTime = 1.5;
  }

  update(dt: number) {
    if (!this.spinning) return;

    this.spinTime -= dt;

    this.symbols.forEach((symbol, index) => {
      const pos = symbol.node.position;

      let newY = pos.y - this.speed * dt;

      if (newY <= -this.symbolHeight * 5) {
        newY += this.symbolHeight * 5;

        if (index >= 1 && index <= 3 && !this.isChangedThisSpin[index - 1]) {
          this.isChangedThisSpin[index - 1] = true;
          symbol.setSymbol(
            `ID-${index}`,
            this.symbolFrames[this.target[index - 1]],
          );
        }
      }

      symbol.node.setPosition(new Vec3(pos.x, newY, pos.z));
    });

    if (this.spinTime <= 0) {
      this.stop();
    }
  }

  stop() {
    this.spinning = false;
    this.isChangedThisSpin = [false, false, false];

    for (let i = 0; i < 5; i++) {
      this.symbols[i].node.position = new Vec3(0, -i * this.symbolHeight, 0);
    }

    EventBus.emit(GameEvents.REEL_STOPPED);
  }

  highlightSymbol(row: number) {
    const symbol = this.symbols[row + 1];

    if (!symbol) return;

    if (this.highlighted.has(symbol)) return;

    this.highlighted.add(symbol);

    symbol.highlight();
  }

  stopHighlight() {
    this.highlighted.forEach((symbol) => {
      symbol.stopHighlight();
    });

    this.highlighted.clear();
  }
}
