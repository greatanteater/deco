import * as Pixi from "pixi.js";
import * as PixiSound from "@pixi/sound";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import { ResourcePath } from './data/Resource';

export default class DecoMain extends Pixi.Container {
  private sceneName = "main";
  private resourcePath: ResourcePath;
  private backgroundSprite: Pixi.Sprite | null = null;
  private mirrorSprite: Pixi.Sprite | null = null;
  private charSprites: Pixi.Sprite[] = [];
  private fxaaFilter: Pixi.Filter | null = null;
  private startSound: PixiSound.Sound | null = null;

  constructor() {
    super();
    this.resourcePath = new ResourcePath();
    this.runScene();
  }

  private runScene() {
    this.setBackground();
    this.setChars();
    // this.setSound();
  }

  private setSound() {
    this.startSound = PixiSound.Sound.from("sounds/start.mp3");
    this.startSound.play();
  }

  private setBackground() {
    const imagePath = this.resourcePath.getImagePath(this.sceneName);
    this.backgroundSprite = Pixi.Sprite.from(imagePath.background as string);
    this.backgroundSprite.width = Setting.sceneWidth;
    this.backgroundSprite.height = Setting.sceneHeight;
    this.addChild(this.backgroundSprite);

    this.mirrorSprite = Pixi.Sprite.from(imagePath.mirror as string);
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

    const imagePath = this.resourcePath.getImagePath(this.sceneName);
    for (const { position, charNumber } of charData) {
      const sprite = Pixi.Sprite.from(imagePath.character[charNumber]);

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
