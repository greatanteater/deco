import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import Sticker from "./scene-sub/Sticker";
import Drawing from "./scene-sub/Drawing";
import Palette from "./scene-sub/palette/Palette";
import { getAssets } from "./data/Resource";

export default class DecoScene extends Pixi.Container {
  private sceneName = "scene";
  public imageAssets: { [key: string]: any };
  public backgroundSprite: Pixi.Sprite | null = null;
  private backButtonSprite: Pixi.Sprite | null = null;
  private drawing: Drawing | null = null;
  private palette: Palette | null = null;
  private sticker: Sticker | null = null;

  constructor() {
    super();
    this.imageAssets = getAssets(this.sceneName).image;
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
    this.runPalette();
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

  private runPalette() {
    this.palette = new Palette();
    this.palette.setPalette(650, 750);
    this.addChild(this.palette);
  }

  private runSticker() {
    this.sticker = new Sticker(this);
    this.addChild(this.sticker);
  }

  private setBackground() {
    this.backgroundSprite = Pixi.Sprite.from(this.imageAssets.background.path);
    this.backgroundSprite.width = Setting.sceneWidth;
    this.backgroundSprite.height = Setting.sceneHeight;
    this.addChild(this.backgroundSprite);
  }

  private setButton() {
    this.backButtonSprite = Pixi.Sprite.from(this.imageAssets.back.path);
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
      this.removeChild(this.drawing);
      this.drawing.destroy();
      this.drawing = null;
    }
  }

  private destroySticker() {
    if (this.sticker) {
      this.removeChild(this.sticker);
      this.sticker.destroy();
      this.sticker = null;
    }
  }

  private destroyPalette() {
    if (this.palette) {
      this.removeChild(this.palette);
      this.palette.destroy();
      this.palette = null;
    }
  }

  public destroy() {
    this.destroyDrawing();
    this.destroySticker();
    this.destroyPalette();
    this.destroyBackground();
    this.destroyButton();
    super.destroy();
  }
}
