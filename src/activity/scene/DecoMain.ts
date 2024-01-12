import * as Pixi from "pixi.js";
import * as PixiSound from "@pixi/sound";
import { Spine } from "pixi-spine";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import { getAssets } from "./data/Resource";

export default class DecoMain extends Pixi.Container {
  private sceneName = "main";
  private imageAssets: { [key: string]: any };
  private soundAssets: { [key: string]: any };
  private backgroundSprite: Pixi.Sprite | null = null;
  private mirrorSprite: Pixi.Sprite | null = null;
  private charSprites: Pixi.Sprite[] = [];
  private charSpines: Spine[] = [];
  private fxaaFilter: Pixi.Filter | null = null;
  private startSound: PixiSound.Sound | null = null;

  constructor() {
    super();
    this.imageAssets = getAssets(this.sceneName).image;
    this.soundAssets = getAssets(this.sceneName).sound;
    this.runScene();
  }

  private async runScene() {
    await this.load();
    this.setBackground();
    this.setSpine();
    this.setSound();
  }

  private setSound() {
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

  private async load() {
    this.charSpines = [];

    const charData = [
      {
        position: { x: 300, y: 500 },
        charNumber: 0,
        jsonPath: "spine/main/json/main1_root/a_root.json",
        animationName: "00",
      },
      {
        position: { x: 1000, y: 500 },
        charNumber: 1,
        jsonPath: "spine/main/json/main2_root/main2_root.json",
        animationName: "00",
      },
    ];

    // 모든 스파인 데이터를 동시에 로드
    const resources = await Promise.all(
      charData.map(({ jsonPath }) => Pixi.Assets.load(jsonPath))
    );

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      const { position, charNumber, animationName } = charData[i];
      const spine = new Spine(resource.spineData);
      spine.state.setAnimation(0, animationName, true);
      spine.x = position.x;
      spine.y = position.y;
      spine.interactive = true;
      spine.cursor = "pointer";
      spine.on("pointerdown", async () => {
        await this.zoomIn();
        currentView.set("scene");
        characterNumber.set(charNumber);
      });

      this.addChild(spine);
      this.charSpines.push(spine);
    }
  }

  private setSpine() {
    this.charSpines.forEach((spine) => {
      this.addChild(spine);
    });
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
    if (this.charSpines) {
      for (const spine of this.charSpines) {
        Pixi.utils.clearTextureCache();
        spine.off("pointerdown");
        this.removeChild(spine);
        spine.destroy({ children: true, baseTexture: true });
      }
      Pixi.Assets.unload("spine/main/json/main1_root/a_root.json");
      Pixi.Assets.unload("spine/main/json/main2_root/main2_root.json");
      this.charSpines = [];
    }
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
