import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import * as Data from "./DecoSceneData";
import StickerManager from "./DecoSceneSub";
import DecoDrawing from "./DecoDrawing";
import PixiApp from "../PixiApp";

export default class DecoScene extends Pixi.Container {
  public backgroundSprite: Pixi.Sprite | null = null;
  private backButtonSprite: Pixi.Sprite | null = null;
  private faces: Data.Face[] = [];
  private displacements: Data.Displacement[] = [];
  private leftButtonSprite: Pixi.Sprite | null = null;
  private rightButtonSprite: Pixi.Sprite | null = null;
  private currentView: string | null = null;
  private charNumber = 0;
  private faceMoving = false;
  private displacementFilter: Pixi.DisplacementFilter[] = [];
  private stickerHive: Pixi.Graphics | null = null;
  private stickers: Data.Sticker[] = [];
  private decoDrawing: DecoDrawing | null = null;

  constructor() {
    super();
    this.loadStore();
    this.initialize();
  }

  private async initialize() {
    this.runScene();
    await this.fadeIn();
  }

  private loadStore() {
    this.currentView = get(currentView);
    this.charNumber = get(characterNumber);
  }

  private saveStore() {
    characterNumber.set(this.charNumber);
  }

  private runScene() {
    this.setBackground();
    this.setButton();
    this.setDisplacement();
    this.setFaces();
    this.setFacesPosition("default");
    this.loadStickerHive();
    this.setPositonStickers(this.charNumber);
    this.runDecoDrawing();
  }

  private async fadeIn() {
    this.alpha = 0;
    const fadeIn = gsap.to(this, { alpha: 1, duration: 1 });
    await fadeIn;
    fadeIn.kill();
  }

  private runDecoDrawing() {
    this.decoDrawing = new DecoDrawing(this);
    this.addChild(this.decoDrawing);
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
      currentView.set("main");
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
      if (!this.faceMoving) {
        this.setFacesPosition("left");
      }
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
      if (!this.faceMoving) {
        this.setFacesPosition("right");
      }
    });
    this.addChild(this.rightButtonSprite);
  }

  private setDisplacement() {
    const displacementData = [
      {
        imagePath: "images/scene/map1.jpg",
        position: { x: -1000, y: 500 },
        charNumber: 0,
      },
      {
        imagePath: "images/scene/map2.jpg",
        position: { x: -1000, y: 500 },
        charNumber: 1,
      },
      {
        imagePath: "images/scene/map3.jpg",
        position: { x: -1000, y: 500 },
        charNumber: 2,
      },
      {
        imagePath: "images/scene/map4.jpg",
        position: { x: -1000, y: 500 },
        charNumber: 3,
      },
    ];

    for (const { imagePath, position, charNumber } of displacementData) {
      const sprite = Pixi.Sprite.from(imagePath);
      sprite.width = 650;
      sprite.height = 700;
      sprite.anchor.set(0.5);
      sprite.scale.set(0.5);
      sprite.position.set(position.x, position.y);
      sprite.texture.baseTexture.wrapMode = Pixi.WRAP_MODES.CLAMP;
      this.displacementFilter[charNumber] = new Pixi.DisplacementFilter(sprite);
      this.addChild(sprite);

      const displacement: Data.Displacement = { sprite, charNumber };
      this.displacements.push(displacement);
    }
    window.addEventListener("pointermove", (event) => {
        this.pointerMoveHandler.bind(this)(event);
    });
  }

  private pointerMoveHandler(event: PointerEvent) {
    if (
      event.clientX < 0 ||
      event.clientX > Setting.sceneWidth ||
      event.clientY < 0 ||
      event.clientY > Setting.sceneHeight
    ) {
      return;
    }
  
    if (this.displacementFilter[this.charNumber]) {
      const midpointX = Setting.sceneWidth / 2,
        midpointY = Setting.sceneHeight / 2,
        posX = midpointX - event.clientX,
        posY = midpointY - event.clientY,
        valX = (posX / midpointX) * 30,
        valY = (posY / midpointY) * 17;
      this.displacementFilter[this.charNumber].scale.x = valX;
      this.displacementFilter[this.charNumber].scale.y = valY;
    }
  }
  

  private setFaces() {
    const faceData = [
      {
        imagePath: "images/scene/face1.png",
        position: { x: -1000, y: 500 },
        charNumber: 0,
      },
      {
        imagePath: "images/scene/face2.png",
        position: { x: -1000, y: 500 },
        charNumber: 1,
      },
      {
        imagePath: "images/scene/face3.png",
        position: { x: -1000, y: 500 },
        charNumber: 2,
      },
      {
        imagePath: "images/scene/face4.png",
        position: { x: -1000, y: 500 },
        charNumber: 3,
      },
    ];

    for (const { imagePath, position, charNumber } of faceData) {
      const sprite = Pixi.Sprite.from(imagePath);
      sprite.width = 650;
      sprite.height = 700;
      sprite.anchor.set(0.5);
      sprite.position.set(position.x, position.y);
      if (this.displacementFilter) {
        sprite.filters = [this.displacementFilter[charNumber]];
      }
      this.addChild(sprite);

      const face: Data.Face = { sprite, charNumber };
      this.faces.push(face);
    }
  }

  private async setFacesPosition(direction: string) {
    this.faceMoveEnable(true);

    if (direction === "right") {
      const previousCharNumber = this.charNumber;
      this.charNumber = this.charNumber - 1;
      if (this.charNumber < 0) {
        this.charNumber = this.faces.length - 1;
      }
      for (const face of this.faces) {
        if (face.charNumber === previousCharNumber) {
          gsap.to(face.sprite.position, {
            x: Setting.sceneWidth / 2 + Setting.sceneWidth,
            y: 500,
            duration: 1,
          });
        } else if (face.charNumber === this.charNumber) {
          face.sprite.position.set(
            Setting.sceneWidth / 2 - Setting.sceneWidth,
            500
          );
          gsap.to(face.sprite.position, {
            x: Setting.sceneWidth / 2,
            y: 500,
            duration: 1,
          });
        }
      }
      for (const displacement of this.displacements) {
        if (displacement.charNumber === previousCharNumber) {
          gsap.to(displacement.sprite.position, {
            x: Setting.sceneWidth / 2 + Setting.sceneWidth,
            y: 500,
            duration: 1,
          });
        } else if (displacement.charNumber === this.charNumber) {
          displacement.sprite.position.set(
            Setting.sceneWidth / 2 - Setting.sceneWidth,
            500
          );
          gsap.to(displacement.sprite.position, {
            x: Setting.sceneWidth / 2,
            y: 500,
            duration: 1,
          });
        }
      }
      await wait(1000);
      this.faceMoveEnable(false);
    } else if (direction === "left") {
      const previousCharNumber = this.charNumber;
      this.charNumber = this.charNumber + 1;
      if (this.charNumber >= this.faces.length) {
        this.charNumber = 0;
      }
      for (const face of this.faces) {
        if (face.charNumber === previousCharNumber) {
          gsap.to(face.sprite.position, {
            x: Setting.sceneWidth / 2 - Setting.sceneWidth,
            y: 500,
            duration: 1,
          });
        }
        if (face.charNumber === this.charNumber) {
          face.sprite.position.set(
            Setting.sceneWidth / 2 + Setting.sceneWidth,
            500
          );
          gsap.to(face.sprite.position, {
            x: Setting.sceneWidth / 2,
            y: 500,
            duration: 1,
          });
        }
      }
      for (const displacement of this.displacements) {
        if (displacement.charNumber === previousCharNumber) {
          gsap.to(displacement.sprite.position, {
            x: Setting.sceneWidth / 2 - Setting.sceneWidth,
            y: 500,
            duration: 1,
          });
        }
        if (displacement.charNumber === this.charNumber) {
          displacement.sprite.position.set(
            Setting.sceneWidth / 2 + Setting.sceneWidth,
            500
          );
          gsap.to(displacement.sprite.position, {
            x: Setting.sceneWidth / 2,
            y: 500,
            duration: 1,
          });
        }
      }
      await wait(1000);
      this.faceMoveEnable(false);
    } else if (direction === "default") {
      for (const face of this.faces) {
        if (face.charNumber === this.charNumber) {
          face.sprite.position.set(Setting.sceneWidth / 2, 500);
        }
      }
      for (const displacement of this.displacements) {
        if (displacement.charNumber === this.charNumber) {
          displacement.sprite.position.set(Setting.sceneWidth / 2, 500);
        }
      }
      this.faceMoveEnable(false);
    }
    this.setPositonStickers(this.charNumber);
  }

  private faceMoveEnable(enable: boolean) {
    if (this.leftButtonSprite && this.rightButtonSprite) {
      if (enable) {
        this.faceMoving = true;
        this.leftButtonSprite.alpha = 0.5;
        this.rightButtonSprite.alpha = 0.5;
      } else {
        this.faceMoving = false;
        this.leftButtonSprite.alpha = 1;
        this.rightButtonSprite.alpha = 1;
      }
    }
  }

  private loadStickerHive() {
    const stickerManager = new StickerManager();
    const { stickers, stickerHive } = stickerManager.getStickerData();

    this.stickerHive = stickerHive;
    this.stickers = stickers;

    if (this.stickerHive) {
      this.addChild(this.stickerHive);
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

  private destroyBackground() {
    if (this.backgroundSprite) {
      this.backgroundSprite.destroy();
      this.backgroundSprite = null;
    }
  }

  private destroyButton() {
    if (this.backButtonSprite) {
      this.backButtonSprite.destroy();
      this.backButtonSprite = null;
    }

    if (this.leftButtonSprite) {
      this.leftButtonSprite.destroy();
      this.leftButtonSprite = null;
    }

    if (this.rightButtonSprite) {
      this.rightButtonSprite.destroy();
      this.rightButtonSprite = null;
    }
  }

  private destroyFace() {
    for (const face of this.faces) {
      face.sprite.destroy();
    }
    this.faces = [];
    if (this.displacementFilter) {
      for (const filter of this.displacementFilter) {
        filter.destroy();
      }
      this.displacementFilter = [];
    }
  }

  private destroyDisplacement() {
    if (this.displacements && this.displacementFilter) {
      for (let i = 0; i < this.displacements.length; i++) {
        if (this.displacements[i] && this.displacementFilter[i]) {
          this.displacementFilter[i].scale.x = 0;
          this.displacementFilter[i].scale.y = 0;
          this.removeChild(this.displacements[i].sprite);
        }
      }
      this.displacementFilter = [];
      this.displacements = [];
      window.removeEventListener(
        "pointermove",
        this.pointerMoveHandler.bind(this)
      );
    }
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
    this.saveStore();
    this.destroyBackground();
    this.destroyButton();
    this.destroyDisplacement();
    this.destroyFace();
    this.destroyStickerHive();
    super.destroy();
  }
}
