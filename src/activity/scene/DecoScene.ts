import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import Sticker from "./DecoSticker";
import Drawing from "./DecoDrawing";
import { ResourcePath } from './data/Resource';

export default class DecoScene extends Pixi.Container {
  private sceneName = "scene";
  private resourcePath: ResourcePath;
  public backgroundSprite: Pixi.Sprite | null = null;
  private backButtonSprite: Pixi.Sprite | null = null;
  private drawing: Drawing | null = null;
  private sticker: Sticker | null = null;

  constructor() {
    super();
    this.resourcePath = new ResourcePath();
    this.interactive = true;
    this.initialize();
  }

  private async initialize() {
    this.runScene();
    await this.fadeIn();
  }

  private runScene() {
    this.setBackground();
    this.setButton();
    this.runDrawing();
    this.runSticker();
  }

  private async fadeIn() {
    this.alpha = 0;
    const fadeIn = gsap.to(this, { alpha: 1, duration: 1 });
    await fadeIn;
    fadeIn.kill();
  }

  private runDrawing() {
    this.drawing = new Drawing(this);
    this.addChild(this.drawing);
  }

  private runSticker() {
    this.sticker = new Sticker(this);
    this.addChild(this.sticker);
  }

  private setBackground() {
    const imagePath = this.resourcePath.getImagePath(this.sceneName);
    this.backgroundSprite = Pixi.Sprite.from(imagePath.background as string);
    this.backgroundSprite.width = Setting.sceneWidth;
    this.backgroundSprite.height = Setting.sceneHeight;
    this.addChild(this.backgroundSprite);
  }

  private setButton() {
    const imagePath = this.resourcePath.getImagePath(this.sceneName);
    this.backButtonSprite = Pixi.Sprite.from(imagePath.back as string);
    this.backButtonSprite.width = 70;
    this.backButtonSprite.height = 70;
    this.backButtonSprite.anchor.set(0.5);
    this.backButtonSprite.position.set(50, 50);
    this.backButtonSprite.eventMode = "static";
    this.backButtonSprite.cursor = "pointer";
    this.backButtonSprite.on("pointerdown", () => {
      currentView.set("main");
    });
    this.addChild(this.backButtonSprite);
  }

  private destroyBackground() {
    if (this.backgroundSprite) {
      this.backgroundSprite.destroy();
      this.backgroundSprite = null;
    }
  }

  private destroyButton() {
    if (this.backButtonSprite) {
      this.backButtonSprite.destroy();
      this.backButtonSprite = null;
    }
  }

  private destroyDrawing() {
    if (this.drawing) {
      this.drawing.destroy();
      this.removeChild(this.drawing);
      this.drawing = null;
    }
  }

  private destroySticker() {
    if (this.sticker) {
      this.sticker.destroy();
      this.removeChild(this.sticker);
      this.sticker = null;
    }
  }

  public destroy() {
    this.destroyDrawing();
    this.destroySticker();
    this.destroyBackground();
    this.destroyButton();
    super.destroy();
  }
}
