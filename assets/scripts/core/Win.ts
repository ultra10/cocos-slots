import { _decorator, Component, Label, Tween, tween, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Win")
export class Win extends Component {
  @property(Label)
  titleLabel: Label = null!;
  @property(Label)
  amountLabel: Label = null!; // "$123"

  private pulseTween: Tween = null;

  onLoad() {
    this.node.active = false;
  }

  show(amount: number) {
    this.node.active = true;

    this.amountLabel.string = `$${amount}`;
    this.titleLabel.string = "YOU WIN"; // text can be get from some i18n system

    this.startPulse();
  }

  hide() {
    this.stopPulse();

    this.node.active = false;
  }

  private startPulse() {
    this.stopPulse();

    const target = new Vec3(1, 1, 1);

    this.node.setScale(1, 1, 1);

    this.pulseTween = tween(this.node)
      .to(0.6, { scale: new Vec3(1.08, 1.08, 1.08) })
      .to(0.6, { scale: new Vec3(1, 1, 1) })
      .union()
      .repeatForever()
      .start();
  }

  private stopPulse() {
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = null;
    }

    this.node.setScale(1, 1, 1);
  }
}
