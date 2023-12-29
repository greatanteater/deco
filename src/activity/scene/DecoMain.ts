import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { activityState } from "../store/store";
import { gsap } from "gsap";

export default class DecoMain extends Pixi.Container {
  private backgroundSprite: Pixi.Sprite | null = null;
  private mirrorSprite: Pixi.Sprite | null = null;
  private charSprites: Pixi.Sprite[] = [];
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

    this.mirrorSprite = Pixi.Sprite.from("images/main/great.png");
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
        imagePath: "images/main/char1.png",
        position: { x: 300, y: 400 },
        charNumber: 0,
      },
      {
        imagePath: "images/main/char2.png",
        position: { x: 1000, y: 400 },
        charNumber: 1,
      },
    ];

    for (const { imagePath, position, charNumber } of charData) {
      const sprite = Pixi.Sprite.from(imagePath);

      sprite.width = 300;
      sprite.height = 400;
      sprite.anchor.set(0.5);
      sprite.position.set(position.x, position.y);
      sprite.eventMode = "static";
      sprite.cursor = "pointer";
      sprite.on("pointerdown", async () => {
        await this.zoomIn();
        activityState.update(() => ({ currentView: "scene", charNumber }));
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

  public destroy() {
    this.destroyChar();
    this.destroyBack();
    this.destroyFilter();
    this.filters = [];
    super.destroy();
  }
}
