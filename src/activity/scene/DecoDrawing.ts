import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import * as Data from "./DecoData";
import DecoScene from "./DecoScene";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";

export default class DecoDrawing extends Pixi.Container {
  private maskSprite: Pixi.Sprite | null = null;
  private graphicDraw: SmoothGraphics | null = null;
  private down = false;
  private erase = false;
  private prevX = 0;
  private prevY = 0;
  private faces: Data.Face[] = [];
  private displacements: Data.Displacement[] = [];
  private leftButtonSprite: Pixi.Sprite | null = null;
  private rightButtonSprite: Pixi.Sprite | null = null;
  private faceMoving = false;
  private displacementFilter: Pixi.DisplacementFilter[] = [];
  private charNumber = 0;

  constructor(scene: DecoScene) {
    super();
    this.setupDrawing();
    this.setDisplacement();
    this.setFaces();
    this.setFacesPosition("default");
    this.setButton();
    this.loadStore();
  }

  private loadStore() {
    this.charNumber = get(characterNumber);
  }

  private saveStore() {
    characterNumber.set(this.charNumber);
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
    this.saveStore();
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

  private setButton() {
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

  private async setupDrawing() {
    this.eventMode = "static";
    this.on("pointerdown", this.onPointerDown, this);
    this.on("pointermove", this.onPointerMove, this);
    this.on("pointerup", this.onPointerUp, this);
    this.on("pointerupoutside", this.onPointerUp, this);

    const maskLoad = await Pixi.Assets.load("images/drawing/mini.png");
    this.maskSprite = Pixi.Sprite.from(maskLoad);
    this.maskSprite.anchor.set(0.5);
    this.maskSprite.position.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2);
    // this.interactive = true;
    // this.hitArea = new Pixi.Rectangle(
    //   0,
    //   0,
    //   this.maskSprite.width,
    //   this.maskSprite.width
    // );
    this.graphicDraw = new SmoothGraphics();
    this.graphicDraw.mask = this.maskSprite;
    this.graphicDraw.beginFill(0xffffff, 1);

    const center = {
        x: Setting.sceneWidth / 2,
        y: Setting.sceneHeight / 2
    }

    const maskHalf = {
        width: this.maskSprite.width / 2,
        height: this.maskSprite.height / 2
    }

    this.graphicDraw.drawRect(
      center.x - maskHalf.width,
      center.y - maskHalf.height,
      center.x + maskHalf.width,
      center.y + maskHalf.height
    );
    this.graphicDraw.endFill();
    this.addChild(this.maskSprite, this.graphicDraw);
  }

  protected onPointerDown(e: Pixi.FederatedEvent) {
    this.down = true;
    this.prevX = e.pageX - this.x;
    this.prevY = e.pageY - this.y;
  }

  protected onPointerMove(e: Pixi.FederatedEvent) {
    if (this.down) {
      if (this.graphicDraw) {
        this.graphicDraw.lineStyle({
          width: 10,
          color: 0x000000,
          cap: Pixi.LINE_CAP.ROUND,
          join: Pixi.LINE_JOIN.ROUND,
          scaleMode: LINE_SCALE_MODE.NONE,
        });
        this.graphicDraw.moveTo(this.prevX, this.prevY);
        this.graphicDraw.lineTo(e.pageX - this.x, e.pageY - this.y);
        this.prevX = e.pageX - this.x;
        this.prevY = e.pageY - this.y;
      }
    }
  }

  protected onPointerUp(e: Pixi.FederatedEvent) {
    this.down = false;
    this.erase = !this.erase;
  }

  private destroyButton() {
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

  public destroy() {
    this.destroyButton();
    this.destroyDisplacement();
    this.destroyFace();
    super.destroy();
  }
}
