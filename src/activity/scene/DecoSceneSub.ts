import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import * as Data from "./DecoSceneData";
import DecoScene from "./DecoScene";

export default class StickerManager extends Pixi.Container {
  private stickerHive: Pixi.Graphics | null = null;
  private stickers: Data.Sticker[] = [];

  constructor() {
    super();
    this.setStickerHive();
  }

  private setStickerHive() {
    this.stickerHive = new Pixi.Graphics();
    this.stickerHive.beginFill(0xffebcd);
    this.stickerHive.drawRoundedRect(0, 0, 160, 550, 10);
    this.stickerHive.endFill();
    this.stickerHive.pivot.set(60, 225);
    this.stickerHive.position.set(1200, 300);

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
  }

  public getStickerData() {
    return {
      stickers: this.stickers,
      stickerHive: this.stickerHive
    };
  }
}
