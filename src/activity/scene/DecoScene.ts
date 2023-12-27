// RectangleContainer.ts
import * as Pixi from "pixi.js";

export default class DeceScene extends Pixi.Container {
  private rectangle: Pixi.Graphics | null;

  constructor() {
    super();
    this.rectangle = null;
    this.runScene();
  }

  private runScene() {
    this.drawRectangle();
  }

  private drawRectangle() {
    this.rectangle = new Pixi.Graphics();
    this.rectangle.beginFill(0xffffff);
    this.rectangle.drawRect(50, 50, 100, 100);
    this.rectangle.endFill();

    this.addChild(this.rectangle);
  }

  private destroyRectangle() {
    if (this.rectangle) {
      this.rectangle.destroy();
      this.rectangle = null;
    }
  }

  public destroy() {
    this.destroyRectangle();
    super.destroy();
  }
}
