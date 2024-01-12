import * as Pixi from "pixi.js";
import Setting from "../../base/Setting";
import { wait } from "../../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../../store/store";
import { gsap } from "gsap";
import * as Interface from "../../base/Interface";
import DecoScene from "../DecoScene";
import { getAssets } from "../data/Resource";

export default class Sticker extends Pixi.Container {
  private sceneName = "sticker";
  private imageAssets: { [key: string]: any };
  private stickerHive: Pixi.Graphics | null = null;
  private stickers: Interface.Sticker | null = null;
  private charNumber = 0;
  private dragging = false;
  private draggingSprite: Pixi.Sprite | null = null;
  private prevX = 0;
  private prevY = 0;
  private scene: DecoScene;
  private currentTargetX = 0;
  private currentTargetY = 0;

  constructor (scene: DecoScene) {
    super();
    this.imageAssets = getAssets(this.sceneName).image;
    this.scene = scene;
    this.runScene();
    
  }

  private async runScene() {
    await this.setStickerHive();
    this.setPositonStickers();
  }

  private async setStickerHive() {
    this.stickerHive = new Pixi.Graphics();
    this.stickerHive.beginFill(0xffebcd);
    this.stickerHive.drawRoundedRect(0, 0, 160, 550, 10);
    this.stickerHive.endFill();
    this.stickerHive.pivot.set(60, 225);
    this.stickerHive.position.set(1200, 300);
    this.addChild(this.stickerHive);

    const sticker: Interface.Sticker = {
      eyes: [],
      noses: [],
      mouths: [],
    };

    const assets = ["eye", "nose", "mouth"];
    for (const asset of assets) {
      const assetArray = this.imageAssets[asset];
      for (let i = 0; i < 4; i++) {
        const imgLoad = await Pixi.Assets.load(
          assetArray[i].path
        );
        const sprite = Pixi.Sprite.from(imgLoad);
        sprite.width = 100;
        sprite.height = 100;
        sprite.anchor.set(0.5);
        sprite.position.set(2000, 0)
        if (asset === "eye") {
          sticker.eyes.push({ sprite: sprite });
        } else if (asset === "nose") {
          sticker.noses.push({ sprite: sprite });
        } else if (asset === "mouth") {
          sticker.mouths.push({ sprite: sprite });
        }
        this.addChild(sprite);
        this.setDragAndDrop(sprite);
      }
    }

    this.stickers = sticker;
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private setPositonStickers() {
    if (this.stickers) {
      this.shuffleArray(this.stickers.eyes);
      this.shuffleArray(this.stickers.noses);
      this.shuffleArray(this.stickers.mouths);
      if (this.stickers.eyes[0]) {
        this.stickers.eyes[0].sprite.position.set(1225, 150);
      }
      if (this.stickers.noses[0]) {
        this.stickers.noses[0].sprite.position.set(1225, 350);
      }
      if (this.stickers.mouths[0]) {
        this.stickers.mouths[0].sprite.position.set(1225, 550);
      }
    }
  }

  private setDragAndDrop(sprite: Pixi.Sprite) {
    sprite.eventMode = "static";
    sprite.cursor = "pointer";

    sprite.on("pointerdown", this.onDragStart, this);
    this.scene.on("pointerup", this.onDragEnd, this);
    this.scene.on("pointermove", this.onDragMove, this);
  }

  private onDragStart(e: Pixi.FederatedPointerEvent) {
    this.dragging = true;
    this.draggingSprite = e.currentTarget as Pixi.Sprite;
    this.currentTargetX = this.draggingSprite.x;
    this.currentTargetY = this.draggingSprite.y;
  }

  private onDragEnd() {
    this.dragging = false;

    if (this.draggingSprite) {
      this.draggingSprite.x = this.currentTargetX;
      this.draggingSprite.y = this.currentTargetY;
    }
  }

  private onDragMove(e: Pixi.FederatedPointerEvent) {
    if (!this.dragging) return;

    if (this.draggingSprite) {
      this.prevX = e.globalX - this.x;
      this.prevY = e.globalY - this.y;

      this.draggingSprite.x = this.prevX;
      this.draggingSprite.y = this.prevY;
    }
    if (
      this.prevX < 0 ||
      this.prevX > Setting.sceneWidth ||
      this.prevY < 0 ||
      this.prevY > Setting.sceneHeight
    ) {
      this.onDragEnd();
    }
  }

  private destroyStickerHive() {
    if (this.stickerHive) {
      this.removeChild(this.stickerHive);
      this.stickerHive = null;
    }

    if (this.stickers) {
      for (let eye of this.stickers.eyes) {
        this.removeChild(eye.sprite);
      }
      for (let nose of this.stickers.noses) {
        this.removeChild(nose.sprite);
      }
      for (let mouth of this.stickers.mouths) {
        this.removeChild(mouth.sprite);
      }
    }

    Object.values<Interface.LoadableAsset>(this.imageAssets.eye).forEach(
      (obj) => {
        Pixi.Assets.unload(obj.path);
      }
    );
    Object.values<Interface.LoadableAsset>(this.imageAssets.nose).forEach(
      (obj) => {
        Pixi.Assets.unload(obj.path);
      }
    );
    Object.values<Interface.LoadableAsset>(this.imageAssets.mouth).forEach(
      (obj) => {
        Pixi.Assets.unload(obj.path);
      }
    );
    this.stickers = null;
  }

  private destroyDragAndDrop() {
    if (this.stickers) {
      this.stickers.eyes.forEach((eye) => {
        eye.sprite.off("pointerdown", this.onDragStart, this);
      });
      this.stickers.noses.forEach((nose) => {
        nose.sprite.off("pointerdown", this.onDragStart, this);
      });
      this.stickers.mouths.forEach((mouth) => {
        mouth.sprite.off("pointerdown", this.onDragStart, this);
      });
    }

    this.scene.off("pointerup", this.onDragEnd, this);
    this.scene.off("pointermove", this.onDragMove, this);
  }

  public destroy() {
    this.destroyDragAndDrop();
    this.destroyStickerHive();
    super.destroy();
  }
}
