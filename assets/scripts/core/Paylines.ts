import { _decorator, Component, Graphics, Node, Vec3, Color } from "cc";
const { ccclass } = _decorator;

export type Payline = number[];

export const paylines: Payline[] = [
  [1, 1, 1, 1, 1], // 0
  [0, 0, 0, 0, 0], // 1
  [2, 2, 2, 2, 2], // 2
  [0, 1, 2, 1, 0], // 3
  [2, 1, 0, 1, 2], // 4
  [0, 0, 1, 2, 2], // 5
  [2, 2, 1, 0, 0], // 6
  [1, 0, 0, 0, 1], // 7
  [1, 2, 2, 2, 1], // 8
  [2, 1, 2, 1, 2], // 9
];

const positions: Vec3[][] = [
  [new Vec3(-400, 200), new Vec3(-400, 0), new Vec3(-400, -200)],
  [new Vec3(-200, 200), new Vec3(-200, 0), new Vec3(-200, -200)],
  [new Vec3(0, 200), new Vec3(0, 0), new Vec3(0, -200)],
  [new Vec3(200, 200), new Vec3(200, 0), new Vec3(200, -200)],
  [new Vec3(400, 200), new Vec3(400, 0), new Vec3(400, -200)],
];

@ccclass("Paylines")
export class Paylines extends Component {
  private lines: Graphics[] = [];

  onLoad() {
    this.createPaylines();
  }

  private createPaylines() {
    const colors = [
      Color.RED,
      Color.GREEN,
      Color.BLUE,
      Color.YELLOW,
      Color.MAGENTA,
      Color.CYAN,
    ];

    paylines.forEach((line, index) => {
      const node = new Node(`Payline_${index}`);
      node.parent = this.node;

      const graphics = node.addComponent(Graphics);

      graphics.lineWidth = 5;
      graphics.strokeColor = colors[index % colors.length];

      const points = line.map((row, col) => {
        return positions[col][row];
      });

      graphics.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        graphics.lineTo(points[i].x, points[i].y);
      }

      graphics.stroke();

      node.active = false; // hide

      this.lines.push(graphics);
    });
  }

  showLine(index: number) {
    if (!this.lines[index]) return;

    this.lines[index].node.active = true;
  }

  hideLine(index: number) {
    if (!this.lines[index]) return;

    this.lines[index].node.active = false;
  }

  hideAllLines() {
    this.lines.forEach((line) => {
      line.node.active = false;
    });
  }
}
