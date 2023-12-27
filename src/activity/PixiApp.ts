import * as Pixi from "pixi.js";
import Setting from "../activity/base/Setting";

export default class PixiApp extends Pixi.Application {
  constructor(canvas: HTMLCanvasElement) {
    super({
      width: Setting.sceneWidth,
      height: Setting.sceneHeight,
      backgroundAlpha: 0,
      view: canvas,
      antialias: true,
    });

    // webgl context lost
    canvas.addEventListener(
      "webglcontextlost",
      (e) => {
        console.log("webglcontextlost:" + e);
      },
      false
    );
    this.drawRectangle();
  }

  drawRectangle() {
    const rectangle = new Pixi.Graphics();
    rectangle.beginFill(0xffffff);
    rectangle.drawRect(50, 50, 100, 100);
    rectangle.endFill();
    this.stage.addChild(rectangle);
  }
}
