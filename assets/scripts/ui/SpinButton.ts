import { _decorator, Component, Button } from "cc";

import { EventBus } from "../util/EventBus";
import { GameEvents } from "../enums/GameEvents";

const { ccclass, property } = _decorator;

@ccclass("SpinButton")
export class SpinButton extends Component {
  @property(Button)
  button: Button = null!;

  onLoad() {
    this.button.node.on(Button.EventType.CLICK, this.onClick, this);

    EventBus.on(GameEvents.ALL_REELS_STOPPED, () => {
      this.button.interactable = true;
    });

    EventBus.on(GameEvents.SPIN_STARTED, () => {
      this.button.interactable = false;
    });
  }

  onClick() {
    EventBus.emit(GameEvents.SPIN_REQUEST);
  }
}
