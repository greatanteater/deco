import * as Pixi from "pixi.js";
import { gsap } from "gsap";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";
import { OutlineFilter } from "@pixi/filter-outline";
import { getAssets } from "../../data/Resource";

export default class Palette extends Pixi.Container {
  private sceneName = "palette";
  // private imageAssets: { [key: string]: any };
  private palette: Pixi.Container | null = null;
  private colors: number[] = []; // 색상을 16진수로 저장합니다.
  private colorRects: Pixi.Graphics[] = []; // 각 색상을 대표하는 Graphics 객체를 저장합니다.
  private colorRectGroups: {
    leftGroup: Pixi.Sprite[];
    middleGroup: Pixi.Sprite[];
    rightGroup: Pixi.Sprite[];
  } = { leftGroup: [], middleGroup: [], rightGroup: [] };
  private selectedColor = 0;
  private drag = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    dragging: false,
  };

  private background: Pixi.Sprite | null = null;
  private pensils: Pixi.Sprite[] = [];
  private eraser: Pixi.Sprite | null = null;
  private pensilWidth = 50;
  private readyToSelect = true;
  private startGlobalX = 0;
  private selectedIndex = 0;

  constructor() {
    super();
    // this.imageAssets = getAssets(this.sceneName).image;
    this.initialize();
  }

  private async initialize() {
    this.setColor();
  }

  private setColor() {
    this.colors = [
      0xff0000, // 빨강
      0xffff00, // 노랑
      0x00ff00, // 녹색
      0x00ffff, // 청록
      0x0000ff, // 파랑
      0xff00ff, // 자홍
      0x000000, // 검정
      0xffffff, // 흰색
      0x800000, // 어두운 빨강
      0x808000, // 어두운 노랑
      0x008000, // 어두운 녹색
      0x008080, // 어두운 청록
      0x000080, // 어두운 파랑
      0x800080, // 어두운 자홍
      0xc0c0c0, // 실버
      0x808080, // 회색
      0x99ccff, // 하늘색
      0xff99cc, // 분홍색
      0xcc99ff, // 연보라색
      0x99ffcc, // 연두색
    ];
    this.colorRects = [];
    this.colorRectGroups = {
      leftGroup: [],
      middleGroup: [],
      rightGroup: [],
    };
    this.selectedColor = 0xffffff;
  }

  public setPalette(x: number, y: number) {
    this.background = Pixi.Sprite.from("image/palette/background.png");
    this.background.anchor.set(0.5);
    this.background.x = 650;
    this.background.y = 730;

    this.background.texture.baseTexture.on("loaded", () => {
      if (this.background) {
        this.addChild(this.background);

        this.palette = new Pixi.Container();
        this.pensilWidth = 100;
        const totalWidth = this.colors.length * this.pensilWidth;
        this.palette.pivot.x = totalWidth / 2;
        this.palette.pivot.y = 50;

        this.palette.x = x;
        this.palette.y = y; // pivot 값을 고려해 위치를 설정합니다.
        this.addChild(this.palette);

        const mask = new Pixi.Graphics();
        const maskWidth = 380;
        const maskHeight = 240;
        const maskCenterX = 650 - maskWidth / 2;
        const maskCenterY = this.palette.y - this.palette.pivot.y;
        mask.beginFill(0xffffff);
        mask.drawRoundedRect(
          maskCenterX + 35,
          maskCenterY - 10,
          maskWidth,
          maskHeight / 2,
          30
        );
        mask.endFill();
        this.addChild(mask);
        this.palette.mask = mask;

        // const showMask = new Pixi.Graphics();
        // showMask.beginFill(0xffffff, 0.5);
        // showMask.drawRoundedRect(
        //   maskCenterX + 35,
        //   maskCenterY - 10,
        //   maskWidth,
        //   maskHeight / 2,
        //   30
        // );
        // showMask.endFill();
        // this.addChild(showMask);

        this.palette.interactive = true;
        this.palette.on("pointerdown", (e: Pixi.FederatedPointerEvent) =>
          this.onDragStart(e)
        );
        this.palette.on("pointerup", () => this.onDragEnd());
        this.palette.on("pointerupoutside", () => this.onDragEnd());
        this.palette.on("pointermove", (e: Pixi.FederatedPointerEvent) =>
          this.onDragMove(e)
        );

        this.eraser = Pixi.Sprite.from("image/palette/eraser.png");
        this.eraser.anchor.set(0.5);
        this.eraser.width = 76;
        this.eraser.height = 76;
        this.eraser.x =
          x -
          this.background.width / 2 +
          this.eraser.width / 2 +
          this.background.width / 70;
        this.eraser.y = y;
        this.addChild(this.eraser);

        for (let i = 0; i < this.colors.length; i++) {
          const pencil = Pixi.Sprite.from(`image/palette/pensil${i + 1}.png`);
          pencil.anchor.set(0.5);
          pencil.x = i * this.pensilWidth;
          pencil.y = 50;
          pencil.interactive = true;
          pencil.on("pointertap", () => {
            this.choicePencil(i, pencil);
          });

          const integerPart = Math.floor(this.colors.length / 3);
          if (i < integerPart) {
            this.colorRectGroups.leftGroup.push(pencil);
          } else if (i < integerPart * 2) {
            this.colorRectGroups.middleGroup.push(pencil);
          } else {
            this.colorRectGroups.rightGroup.push(pencil);
          }
          this.palette.addChild(pencil);
          this.pensils.push(pencil);

          if (i == this.colors.length - 1) {
            this.palette.hitArea = new Pixi.Rectangle(
              0,
              0,
              i * this.pensilWidth,
              maskHeight
            );
          }
        }
      }
    });
  }

  private setHitArea() {
    const allSprites = [
      ...this.colorRectGroups.leftGroup,
      ...this.colorRectGroups.middleGroup,
      ...this.colorRectGroups.rightGroup,
    ];
    const leftMostSprite = allSprites.reduce(
      (leftMost, sprite) =>
        sprite.x - sprite.width / 2 < leftMost.x - leftMost.width / 2
          ? sprite
          : leftMost,
      allSprites[0]
    );
    const rightMostSprite = allSprites.reduce(
      (rightMost, sprite) =>
        sprite.x + sprite.width / 2 > rightMost.x + rightMost.width / 2
          ? sprite
          : rightMost,
      allSprites[0]
    );

    if (this.palette) {
      this.palette.hitArea = new Pixi.Rectangle(
        leftMostSprite.x - leftMostSprite.width / 2,
        leftMostSprite.y - leftMostSprite.height / 2,
        rightMostSprite.x +
          rightMostSprite.width / 2 -
          (leftMostSprite.x - leftMostSprite.width / 2),
        rightMostSprite.y +
          rightMostSprite.height / 2 -
          (leftMostSprite.y - leftMostSprite.height / 2)
      );
    }
  }

  private choicePencil(i: number, sprite: Pixi.Sprite) {
    if (this.selectedIndex === i || !this.readyToSelect) {
      this.readyToSelect = true;
      return;
    }

    this.selectedColor = this.colors[i];

    this.pensils[this.selectedIndex].y = 50;
    sprite.y = 30;
    this.selectedIndex = i;
  }

  private onDragStart(e: Pixi.FederatedPointerEvent) {
    if (this.palette) {
      this.startGlobalX = e.globalX - this.x;
      this.drag.start.x = e.globalX - this.x - this.palette.x;
      this.drag.dragging = true;

      const clickedSprite = this.palette.children.find((child) =>
        child.getBounds().contains(e.globalX, e.globalY)
      ) as Pixi.Sprite;

      if (this.colorRectGroups.leftGroup.includes(clickedSprite)) {
        const leftGroupFirstX = this.colorRectGroups.leftGroup[0].x;
        this.colorRectGroups.rightGroup
          .slice()
          .reverse()
          .forEach((sprite, index) => {
            sprite.x = leftGroupFirstX - this.pensilWidth * (index + 1);
          });

        const leftGroupLastX =
          this.colorRectGroups.leftGroup[
            this.colorRectGroups.leftGroup.length - 1
          ].x;
        this.colorRectGroups.middleGroup.slice().forEach((sprite, index) => {
          sprite.x = leftGroupLastX + this.pensilWidth * (index + 1);
        });
      }
      if (this.colorRectGroups.rightGroup.includes(clickedSprite)) {
        const rightGroupFirstX = this.colorRectGroups.rightGroup[0].x;
        this.colorRectGroups.middleGroup
          .slice()
          .reverse()
          .forEach((sprite, index) => {
            sprite.x = rightGroupFirstX - this.pensilWidth * (index + 1);
          });

        const rightGroupLastX =
          this.colorRectGroups.rightGroup[
            this.colorRectGroups.rightGroup.length - 1
          ].x;
        this.colorRectGroups.leftGroup.slice().forEach((sprite, index) => {
          sprite.x = rightGroupLastX + this.pensilWidth * (index + 1);
        });
      }
      if (this.colorRectGroups.middleGroup.includes(clickedSprite)) {
        const middleGroupFirstX = this.colorRectGroups.middleGroup[0].x;
        const middleGroupLastX =
          this.colorRectGroups.middleGroup[
            this.colorRectGroups.middleGroup.length - 1
          ].x;

        this.colorRectGroups.leftGroup
          .slice()
          .reverse()
          .forEach((sprite, index) => {
            sprite.x = middleGroupFirstX - this.pensilWidth * (index + 1);
          });

        this.colorRectGroups.rightGroup.slice().forEach((sprite, index) => {
          sprite.x = middleGroupLastX + this.pensilWidth * (index + 1);
        });
      }
      this.setHitArea();
    }
  }

  private onDragEnd() {
    this.drag.dragging = false;
  }

  private onDragMove(e: Pixi.FederatedPointerEvent) {
    if (this.palette) {
      if (this.drag.dragging) {
        this.palette.x = e.globalX - this.x - this.drag.start.x;
        if (Math.abs(this.startGlobalX - (e.globalX - this.x)) >= 10) {
          this.readyToSelect = false;
        }
      }
    }
  }
}
