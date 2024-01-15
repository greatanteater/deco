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
  private kind = "";
  private positionY = 0;

  constructor(scene: DecoScene) {
    super();
    this.imageAssets = getAssets(this.sceneName).image;
    this.scene = scene;
    this.runScene();
  }

  private async runScene() {
    await this.setStickerHive();
    this.setPositonStickers();
    this.setDragAndDrop();
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
      eye: [],
      nose: [],
      mouth: [],
    };

    const assets = ["eye", "nose", "mouth"];
    for (const asset of assets) {
      const assetArray = this.imageAssets[asset];
      for (let i = 0; i < 4; i++) {
        const imgLoad = await Pixi.Assets.load(assetArray[i].path);
        const sprite = Pixi.Sprite.from(imgLoad);
        sprite.width = 100;
        sprite.height = 100;
        sprite.anchor.set(0.5);
        sprite.position.set(2000, 0);
        if (asset === "eye") {
          sticker.eye.push({ sprite: sprite });
        } else if (asset === "nose") {
          sticker.nose.push({ sprite: sprite });
        } else if (asset === "mouth") {
          sticker.mouth.push({ sprite: sprite });
        }
        this.addChild(sprite);
        sprite.eventMode = "static";
        sprite.cursor = "pointer";
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
      this.shuffleArray(this.stickers.eye);
      this.shuffleArray(this.stickers.nose);
      this.shuffleArray(this.stickers.mouth);
      if (this.stickers.eye[0]) {
        this.stickers.eye[0].sprite.position.set(1225, 150);
      }
      if (this.stickers.nose[0]) {
        this.stickers.nose[0].sprite.position.set(1225, 350);
      }
      if (this.stickers.mouth[0]) {
        this.stickers.mouth[0].sprite.position.set(1225, 550);
      }
    }
  }

  private changePositonStickers(feature: string, sprite: Pixi.Sprite) {
    if (this.stickers) {
      const index = this.stickers[feature].findIndex(
        (s) => s.sprite === sprite
      );
      let removedSprite;
      if (index !== -1) {
        removedSprite = this.stickers[feature].splice(index, 1)[0];
      }
      this.shuffleArray(this.stickers[feature]);
      if (removedSprite) {
        this.stickers[feature].push(removedSprite);
      }

      this.stickers[feature].forEach((sticker, i) => {
        if (i === 0) {
          sticker.sprite.position.set(1225, this.positionY);
        } else {
          sticker.sprite.position.set(2000, this.positionY);
        }
      });
    }
  }

  private setDragAndDrop() {
    this.eventMode = "static";
    this.on("pointerdown", this.onDragStart, this);
    this.scene.on("pointerup", this.onDragEnd, this);
    this.scene.on("pointermove", this.onDragMove, this);
  }

  private onDragStart(e: Pixi.FederatedPointerEvent) {
    if (!(e.target instanceof Pixi.Sprite)) {
      console.log("너는 스티커를 제대로 선택하지 않았삼");
      return;
    }
    this.dragging = true;

    this.draggingSprite = e.target as Pixi.Sprite;
    this.positionY = this.draggingSprite.y;

    if (this.draggingSprite.y === 150) {
      this.kind = "eye";
    } else if (this.draggingSprite.y === 350) {
      this.kind = "nose";
    } else {
      this.kind = "mouth";
    }
  }

  private onDragEnd() {
    if (this.dragging) {
      if (this.draggingSprite) {
        this.changePositonStickers(this.kind, this.draggingSprite);
      }
    }
    this.dragging = false;
  }

  private onDragMove(e: Pixi.FederatedPointerEvent) {
    if (!this.dragging) return;
  
    if (this.draggingSprite) {
      this.prevX = e.globalX - this.x;
      this.prevY = e.globalY - this.y;
  
      this.draggingSprite.x = this.prevX;
      this.draggingSprite.y = this.prevY;
  
      if (this.scene.drawing) {
        const hitArea = this.scene.drawing.charHitArea[this.charNumber];
        if (hitArea.contains(this.prevX + this.draggingSprite.width / 2, this.prevY + this.draggingSprite.height / 2)) {
          console.log("충돌감지 " + this.charNumber);
        }
      }
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
      for (let eye of this.stickers.eye) {
        this.removeChild(eye.sprite);
      }
      for (let nose of this.stickers.nose) {
        this.removeChild(nose.sprite);
      }
      for (let mouth of this.stickers.mouth) {
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
      this.stickers.eye.forEach((eye) => {
        eye.sprite.off("pointerdown", this.onDragStart, this);
      });
      this.stickers.nose.forEach((nose) => {
        nose.sprite.off("pointerdown", this.onDragStart, this);
      });
      this.stickers.mouth.forEach((mouth) => {
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
