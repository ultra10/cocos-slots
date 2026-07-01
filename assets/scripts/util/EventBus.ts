export type EventCallback = (...args: any[]) => void;

export class EventBus {
  private static events: Map<string, EventCallback[]> = new Map();

  static on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event)!.push(callback);
  }

  static off(event: string, callback: EventCallback) {
    const list = this.events.get(event);

    if (!list) return;

    const index = list.indexOf(callback);

    if (index >= 0) {
      list.splice(index, 1);
    }
  }

  static emit(event: string, ...args: any[]) {
    const list = this.events.get(event);

    if (!list) return;

    [...list].forEach((cb) => cb(...args));
  }
}
