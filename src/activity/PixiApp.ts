import * as Pixi from "pixi.js";
import Setting from "../activity/base/Setting";
import DecoScene from "./scene/DecoScene";

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
  }

  sceneStart() {
    const scene = new DecoScene();
    this.stage.addChild(scene);
  }
}
