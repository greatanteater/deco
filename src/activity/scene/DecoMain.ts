import * as Pixi from "pixi.js";
import * as PixiSound from "@pixi/sound";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import { getAssets } from './data/Resource';

export default class DecoMain extends Pixi.Container {
  private sceneName = "main";
  private imageAssets: { [key: string]: any };
  private soundAssets: { [key: string]: any };
  private backgroundSprite: Pixi.Sprite | null = null;
  private mirrorSprite: Pixi.Sprite | null = null;
  private charSprites: Pixi.Sprite[] = [];
  private fxaaFilter: Pixi.Filter | null = null;
  private startSound: PixiSound.Sound | null = null;

  constructor() {
    super();
    this.imageAssets = getAssets(this.sceneName).image;
    this.soundAssets = getAssets(this.sceneName).sound;
    this.runScene();
  }

  private runScene() {
    this.setBackground();
    this.setChars();
    this.setSound();
  }

  private setSound() {
    console.log("개빡치네");
    console.log(this.imageAssets);
    console.log(this.soundAssets);
    this.startSound = PixiSound.Sound.from(this.soundAssets.start.path);
    this.startSound.play();
  }

  private setBackground() {
    this.backgroundSprite = Pixi.Sprite.from(this.imageAssets.background.path);
    this.backgroundSprite.width = Setting.sceneWidth;
    this.backgroundSprite.height = Setting.sceneHeight;
    this.addChild(this.backgroundSprite);

    this.mirrorSprite = Pixi.Sprite.from(this.imageAssets.mirror.path);
    this.mirrorSprite.width = 270;
    this.mirrorSprite.height = 500;
    this.mirrorSprite.anchor.set(0.5);
    this.mirrorSprite.position.set(Setting.sceneWidth / 2, 500);
    this.addChild(this.mirrorSprite);
  }

  private setChars() {
    this.charSprites = [];

    const charData = [
      {
        position: { x: 300, y: 400 },
        charNumber: 0,
      },
      {
        position: { x: 1000, y: 400 },
        charNumber: 1,
      },
    ];

    for (const { position, charNumber } of charData) {
      const sprite = Pixi.Sprite.from(this.imageAssets.character[charNumber].path);

      sprite.width = 300;
      sprite.height = 400;
      sprite.anchor.set(0.5);
      sprite.position.set(position.x, position.y);
      sprite.eventMode = "static";
      sprite.cursor = "pointer";
      sprite.on("pointerdown", async () => {
        await this.zoomIn();
        currentView.set("scene");
        characterNumber.set(charNumber);
      });

      this.addChild(sprite);
      this.charSprites.push(sprite);
    }
  }

  private async zoomIn() {
    // this.fxaaFilter = new Pixi.FXAAFilter();
    // this.filters = [this.fxaaFilter];
    this.pivot.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2 + 100);
    this.position.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2 + 100);
    const zoomIn = gsap.to(this.scale, { x: 4, y: 4, duration: 1 });
    await zoomIn;
    zoomIn.kill();
  }

  private destroyBack() {
    if (this.backgroundSprite) {
      this.backgroundSprite.destroy();
      this.backgroundSprite = null;
    }
    if (this.mirrorSprite) {
      this.mirrorSprite.destroy();
      this.mirrorSprite = null;
    }
  }

  private destroyChar() {
    for (const sprite of this.charSprites) {
      sprite.destroy();
    }
    this.charSprites = [];
  }

  private destroyFilter() {
    if (this.fxaaFilter) {
      this.fxaaFilter.destroy();
      this.fxaaFilter = null;
    }
  }

  private destroySound() {
    if (this.startSound) {
      this.startSound.stop();
      this.startSound.destroy();
      this.startSound = null;
    }
  }

  public destroy() {
    this.destroyChar();
    this.destroyBack();
    this.destroyFilter();
    this.filters = [];
    this.destroySound();
    super.destroy();
  }
}
