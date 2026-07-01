import {
  _decorator,
  Component,
  Sprite,
  SpriteFrame,
  tween,
  Tween,
  Vec3,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("Symbol")
export class Symbol extends Component {
  @property(Sprite)
  sprite!: Sprite;

  private id: string = "";

  public changedThisSpin: boolean = false;

  private pulseTween: Tween | null = null;

  setSymbol(id: string, frame: SpriteFrame) {
    this.id = id;
    this.sprite.spriteFrame = frame;
  }

  getId() {
    return this.id;
  }

  highlight() {
    if (this.pulseTween) return;

    this.node.setScale(1, 1, 1);

    this.pulseTween = tween(this.node)
      .to(0.35, { scale: new Vec3(1.15, 1.15, 1) }, { easing: "sineOut" })
      .to(0.35, { scale: new Vec3(1, 1, 1) }, { easing: "sineIn" })
      .union()
      .repeatForever()
      .start();
  }

  stopHighlight() {
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = null;
    }

    this.node.setScale(1, 1, 1);
  }
}
