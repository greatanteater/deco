import * as Pixi from "pixi.js";
import Setting from "../activity/base/Setting";
import { get } from "svelte/store";
import { currentView } from "../activity/store/store";
import DecoDrawingBoard from "./scene/DecoDrawingBoard";

export default class PixiApp extends Pixi.Application {
  private currentScene: DecoDrawingBoard | null = null;

  constructor(canvas: HTMLCanvasElement) {
    super({
      width: Setting.sceneWidth,
      height: Setting.sceneHeight,
      backgroundAlpha: 1,
      backgroundColor: "#000",
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
    this.currentScene = new DecoDrawingBoard();
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
