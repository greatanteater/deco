import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import {
  currentView,
  characterNumber,
  eyesAttachedStatus,
} from "../store/store";
import { gsap } from "gsap";
import * as Data from "./DecoData";
import DecoScene from "./DecoScene";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";
import { OutlineFilter } from "@pixi/filter-outline";

export default class DecoDrawing extends Pixi.Container {
  private down = false;
  private erase = false;
  private prevX = 0;
  private prevY = 0;
  private faces: Data.Face[] = [];
  private leftButtonSprite: Pixi.Sprite | null = null;
  private rightButtonSprite: Pixi.Sprite | null = null;
  private faceMoving = false;
  private displacementFilter: Pixi.DisplacementFilter[] = [];
  private filter: OutlineFilter | null = null;
  private charNumber = 0;
  private faceY = 0;
  private faceContainer: Data.FaceContainer[] = [];
  private drawTarget: string = "";
  private eyes: Data.Eyes[] = [];
  private nose: Data.Nose[] = [];
  private mouse: Data.Mouse[] = [];

  constructor(scene: DecoScene) {
    super();
    this.initialize();

    eyesAttachedStatus.subscribe((value) => {
      this.attachEyeToFace(value[this.charNumber]);
    });
  }

  private async initialize() {
    this.eventMode = "static";
    this.faceY = 400;
    this.drawTarget = "hair";
    await this.setFaces();
    this.setFacesPosition("default");
    this.setButton();
    this.loadStore();
    this.setUpEventListeners();
    this.faceFeatures();
    // this.greatBoard();
    // this.startDisplacement();
  }

  private setUpEventListeners() {
    this.on("pointerdown", this.onPointerDown, this);
    this.on("pointermove", this.onPointerMove, this);
    this.on("pointerup", this.onPointerUp, this);
    this.on("pointerupoutside", this.onPointerUp, this);
    this.on("pointermove", this.pointerMoveHandler, this);
  }

  private tearDownEventListeners() {
    this.off("pointerdown", this.onPointerDown, this);
    this.off("pointermove", this.onPointerMove, this);
    this.off("pointerup", this.onPointerUp, this);
    this.off("pointerupoutside", this.onPointerUp, this);
    this.off("pointermove", this.pointerMoveHandler, this);
  }

  private startDisplacement() {
    if (this.displacementFilter[this.charNumber]) {
      const midpointX = Setting.sceneWidth / 2,
        midpointY = Setting.sceneHeight / 2,
        posX = 0,
        posY = 0,
        valX = (posX / midpointX) * 30,
        valY = (posY / midpointY) * 17;
      this.displacementFilter[this.charNumber].scale.x = valX;
      this.displacementFilter[this.charNumber].scale.y = valY;
    }
  }

  private loadStore() {
    this.charNumber = get(characterNumber);
  }

  private saveStore() {
    characterNumber.set(this.charNumber);
  }

  private pointerMoveHandler(event: Pixi.FederatedPointerEvent) {
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

  private greatBoard() {
    const graphicDraw = new SmoothGraphics();
    graphicDraw.beginFill(0xffffff, 0.5);
    graphicDraw.drawRect(0, 0, Setting.sceneWidth, Setting.sceneHeight);
    graphicDraw.endFill();
    this.addChild(graphicDraw);

    graphicDraw.interactive = true;
    this.on("pointerdown", this.drawPoint, this);
  }

  private drawPoint(e: Pixi.FederatedPointerEvent) {
    const globalPoint = new Pixi.Point(e.globalX, e.globalY);

    const localPoint =
      this.faces[this.charNumber].hairSprite.toLocal(globalPoint);

    const adjustedLocalPoint = {
      x:
        localPoint.x +
        this.faces[this.charNumber].hairSprite.texture.orig.width / 2,
      y:
        localPoint.y +
        this.faces[this.charNumber].hairSprite.texture.orig.height / 2,
    };

    console.log(`{ x: ${adjustedLocalPoint.x}, y:${adjustedLocalPoint.y} }`);

    this.drawPoint2(e);
  }

  private drawPoint2(e: Pixi.FederatedPointerEvent) {
    this.prevX = e.globalX - this.x;
    this.prevY = e.globalY - this.y;

    console.log(`{ x: ${this.prevX}, y:${this.prevY} }`);

    const radius = 2; // 점의 반지름
    const color = 0x000000; // 점의 색상

    const graphics = new Pixi.Graphics();
    graphics.beginFill(color);
    graphics.drawCircle(this.prevX, this.prevY, radius);
    graphics.endFill();

    this.addChild(graphics);
  }

  private async setFaces() {
    const displacementData = [
      {
        imagePath: "images/scene/map1.jpg",
      },
      {
        imagePath: "images/scene/map2.jpg",
      },
      {
        imagePath: "images/scene/map3.jpg",
      },
      {
        imagePath: "images/scene/map4.jpg",
      },
    ];

    const faceData = [
      {
        imagePath: "images/scene/face1.png",
        position: { x: -1000, y: this.faceY },
        charNumber: 0,
      },
      {
        imagePath: "images/scene/face2.png",
        position: { x: -1000, y: this.faceY },
        charNumber: 1,
      },
      {
        imagePath: "images/scene/face3.png",
        position: { x: -1000, y: this.faceY },
        charNumber: 2,
      },
      {
        imagePath: "images/scene/face4.png",
        position: { x: -1000, y: this.faceY },
        charNumber: 3,
      },
    ];

    const center = {
      x: Setting.sceneWidth / 2,
      y: Setting.sceneHeight / 2,
    };

    for (const { imagePath, position, charNumber } of faceData) {
      const container = new Pixi.Container();
      container.pivot.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2);
      container.position.set(-1000, this.faceY);

      const displacement = Pixi.Sprite.from(
        displacementData[charNumber].imagePath
      );
      displacement.width = 650;
      displacement.height = 700;
      displacement.anchor.set(0.5);
      displacement.scale.set(0.5);
      displacement.position.set(center.x, center.y);
      displacement.texture.baseTexture.wrapMode = Pixi.WRAP_MODES.CLAMP;
      this.displacementFilter[charNumber] = new Pixi.DisplacementFilter(
        displacement
      );
      container.addChild(displacement);

      this.filter = new OutlineFilter(2, 0x000000);

      const maskLoad = await Pixi.Assets.load("images/drawing/mini.png");
      const sprite = Pixi.Sprite.from(maskLoad);
      sprite.width = 650;
      sprite.height = 700;
      sprite.anchor.set(0.5);
      sprite.position.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2);

      const graphic = new SmoothGraphics();
      graphic.mask = sprite;
      graphic.beginFill(0xffffff, 1);

      graphic.drawRect(0, 0, Setting.sceneWidth, Setting.sceneHeight);
      graphic.pivot.set(center.x, center.y);
      graphic.position.set(center.x, center.y);
      graphic.endFill();
      graphic.filters = [this.filter];
      container.addChild(sprite);
      container.addChild(graphic);

      const hairMaskLoad = await Pixi.Assets.load("images/drawing/mini2.png");
      const hairSprite = Pixi.Sprite.from(hairMaskLoad);
      // hairSprite.width = 700;
      // hairSprite.height = 200;
      hairSprite.anchor.set(0.5);
      hairSprite.position.set(
        Setting.sceneWidth / 2,
        Setting.sceneHeight / 2 - 250
      );

      const hairGraphic = new SmoothGraphics();
      hairGraphic.mask = hairSprite;
      hairGraphic.beginFill(0xffffff, 1);
      hairGraphic.drawRect(0, 0, 1000, 1000);
      hairGraphic.pivot.set(hairSprite.width / 2, hairSprite.height / 2);
      hairGraphic.position.set(hairSprite.x, hairSprite.y);
      const coordinates = Data.hairCoordinates[0].coordinates;
      const points = coordinates.flatMap(({ x, y }) => [x, y]);
      hairGraphic.hitArea = new Pixi.Polygon(points);
      hairGraphic.interactive = true;
      hairGraphic.eventMode = "static";
      hairGraphic.cursor = "pointer";
      hairGraphic.on("pointertap", () => {
        console.log("hairGraphic was clicked!");
      });
      hairGraphic.endFill();
      hairGraphic.filters = [this.filter];
      container.addChild(hairSprite);
      container.addChild(hairGraphic);

      const face: Data.Face = {
        displacement,
        sprite,
        graphic,
        hairSprite,
        hairGraphic,
        charNumber,
        hairCoordinate: coordinates,
      };
      this.faces.push(face);

      this.addChild(container);
      const faceContainer: Data.FaceContainer = { container, charNumber };
      this.faceContainer.push(faceContainer);

      if (this.displacementFilter) {
        container.filters = [this.displacementFilter[charNumber]];
      }
    }
  }

  protected targetSelect(target: string) {
    this.drawTarget = target;
  }

  protected onPointerDown(e: Pixi.FederatedPointerEvent) {
    this.down = true;
    this.prevX = e.globalX - this.x;
    this.prevY = e.globalY - this.y;

    // const hitArea = this.faces[this.charNumber].hairGraphic.hitArea;

    // if (hitArea) {
    //   if (hitArea.contains(this.prevX, this.prevY)) {
    //     this.drawTarget = "hair";
    //   } else {
    //     this.drawTarget = "face";
    //   }
    // }
  }

  protected onPointerMove(e: Pixi.FederatedPointerEvent) {
    if (this.down) {
      const board =
        this.drawTarget === "hair"
          ? this.faces[this.charNumber].hairGraphic
          : this.faces[this.charNumber].graphic;
      if (board) {
        board.lineStyle({
          width: 10,
          color: 0x000000,
          cap: Pixi.LINE_CAP.ROUND,
          join: Pixi.LINE_JOIN.ROUND,
          scaleMode: LINE_SCALE_MODE.NONE,
        });
        board.moveTo(this.prevX, this.prevY);
        board.lineTo(e.globalX - this.x, e.globalY - this.y);
        this.prevX = e.globalX - this.x;
        this.prevY = e.globalY - this.y;
      }
    }
  }

  protected onPointerUp(e: Pixi.FederatedPointerEvent) {
    this.down = false;
    this.erase = !this.erase;
  }

  private async setFacesPosition(direction: string) {
    this.faceMoveEnable(true);

    if (direction === "right") {
      const previousCharNumber = this.charNumber;
      this.charNumber = this.charNumber - 1;
      if (this.charNumber < 0) {
        this.charNumber = this.faceContainer.length - 1;
      }
      for (const faceContainer of this.faceContainer) {
        if (faceContainer.charNumber === previousCharNumber) {
          gsap.to(faceContainer.container.position, {
            x: Setting.sceneWidth / 2 + Setting.sceneWidth,
            y: Setting.sceneHeight / 2,
            duration: 1,
          });
        } else if (faceContainer.charNumber === this.charNumber) {
          faceContainer.container.position.set(
            Setting.sceneWidth / 2 - Setting.sceneWidth,
            this.faceY
          );
          gsap.to(faceContainer.container.position, {
            x: Setting.sceneWidth / 2,
            y: Setting.sceneHeight / 2,
            duration: 1,
          });
        }
      }
      await wait(1000);
      this.faceMoveEnable(false);
    } else if (direction === "left") {
      const previousCharNumber = this.charNumber;
      this.charNumber = this.charNumber + 1;
      if (this.charNumber >= this.faceContainer.length) {
        this.charNumber = 0;
      }
      for (const faceContainer of this.faceContainer) {
        if (faceContainer.charNumber === previousCharNumber) {
          gsap.to(faceContainer.container.position, {
            x: Setting.sceneWidth / 2 - Setting.sceneWidth,
            y: Setting.sceneHeight / 2,
            duration: 1,
          });
        }
        if (faceContainer.charNumber === this.charNumber) {
          faceContainer.container.position.set(
            Setting.sceneWidth / 2 + Setting.sceneWidth,
            Setting.sceneHeight / 2
          );
          gsap.to(faceContainer.container.position, {
            x: Setting.sceneWidth / 2,
            y: Setting.sceneHeight / 2,
            duration: 1,
          });
        }
      }
      await wait(1000);
      this.faceMoveEnable(false);
    } else if (direction === "default") {
      this.faceContainer[this.charNumber].container.position.set(
        Setting.sceneWidth / 2,
        Setting.sceneHeight / 2
      );
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

  private faceFeatures() {
    for (let i = 0; i < 4; i++) {
      const eyes: Data.Eyes = {
        left: {
          sprite: new Pixi.Sprite(
            Pixi.Texture.from(`images/sticker/eye${i + 1}.png`)
          ),
          path: `images/scene/eye${i}.png`,
          position: Data.faceFeaturePositions[i].eyes.left,
        },
        right: {
          sprite: new Pixi.Sprite(
            Pixi.Texture.from(`images/sticker/eye${i + 1}.png`)
          ),
          path: `images/scene/eye${i}.png`,
          position: Data.faceFeaturePositions[i].eyes.right,
        },
      };
      eyes.left.sprite.width = 100;
      eyes.left.sprite.height = 100;
      eyes.left.sprite.position.set(eyes.left.position.x, eyes.left.position.y);
      eyes.left.sprite.anchor.set(0.5);
      eyes.right.sprite.width = 100;
      eyes.right.sprite.height = 100;
      eyes.right.sprite.position.set(
        eyes.right.position.x,
        eyes.right.position.y
      );
      eyes.right.sprite.anchor.set(0.5);
      this.eyes.push(eyes);
      this.faceContainer[i].container.addChild(eyes.left.sprite);
      this.faceContainer[i].container.addChild(eyes.right.sprite);
    }
  }

  private attachEyeToFace(enable: boolean) {}

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
    for (const { container, charNumber } of this.faceContainer) {
      // 객체에 대한 참조를 제거
      this.removeChild(container);

      // 필터 제거
      if (this.displacementFilter[charNumber]) {
        this.displacementFilter[charNumber].destroy();
      }

      // face 데이터 제거
      const face = this.faces.find((face) => face.charNumber === charNumber);
      if (face) {
        face.displacement.destroy();
        face.sprite.destroy();
        face.graphic.destroy();
        face.hairSprite.destroy();
        face.hairGraphic.destroy();
      }
    }

    // 배열 초기화
    this.displacementFilter = [];
    this.faceContainer = [];
    this.faces = [];
  }

  public destroy() {
    this.tearDownEventListeners();
    this.destroyButton();
    this.destroyFace();
    super.destroy();
  }
}
