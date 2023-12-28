import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { get } from "svelte/store";
import { activityState } from "../store/store";
import { gsap } from "gsap";

export default class DecoScene extends Pixi.Container {
  private backgroundSprite: Pixi.Sprite | null = null;
  private backButtonSprite: Pixi.Sprite | null = null;
  private faceSprite: Pixi.Sprite | null = null;
  private leftButtonSprite: Pixi.Sprite | null = null;
  private rightButtonSprite: Pixi.Sprite | null = null;
  private currentView: string | null = null;
  private charNumber = 0;

  constructor() {
    super();
    this.loadStore();
    this.initialize();
    this.registerEvents();
  }

  private async initialize() {
    this.runScene();
    await this.fadeIn();
  }

  private registerEvents() {
    activityState.subscribe(({ charNumber }) => {
      this.setChars(charNumber);
    });
  }

  private loadStore() {
    this.currentView = get(activityState).currentView;
    this.charNumber = get(activityState).charNumber;
  }

  private saveStore() {
    activityState.update((current) => ({
      ...current,
      charNumber: this.charNumber,
    }));
  }

  private runScene() {
    this.setBackground();
    this.setButton();
  }

  private async fadeIn() {
    this.alpha = 0;
    const fadeIn = gsap.to(this, { alpha: 1, duration: 1 });
    await fadeIn;
    fadeIn.kill();
  }

  private setBackground() {
    this.backgroundSprite = Pixi.Sprite.from("images/scene/background.jpg");
    this.backgroundSprite.width = Setting.sceneWidth;
    this.backgroundSprite.height = Setting.sceneHeight;
    this.addChild(this.backgroundSprite);
  }

  private setButton() {
    this.backButtonSprite = Pixi.Sprite.from("images/scene/back.png");
    this.backButtonSprite.width = 70;
    this.backButtonSprite.height = 70;
    this.backButtonSprite.anchor.set(0.5);
    this.backButtonSprite.position.set(50, 50);
    this.backButtonSprite.eventMode = "static";
    this.backButtonSprite.cursor = "pointer";
    this.backButtonSprite.on("pointerdown", () => {
      activityState.update((current) => ({ ...current, currentView: "main" }));
    });
    this.addChild(this.backButtonSprite);

    this.leftButtonSprite = Pixi.Sprite.from("images/scene/left.png");
    this.leftButtonSprite.width = 70;
    this.leftButtonSprite.height = 70;
    this.leftButtonSprite.anchor.set(0.5);
    this.leftButtonSprite.position.set(300, Setting.sceneHeight / 2);
    this.leftButtonSprite.eventMode = "static";
    this.leftButtonSprite.cursor = "pointer";
    this.leftButtonSprite.on("pointerdown", () => {
      this.charNumber = this.charNumber === 0 ? 1 : 0;
      this.setChars(this.charNumber);
    });
    this.addChild(this.leftButtonSprite);

    this.rightButtonSprite = Pixi.Sprite.from("images/scene/right.png");
    this.rightButtonSprite.width = 70;
    this.rightButtonSprite.height = 70;
    this.rightButtonSprite.anchor.set(0.5);
    this.rightButtonSprite.position.set(1000, Setting.sceneHeight / 2);
    this.rightButtonSprite.eventMode = "static";
    this.rightButtonSprite.cursor = "pointer";
    this.rightButtonSprite.on("pointerdown", () => {
      this.charNumber = this.charNumber === 0 ? 1 : 0;
      this.setChars(this.charNumber);
    });
    this.addChild(this.rightButtonSprite);
  }

  public setChars(number: number) {
    if (!this.faceSprite) {
      this.faceSprite = Pixi.Sprite.from(`images/scene/face${number + 1}.png`);
      this.faceSprite.width = 800;
      this.faceSprite.height = 800;
      this.faceSprite.anchor.set(0.5);
      this.faceSprite.position.set(Setting.sceneWidth / 2, 500);
      this.addChild(this.faceSprite);
    } else {
      this.faceSprite.texture = Pixi.Texture.from(
        `images/scene/face${number + 1}.png`
      );
    }
  }

  private destroyBackground() {
    if (this.backgroundSprite) {
      this.backgroundSprite.destroy();
      this.backgroundSprite = null;
    }
  }

  private destroyChar() {
    if (this.faceSprite) {
      this.faceSprite.destroy();
      this.faceSprite = null;
    }
  }

  public destroy() {
    this.saveStore();
    this.destroyBackground();
    this.destroyChar();
    super.destroy();
  }
}
