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
  private pencils: Pixi.Sprite[] = [];
  private eraser: Pixi.Sprite | null = null;
  private pencilWidth = 50;
  private readyToSelect = true;
  private startGlobalX = 0;
  private selectedIndex = 0;
  private isUp: boolean = false;

  constructor() {
    super();
    // this.imageAssets = getAssets(this.sceneName).image;
    this.initialize();
  }

  private async initialize() {
    this.selectedIndex = 100;
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

  public async setPalette(x: number, y: number) {
    const backgroundLoad = await Pixi.Assets.load(
      "image/palette/background.png"
    );
    this.background = Pixi.Sprite.from(backgroundLoad);
    this.background.anchor.set(0.5);
    this.background.x = 650;
    this.background.y = 730;
    this.addChild(this.background);

    this.palette = new Pixi.Container();
    this.pencilWidth = 100;
    const totalWidth = this.colors.length * this.pencilWidth;
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
    this.eraser.interactive = true;
    this.eraser.on("pointertap", this.choiceEraser, this);
    this.addChild(this.eraser);

    for (let i = 0; i < this.colors.length; i++) {
      const pencil = Pixi.Sprite.from(`image/palette/pencil${i + 1}.png`);
      pencil.anchor.set(0.5);
      pencil.x = i * this.pencilWidth;
      pencil.y = 50;
      pencil.interactive = true;
      pencil.on("pointerdown", () => (this.readyToSelect = true));
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
      this.pencils.push(pencil);

      if (i == this.colors.length - 1) {
        this.palette.hitArea = new Pixi.Rectangle(
          0,
          0,
          i * this.pencilWidth,
          maskHeight
        );
      }
    }
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

  private choiceEraser() {
    if (this.eraser) {
      if (this.selectedIndex < this.pencils.length) {
        this.pencils[this.selectedIndex].y = 50;
      }
      if (this.isUp) {
        this.eraser.y += 20;
      } else {
        this.eraser.y -= 20;
      }
      this.isUp = !this.isUp;
      this.selectedIndex = 100;
    }
  }

  private choicePencil(i: number, sprite: Pixi.Sprite) {
    if (this.selectedIndex === i || !this.readyToSelect) {
      return;
    }

    if (this.isUp) {
      this.choiceEraser();
    }
    this.selectedColor = this.colors[i];

    if (this.selectedIndex < this.pencils.length) {
      this.pencils[this.selectedIndex].y = 50;
    }

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
            sprite.x = leftGroupFirstX - this.pencilWidth * (index + 1);
          });

        const leftGroupLastX =
          this.colorRectGroups.leftGroup[
            this.colorRectGroups.leftGroup.length - 1
          ].x;
        this.colorRectGroups.middleGroup.slice().forEach((sprite, index) => {
          sprite.x = leftGroupLastX + this.pencilWidth * (index + 1);
        });
      }
      if (this.colorRectGroups.rightGroup.includes(clickedSprite)) {
        const rightGroupFirstX = this.colorRectGroups.rightGroup[0].x;
        this.colorRectGroups.middleGroup
          .slice()
          .reverse()
          .forEach((sprite, index) => {
            sprite.x = rightGroupFirstX - this.pencilWidth * (index + 1);
          });

        const rightGroupLastX =
          this.colorRectGroups.rightGroup[
            this.colorRectGroups.rightGroup.length - 1
          ].x;
        this.colorRectGroups.leftGroup.slice().forEach((sprite, index) => {
          sprite.x = rightGroupLastX + this.pencilWidth * (index + 1);
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
            sprite.x = middleGroupFirstX - this.pencilWidth * (index + 1);
          });

        this.colorRectGroups.rightGroup.slice().forEach((sprite, index) => {
          sprite.x = middleGroupLastX + this.pencilWidth * (index + 1);
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

  private destroyPalette() {
    if (this.background) {
      this.background.texture.baseTexture.removeAllListeners();
      this.background.destroy();
      Pixi.Assets.unload("image/palette/background.png");
    }

    if (this.palette) {
      this.palette.off("pointerdown");
      this.palette.off("pointerup");
      this.palette.off("pointerupoutside");
      this.palette.off("pointermove");
      this.pencils.forEach((pencil) => {
        pencil.off("pointertap");
        pencil.destroy();
      });
      this.palette.destroy({
        children: true,
        texture: true,
        baseTexture: true,
      });
    }

    if (this.eraser) {
      this.eraser.off("pointertap");
      this.eraser.destroy();
    }
  }

  public destroy() {
    this.destroyPalette();
    super.destroy();
  }
}