import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";

interface Position {
  x: number;
  y: number;
}

interface Face {
  sprite: Pixi.Sprite;
  charNumber: number;
}

interface Sticker {
  eye: eye;
  nose: nose;
  mouse: mouse;
}

interface eye {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

interface nose {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

interface mouse {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

export default class DecoScene extends Pixi.Container {
  private backgroundSprite: Pixi.Sprite | null = null;
  private backButtonSprite: Pixi.Sprite | null = null;
  private faces: Face[] = [];
  private leftButtonSprite: Pixi.Sprite | null = null;
  private rightButtonSprite: Pixi.Sprite | null = null;
  private currentView: string | null = null;
  private charNumber = 0;
  private faceMoving = false;
  private displacementSprite: Pixi.Sprite | null = null;
  private displacementFilter: Pixi.DisplacementFilter | null = null;
  private stickerHive: Pixi.Graphics | null = null;
  private stickers: Sticker[] = [];

  constructor() {
    super();
    this.loadStore();
    this.initialize();
  }

  private async initialize() {
    this.runScene();
    await this.fadeIn();
    this.example();
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
    this.setFaces();
    this.setFacesPosition("default");
    this.setStickerHive();
    this.setPositonStickers(this.charNumber);
  }

  private async fadeIn() {
    this.alpha = 0;
    const fadeIn = gsap.to(this, { alpha: 1, duration: 1 });
    await fadeIn;
    fadeIn.kill();
  }

  private example() {
    const flag = Pixi.Sprite.from(
      "https://pixijs.com/assets/pixi-filters/flag.png"
    );

    this.addChild(flag);
    flag.x = 100;
    flag.y = 100;

    const displacementSprite = Pixi.Sprite.from(
      "https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg"
    );
    // Make sure the sprite is wrapping.

    displacementSprite.texture.baseTexture.wrapMode = Pixi.WRAP_MODES.REPEAT;
    const displacementFilter = new Pixi.DisplacementFilter(displacementSprite);

    displacementFilter.padding = 10;

    displacementSprite.position = flag.position;

    this.addChild(displacementSprite);

    flag.filters = [displacementFilter];

    displacementFilter.scale.x = 30;
    displacementFilter.scale.y = 60;

    Pixi.Ticker.shared.add(() => {
      // Offset the sprite position to make vFilterCoord update to larger value.
      // Repeat wrapping makes sure there's still pixels on the coordinates.
      displacementSprite.x++;
      // Reset x to 0 when it's over width to keep values from going to very huge numbers.
      if (displacementSprite.x > displacementSprite.width) {
        displacementSprite.x = 0;
      }
    });
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

    this.displacementSprite = Pixi.Sprite.from("images/scene/map.webp");
    // this.displacementSprite.width = Setting.sceneWidth * 4;
    // this.displacementSprite.height = Setting.sceneHeight * 4;
    this.displacementSprite.anchor.set(0.5);
    this.displacementSprite.scale.set(0.5);
    this.displacementSprite.position.set(
      Setting.sceneWidth / 2,
      Setting.sceneHeight / 2
    );
    this.displacementSprite.texture.baseTexture.wrapMode =
      Pixi.WRAP_MODES.CLAMP;
    this.displacementFilter = new Pixi.DisplacementFilter(
      this.displacementSprite
    );
    this.displacementFilter.padding = 10;
    this.displacementFilter.scale.x = 150;
    this.displacementFilter.scale.y = 100;

    this.addChild(this.displacementSprite);

    for (const { imagePath, position, charNumber } of faceData) {
      const sprite = Pixi.Sprite.from(imagePath);
      sprite.width = 650;
      sprite.height = 700;
      sprite.anchor.set(0.5);
      sprite.position.set(position.x, position.y);
      sprite.filters = [this.displacementFilter];
      this.addChild(sprite);

      const face: Face = { sprite, charNumber };
      this.faces.push(face);
    }

    window.addEventListener("mousemove", (event) => {
      if (this.displacementSprite && this.displacementFilter) {
        const midpointX = Setting.sceneWidth / 2,
          midpointY = Setting.sceneHeight / 2,
          posX = midpointX - event.clientX,
          posY = midpointY - event.clientY,
          valX = (posX / midpointX) * 50,
          valY = (posY / midpointY) * 50;
        this.displacementFilter.scale.x = valX;
        this.displacementFilter.scale.y = valY;
      }
    });
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
      await wait(1000);
      this.faceMoveEnable(false);
    } else if (direction === "default") {
      for (const face of this.faces) {
        if (face.charNumber === this.charNumber) {
          face.sprite.position.set(Setting.sceneWidth / 2, 500);
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

  private setStickerHive() {
    this.stickerHive = new Pixi.Graphics();
    this.stickerHive.beginFill(0xffebcd);
    this.stickerHive.drawRoundedRect(0, 0, 160, 550, 10);
    this.stickerHive.endFill();
    this.stickerHive.pivot.set(60, 225);
    this.stickerHive.position.set(1200, 300);
    this.addChild(this.stickerHive);

    for (let i = 1; i <= 4; i++) {
      let sticker: Sticker = {
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
      this.addChild(sticker.eye.sprite);
      this.addChild(sticker.nose.sprite);
      this.addChild(sticker.mouse.sprite);
      this.stickers.push(sticker);
    }
  }

  private setPositonStickers(number: number) {
    this.stickers.forEach((sticker: Sticker, i: number) => {
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
    if (this.displacementSprite) {
      this.displacementSprite.destroy();
      this.displacementSprite = null;
    }
    if (this.displacementFilter) {
      this.displacementFilter.destroy();
      this.displacementFilter = null;
    }
  }

  public destroy() {
    this.saveStore();
    this.destroyBackground();
    this.destroyButton();
    this.destroyFace();
    super.destroy();
  }
}
