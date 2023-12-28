import * as Pixi from "pixi.js";
import Setting from "../activity/base/Setting";
import { activityState } from "../activity/store/store";
import DecoMain from "./scene/DecoMain";
import DecoScene from "./scene/DecoScene";

export default class PixiApp extends Pixi.Application {
  private currentScene: DecoMain | DecoScene | null = null;

  constructor(canvas: HTMLCanvasElement) {
    super({
      width: Setting.sceneWidth,
      height: Setting.sceneHeight,
      backgroundAlpha: 1,
      backgroundColor: '#000',
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

    activityState.subscribe(({ currentView }) => {
      this.switchScene(currentView);
    });
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

  public switchScene(view: string) {
    this.closeScene();

    switch (view) {
      case "main":
        this.currentScene = new DecoMain();
        break;
      case "scene":
        this.currentScene = new DecoScene();
        break;
    }

    if (this.currentScene) {
      this.stage.addChild(this.currentScene);
    }
  }
}
