import * as Pixi from "pixi.js";
import Setting from "../activity/base/Setting";
import DecoMain from "./scene/DecoMain";

export default class PixiApp extends Pixi.Application {
  private currentScene: DecoMain | null = null;

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

  public startScene() {
    this.currentScene = new DecoMain();
    this.stage.addChild(this.currentScene);
  }

  public closeScene() {
    if (this.currentScene) {
        this.stage.removeChild(this.currentScene);
        this.currentScene.destroy();
        this.currentScene = null;
    }
  }
}
