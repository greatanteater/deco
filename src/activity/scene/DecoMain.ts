import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { activityState } from "../store/store";
import { gsap } from 'gsap';

export default class DecoMain extends Pixi.Container {
  private backgroundSprite: Pixi.Sprite | null = null;
  private char1Sprite: Pixi.Sprite | null = null;
  private char2Sprite: Pixi.Sprite | null = null;
  private fxaaFilter: Pixi.Filter | null = null;

  constructor() {
    super();
    this.runScene();
  }

  private runScene() {
    this.setBackground();
    this.setChars();
  }

  private setBackground() {
    this.backgroundSprite = Pixi.Sprite.from("images/main/background.jpg");
    this.backgroundSprite.width = Setting.sceneWidth;
    this.backgroundSprite.height = Setting.sceneHeight;
    this.addChild(this.backgroundSprite);
  }

  private setChars() {
    this.char1Sprite = Pixi.Sprite.from("images/main/char1.png");
    this.char1Sprite.width = 300;
    this.char1Sprite.height = 400;
    this.char1Sprite.anchor.set(0.5);
    this.char1Sprite.position.set(300, 400);
    this.char1Sprite.eventMode = "static";
    this.char1Sprite.cursor = "pointer";
    this.char1Sprite.on("pointerdown", async () => {
      await this.zoomIn();
      activityState.update(() => ({ currentView: "scene", charNumber: 0 }));
    });
    this.addChild(this.char1Sprite);

    this.char2Sprite = Pixi.Sprite.from("images/main/char2.png");
    this.char2Sprite.width = 300;
    this.char2Sprite.height = 400;
    this.char2Sprite.anchor.set(0.5);
    this.char2Sprite.position.set(900, 400);
    this.char2Sprite.eventMode = "static";
    this.char2Sprite.cursor = "pointer";
    this.char2Sprite.on("pointerdown", async () => {
      await this.zoomIn();
      activityState.update(() => ({ currentView: "scene", charNumber: 1 }));
    });
    this.addChild(this.char2Sprite);
  }

  private async zoomIn() {
    this.fxaaFilter = new Pixi.FXAAFilter();
    this.filters = [this.fxaaFilter];
    this.pivot.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2 + 100);
    this.position.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2 + 100);
    const zoomIn = gsap.to(this.scale, { x: 3, y: 3, duration: 1 });
    await zoomIn;
    zoomIn.kill();
    const fadeIn = gsap.to(this, { alpha: 0, duration: 0.5 });
    await fadeIn;
    fadeIn.kill();
  }

  private destroyBack() {
    if (this.backgroundSprite) {
      this.backgroundSprite.destroy();
      this.backgroundSprite = null;
    }
  }

  private destroyChar() {
    if (this.char1Sprite) {
      this.char1Sprite.destroy();
      this.char1Sprite = null;
    }
    if (this.char2Sprite) {
      this.char2Sprite.destroy();
      this.char2Sprite = null;
    }
  }

  private destroyFilter() {
    if (this.fxaaFilter) {
      this.fxaaFilter.destroy();
      this.fxaaFilter = null;
    }
  }

  public destroy() {
    this.destroyChar();
    this.destroyBack();
    this.destroyFilter();
    this.filters = [];
    super.destroy();
  }
}
