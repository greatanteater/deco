import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import * as Data from "./DecoData";

export default class Sticker extends Pixi.Container {
  private stickerHive: Pixi.Graphics | null = null;
  private stickers: Data.Sticker[] = [];
  private charNumber = 0;

  constructor() {
    super();
    this.setStickerHive();

    characterNumber.subscribe((value) => {
      this.setPositonStickers(value);
    });
  }

  private setStickerHive() {
    this.stickerHive = new Pixi.Graphics();
    this.stickerHive.beginFill(0xffebcd);
    this.stickerHive.drawRoundedRect(0, 0, 160, 550, 10);
    this.stickerHive.endFill();
    this.stickerHive.pivot.set(60, 225);
    this.stickerHive.position.set(1200, 300);
    this.addChild(this.stickerHive);

    for (let i = 1; i <= 4; i++) {
      let sticker: Data.Sticker = {
        eye: {
          sprite: Pixi.Sprite.from(`images/scene/eye${i}.png`),
          path: `images/scene/eye${i}.png`,
          position: { x: 1220, y: 150 },
        },
        nose: {
          sprite: Pixi.Sprite.from(`images/scene/nose${i}.png`),
          path: `images/scene/nose${i}.png`,
          position: { x: 1220, y: 350 },
        },
        mouse: {
          sprite: Pixi.Sprite.from(`images/scene/mouse${i}.png`),
          path: `images/scene/mouse${i}.png`,
          position: { x: 1220, y: 550 },
        },
      };
      sticker.eye.sprite.width = 100;
      sticker.eye.sprite.height = 100;
      sticker.eye.sprite.position.set(-1000, 500);
      sticker.eye.sprite.anchor.set(0.5);
      sticker.nose.sprite.width = 100;
      sticker.nose.sprite.height = 100;
      sticker.nose.sprite.position.set(-1000, 500);
      sticker.nose.sprite.anchor.set(0.5);
      sticker.mouse.sprite.width = 100;
      sticker.mouse.sprite.height = 100;
      sticker.mouse.sprite.position.set(-1000, 500);
      sticker.mouse.sprite.anchor.set(0.5);
      this.stickers.push(sticker);
    }

    for (let sticker of this.stickers) {
      this.addChild(sticker.eye.sprite);
      this.addChild(sticker.nose.sprite);
      this.addChild(sticker.mouse.sprite);
    }
  }

  private setPositonStickers(number: number) {
    this.stickers.forEach((sticker: Data.Sticker, i: number) => {
      if (i === number) {
        sticker.eye.sprite.position.set(
          sticker.eye.position.x,
          sticker.eye.position.y
        );
        sticker.nose.sprite.position.set(
          sticker.nose.position.x,
          sticker.nose.position.y
        );
        sticker.mouse.sprite.position.set(
          sticker.mouse.position.x,
          sticker.mouse.position.y
        );
      } else {
        sticker.eye.sprite.position.set(-1000, 500);
        sticker.nose.sprite.position.set(-1000, 500);
        sticker.mouse.sprite.position.set(-1000, 500);
      }
    });
  }

  private destroyStickerHive() {
    if (this.stickerHive) {
      this.removeChild(this.stickerHive);
      this.stickerHive = null;
    }

    for (let sticker of this.stickers) {
      this.removeChild(sticker.eye.sprite);
      this.removeChild(sticker.nose.sprite);
      this.removeChild(sticker.mouse.sprite);
    }

    this.stickers = [];
  }

  public destroy() {
    this.destroyStickerHive();
    super.destroy();
  }
}
