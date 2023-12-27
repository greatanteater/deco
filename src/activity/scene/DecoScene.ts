// RectangleContainer.ts
import * as Pixi from "pixi.js";

export default class DeceScene extends Pixi.Container {
  constructor() {
    super();

    const rectangle = new Pixi.Graphics();
    rectangle.beginFill(0xffffff);
    rectangle.drawRect(50, 50, 100, 100);
    rectangle.endFill();

    this.addChild(rectangle);
  }
}