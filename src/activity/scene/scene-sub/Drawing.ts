import * as Pixi from "pixi.js";
import Setting from "../../base/Setting";
import { wait } from "../../util/Util";
import { get } from "svelte/store";
import {
  currentView,
  characterNumber,
  eyesAttachedStatus,
} from "../../store/store";
import { gsap } from "gsap";
import * as Interface from "../../base/Interface";
import * as Coordinate from "../data/Coordinate";
import DecoScene from "../DecoScene";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";
import { OutlineFilter } from "@pixi/filter-outline";
import { getAssets } from "../data/Resource";

export default class Drawing extends Pixi.Container {
  private sceneName = "drawing";
  private imageAssets: { [key: string]: any };
  private scene: DecoScene;
  private down = false;
  private erase = false;
  private prevX = 0;
  private prevY = 0;
  private faces: Interface.Face[] = [];
  private leftButtonSprite: Pixi.Sprite | null = null;
  private rightButtonSprite: Pixi.Sprite | null = null;
  private faceMoving = false;
  private displacementFilter: Pixi.DisplacementFilter[] = [];
  private featuresMotionFilter: Pixi.DisplacementFilter[] = [];
  private filter: OutlineFilter | null = null;
  private charNumber = 0;
  private faceY = 0;
  private faceContainers: Interface.FaceContainer[] = [];
  private drawTarget: string = "";
  private eyes: Interface.Eyes[] = [];
  private nose: Interface.Nose[] = [];
  private mouth: Interface.Mouth[] = [];
  private faceForward = false;
  private isDisplacementAnimation = false;

  constructor(scene: DecoScene) {
    super();
    this.imageAssets = getAssets(this.sceneName).image;
    this.scene = scene;
    this.initialize();
  }

  private async initialize() {
    this.eventMode = "static";
    this.faceY = 400;
    this.drawTarget = "face";
    await this.setFaces();
    this.setFacesPosition("default");
    this.setFaceForward();
    this.setButton();
    this.loadStore();
    this.setUpEventListeners();
    this.faceFeatures();
    // this.greatBoard();
  }

  private setUpEventListeners() {
    this.faces.forEach((face) => {
      face.graphic.on(
        "pointerdown",
        (e) => this.onPointerDown(e, "face"),
        this
      );
      face.hairGraphic.on(
        "pointerdown",
        (e) => this.onPointerDown(e, "hair"),
        this
      );
    });
    this.on("pointermove", this.onPointerMove, this);
    this.on("pointerup", this.onPointerUp, this);
    this.on("pointerupoutside", this.onPointerUp, this);
    this.scene.on("pointermove", this.pointerMoveDisplacementHandler, this);
  }

  private tearDownEventListeners() {
    this.faces.forEach((face) => {
      face.graphic.off(
        "pointerdown",
        (e) => this.onPointerDown(e, "face"),
        this
      );
      face.hairGraphic.off(
        "pointerdown",
        (e) => this.onPointerDown(e, "hair"),
        this
      );
    });
    this.off("pointermove", this.onPointerMove, this);
    this.off("pointerup", this.onPointerUp, this);
    this.off("pointerupoutside", this.onPointerUp, this);
    this.scene.off("pointermove", this.pointerMoveDisplacementHandler, this);
  }

  private loadStore() {
    this.charNumber = get(characterNumber);
  }

  private saveStore() {
    characterNumber.set(this.charNumber);
  }

  private isPointerOverFace(e: Pixi.FederatedPointerEvent) {
    const charGlobalCoordinates =
      Coordinate.charGlobalCoordinates[0].coordinates;
    const charGlobalPoints = charGlobalCoordinates.flatMap(({ x, y }) => [
      x,
      y,
    ]);
    const hitArea = new Pixi.Polygon(charGlobalPoints);

    if (hitArea.contains(e.globalX - this.x, e.globalY - this.y)) {
      this.setFaceForward();
    } else {
      if (this.faceForward) {
      }
      this.resetFaceOrientation(e);
    }
  }

  private pointerMoveDisplacementHandler(e: Pixi.FederatedPointerEvent) {
    this.isPointerOverFace(e);
    if (
      this.isDisplacementAnimation ||
      e.clientX < 0 ||
      e.clientX > Setting.sceneWidth ||
      e.clientY < 0 ||
      e.clientY > Setting.sceneHeight
    ) {
      return;
    }

    if (
      this.displacementFilter[this.charNumber] &&
      this.featuresMotionFilter[this.charNumber]
    ) {
      const midpointX = Setting.sceneWidth / 2,
        midpointY = Setting.sceneHeight / 2,
        posX = midpointX - e.globalX - this.x,
        posY = midpointY - e.globalY - this.x,
        valX = (posX / midpointX) * 30,
        valY = (posY / midpointY) * 17,
        featuresValX = (posX / midpointX) * 30,
        featuresValY = (posY / midpointY) * 30;
      this.displacementFilter[this.charNumber].scale.x = valX;
      this.displacementFilter[this.charNumber].scale.y = valY;
      this.featuresMotionFilter[this.charNumber].scale.x = featuresValX;
      this.featuresMotionFilter[this.charNumber].scale.y = featuresValY;
    }
  }

  private changeFilter(target: string) {
    if (this.filter) {
      switch (target) {
        case "features":
          this.faces[this.charNumber].hairGraphic.filters = [this.filter];
          this.faces[this.charNumber].graphic.filters = [this.filter];
          break;
        case "face":
          this.faces[this.charNumber].hairGraphic.filters = [
            this.displacementFilter[this.charNumber],
            this.filter,
          ];
          this.faces[this.charNumber].graphic.filters = [
            this.displacementFilter[this.charNumber],
            this.filter,
          ];
          break;
      }
    }
  }

  private setFaceForward() {
    if (this.faceForward) {
      return;
    }
    this.faceForward = true;
    if (this.displacementFilter[this.charNumber]) {
      this.isDisplacementAnimation = true;
      gsap.to(this.displacementFilter[this.charNumber].scale, {
        x: 0,
        y: 0,
        duration: 0.2,
        onComplete: () => {
          this.isDisplacementAnimation = false;
          this.changeFilter("features");
        },
      });
    }
  }

  private resetFaceOrientation(e: Pixi.FederatedPointerEvent) {
    if (!this.faceForward) {
      return;
    }
    this.faceForward = false;
    if (this.displacementFilter[this.charNumber]) {
      const midpointX = Setting.sceneWidth / 2,
        midpointY = Setting.sceneHeight / 2,
        posX = midpointX - e.globalX - this.x,
        posY = midpointY - e.globalY - this.y,
        valX = (posX / midpointX) * 30,
        valY = (posY / midpointY) * 17;

      this.isDisplacementAnimation = true;
      this.displacementFilter[this.charNumber].scale.x = 0;
      this.displacementFilter[this.charNumber].scale.y = 0;
      this.changeFilter("face");
      gsap.to(this.displacementFilter[this.charNumber].scale, {
        x: valX,
        y: valY,
        duration: 0.2,
        onComplete: () => {
          this.isDisplacementAnimation = false;
        },
      });
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

    const localPoint = this.faces[this.charNumber].sprite.toLocal(globalPoint);

    const adjustedLocalPoint = {
      x: localPoint.x + this.faces[this.charNumber].sprite.width / 2,
      y: localPoint.y + this.faces[this.charNumber].sprite.height / 2,
    };

    // console.log(`{ x: ${adjustedLocalPoint.x}, y:${adjustedLocalPoint.y} }`);

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
    const faceData = [
      {
        position: { x: -1000, y: this.faceY },
        charNumber: 0,
      },
      {
        position: { x: -1000, y: this.faceY },
        charNumber: 1,
      },
      {
        position: { x: -1000, y: this.faceY },
        charNumber: 2,
      },
      {
        position: { x: -1000, y: this.faceY },
        charNumber: 3,
      },
    ];

    const center = {
      x: Setting.sceneWidth / 2,
      y: Setting.sceneHeight / 2,
    };

    for (const { position, charNumber } of faceData) {
      const container = new Pixi.Container();
      container.pivot.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2);
      container.position.set(-1000, this.faceY);
      container.interactive = true;
      container.eventMode = "static";

      const displacement = Pixi.Sprite.from(
        this.imageAssets.map[charNumber].path
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
      this.featuresMotionFilter[charNumber] = new Pixi.DisplacementFilter(
        displacement
      );
      container.addChild(displacement);

      this.filter = new OutlineFilter(2, 0x000000);

      const maskLoad = await Pixi.Assets.load(
        this.imageAssets.face[charNumber].path
      );
      console.log('개빡 ' + maskLoad);
      const sprite = Pixi.Sprite.from(maskLoad);
      sprite.anchor.set(0.5);
      sprite.position.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2);

      const graphic = new SmoothGraphics();
      graphic.mask = sprite;
      graphic.beginFill(0xffffff, 1);

      graphic.drawRect(0, 0, sprite.width, sprite.height);
      graphic.pivot.set(sprite.width / 2, sprite.height / 2);
      graphic.position.set(sprite.x, sprite.y);
      const faceCoordinates = Coordinate.faceCoordinates[0].coordinates;
      const facePoints = faceCoordinates.flatMap(({ x, y }) => [x, y]);
      graphic.hitArea = new Pixi.Polygon(facePoints);
      graphic.interactive = true;
      graphic.eventMode = "static";
      graphic.endFill();
      graphic.filters = [this.filter];

      container.addChild(graphic, sprite);

      const hairMaskLoad = await Pixi.Assets.load(
        this.imageAssets.hair[charNumber].path
      );
      const hairSprite = Pixi.Sprite.from(hairMaskLoad);
      hairSprite.anchor.set(0.5);
      hairSprite.position.set(
        Setting.sceneWidth / 2,
        Setting.sceneHeight / 2 - 200
      );

      const hairGraphic = new SmoothGraphics();
      hairGraphic.mask = hairSprite;
      hairGraphic.beginFill(0xffffff, 1);
      hairGraphic.drawRect(0, 0, hairSprite.width, hairSprite.height);
      hairGraphic.pivot.set(hairSprite.width / 2, hairSprite.height / 2);
      hairGraphic.position.set(hairSprite.x, hairSprite.y);
      const hairCoordinates = Coordinate.hairCoordinates[0].coordinates;
      const hairPoints = hairCoordinates.flatMap(({ x, y }) => [x, y]);
      hairGraphic.hitArea = new Pixi.Polygon(hairPoints);
      hairGraphic.interactive = true;
      hairGraphic.eventMode = "static";
      hairGraphic.endFill();
      hairGraphic.filters = [this.filter];

      container.addChild(hairGraphic, hairSprite);

      const face: Interface.Face = {
        displacement,
        sprite,
        graphic,
        hairSprite,
        hairGraphic,
        charNumber,
        faceCoordinate: faceCoordinates,
        hairCoordinate: hairCoordinates,
      };
      this.faces.push(face);

      this.addChild(container);
      const faceContainer: Interface.FaceContainer = { container, charNumber };
      this.faceContainers.push(faceContainer);
    }
  }

  protected targetSelect(target: string) {
    this.drawTarget = target;
  }

  protected onPointerDown(e: Pixi.FederatedPointerEvent, target: string) {
    this.down = true;
    this.drawTarget = target;
    let sprite = null;
    if (target === "face") {
      sprite = this.faces[this.charNumber].sprite;
    } else if (this.drawTarget === "hair") {
      sprite = this.faces[this.charNumber].hairSprite;
    }

    if (sprite) {
      const globalPoint = new Pixi.Point(
        e.globalX - this.x,
        e.globalY - this.y
      );

      const localPoint = sprite.toLocal(globalPoint);

      const adjustedLocalPoint = {
        x: localPoint.x + sprite.width / 2,
        y: localPoint.y + sprite.height / 2,
      };
      this.prevX = adjustedLocalPoint.x;
      this.prevY = adjustedLocalPoint.y;
    }
  }

  protected onPointerMove(e: Pixi.FederatedPointerEvent) {
    if (this.down) {
      let board = null;
      let sprite = null;
      if (this.drawTarget === "face") {
        board = this.faces[this.charNumber].graphic;
        sprite = this.faces[this.charNumber].sprite;
      } else if (this.drawTarget === "hair") {
        board = this.faces[this.charNumber].hairGraphic;
        sprite = this.faces[this.charNumber].hairSprite;
      }
      if (board) {
        board.lineStyle({
          width: 10,
          color: 0x000000,
          cap: Pixi.LINE_CAP.ROUND,
          join: Pixi.LINE_JOIN.ROUND,
          scaleMode: LINE_SCALE_MODE.NONE,
        });
        const globalPoint = new Pixi.Point(
          e.globalX - this.x,
          e.globalY - this.y
        );

        if (sprite) {
          const localPoint = sprite.toLocal(globalPoint);

          const adjustedLocalPoint = {
            x: localPoint.x + sprite.width / 2,
            y: localPoint.y + sprite.height / 2,
          };
          board.moveTo(this.prevX, this.prevY);
          board.lineTo(adjustedLocalPoint.x, adjustedLocalPoint.y);
          this.prevX = adjustedLocalPoint.x;
          this.prevY = adjustedLocalPoint.y;
        }
      }
    }
  }

  protected onPointerUp(e: Pixi.FederatedPointerEvent) {
    this.down = false;
    this.erase = !this.erase;
    this.drawTarget = "";
  }

  private async setFacesPosition(direction: string) {
    this.faceMoveEnable(true);

    if (direction === "right") {
      const previousCharNumber = this.charNumber;
      this.charNumber = this.charNumber - 1;
      if (this.charNumber < 0) {
        this.charNumber = this.faceContainers.length - 1;
      }
      for (const faceContainer of this.faceContainers) {
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
      if (this.charNumber >= this.faceContainers.length) {
        this.charNumber = 0;
      }
      for (const faceContainer of this.faceContainers) {
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
      this.faceContainers[this.charNumber].container.position.set(
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
    this.leftButtonSprite = Pixi.Sprite.from(this.imageAssets.left.path);
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

    this.rightButtonSprite = Pixi.Sprite.from(this.imageAssets.right.path);
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
      const eyes: Interface.Eyes = {
        left: {
          sprite: new Pixi.Sprite(
            Pixi.Texture.from(this.imageAssets.eye[i].path)
          ),
          position: Coordinate.faceFeaturePositions[i].eyes.left,
        },
        right: {
          sprite: new Pixi.Sprite(
            Pixi.Texture.from(this.imageAssets.eye[i].path)
          ),
          position: Coordinate.faceFeaturePositions[i].eyes.right,
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
      this.faceContainers[i].container.addChild(eyes.left.sprite);
      this.faceContainers[i].container.addChild(eyes.right.sprite);
      eyes.left.sprite.filters = [this.featuresMotionFilter[i]];
      eyes.right.sprite.filters = [this.featuresMotionFilter[i]];
    }
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
    for (const { container, charNumber } of this.faceContainers) {
      this.removeChild(container);
      this.displacementFilter[charNumber].destroy();
      this.featuresMotionFilter[charNumber].destroy();
      const face = this.faces.find((face) => face.charNumber === charNumber);
      if (face) {
        face.displacement.destroy();
        face.sprite.destroy();
        face.graphic.destroy();
        face.hairSprite.destroy();
        face.hairGraphic.destroy();
      }
    }
    this.displacementFilter = [];
    this.faceContainers = [];
    this.faces = [];

    Object.values<Interface.LoadableAsset>(this.imageAssets.face).forEach(
      (obj) => {
        Pixi.Assets.unload(obj.path);
      }
    );
    Object.values<Interface.LoadableAsset>(this.imageAssets.hair).forEach(
      (obj) => {
        Pixi.Assets.unload(obj.path);
      }
    );
  }

  public destroy() {
    this.tearDownEventListeners();
    this.destroyButton();
    this.destroyFace();
    super.destroy();
  }
}
