import * as Pixi from "pixi.js";
import { gsap } from "gsap";

export default class Palette extends Pixi.Container {
  private palette: Pixi.Container | null = null;
  private path = "";
  private colors: number[] = []; // 색상을 16진수로 저장합니다.
  private colorRects: Pixi.Graphics[] = []; // 각 색상을 대표하는 Graphics 객체를 저장합니다.
  private colorRectGroups: {
    leftGroup: Pixi.Sprite[];
    middleGroup: Pixi.Sprite[];
    rightGroup: Pixi.Sprite[];
  } = { leftGroup: [], middleGroup: [], rightGroup: [] };
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
  private isAnimation = false;
  private isPaletteMoving = false;

  private paletteX = 0;
  private paletteY = 0;
  private backgroundX = 0;
  private backgroundY = 0;
  private eraserX = 0;
  private eraserY = 0;

  private paletteShow = true;

  constructor(x: number, y: number, path: string) {
    super();
    this.paletteX = x;
    this.paletteY = y;
    this.path = path;
    this.initialize();
  }

  private async initialize() {
    this.setColor();
    this.setPalette();
  }

  private setColor() {
    this.colors = [
      Infinity, // 지우개
      0x00a2e8, // 1
      0xed1c24, // 2
      0x22b14c, // 3
      0xff7f27, // 4
      0xffc90e, // 5
      0xffaec9, // 6
      0x7092be, // 7
      0xa349a4, // 8
      0xb97a57, // 9
      0x423899, // 10
      0xea3680, // 11
      0x000000, // 12
      0x67c976, // 13
      0x321b40, // 14
      0xb5e61d, // 15
      0xe6d03f, // 16
      0x0603e6, // 17
      0xe6526d, // 18
      0x1fe6dd, // 19
      0xe6b692, // 20
    ];
    this.colorRects = [];
    this.colorRectGroups = {
      leftGroup: [],
      middleGroup: [],
      rightGroup: [],
    };
    this.selectedIndex = 12;
  }

  public async setPalette() {
    const backgroundLoad = await Pixi.Assets.load(
      `${this.path}/background.png`
    );
    this.background = Pixi.Sprite.from(backgroundLoad);
    this.background.anchor.set(0.5);
    this.backgroundX = this.paletteX;
    this.backgroundY = this.paletteY - 20;
    this.background.x = this.backgroundX;
    this.background.y = this.backgroundY;
    this.addChild(this.background);

    this.palette = new Pixi.Container();
    this.pencilWidth = 60;
    const totalWidth = this.colors.length * this.pencilWidth;
    this.palette.pivot.x = totalWidth / 2;
    this.palette.pivot.y = 50;

    this.palette.x = this.paletteX;
    this.palette.y = this.paletteY; // pivot 값을 고려해 위치를 설정합니다.
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

    this.eraser = Pixi.Sprite.from(`${this.path}/eraser.png`);
    this.eraser.anchor.set(0.5);
    this.eraser.width = 76;
    this.eraser.height = 76;
    this.eraserX =
      this.paletteX -
      this.background.width / 2 +
      this.eraser.width / 2 +
      this.background.width / 70;
    this.eraserY = this.paletteY;
    this.eraser.x = this.eraserX;
    this.eraser.y = this.eraserY;
    this.eraser.interactive = true;
    this.eraser.on("pointertap", this.choiceEraser, this);
    this.addChild(this.eraser);

    for (let i = 1; i < this.colors.length; i++) {
      const pencil = Pixi.Sprite.from(`${this.path}/pencil${i}.png`);
      pencil.anchor.set(0.5);
      pencil.x = (i - 1) * this.pencilWidth;
      if (this.selectedIndex === i) {
        pencil.y = 30;
      } else {
        pencil.y = 50;
      }
      pencil.interactive = true;
      // pencil.on("pointerdown", () => (this.readyToSelect = true));
      // pencil.on("pointerup", () => {
      //   this.choicePencil(i, pencil);
      // });

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
    this.palette.on("pointerdown", (e: Pixi.FederatedPointerEvent) => {
      if (this.palette) {
        const target = e.target;

        if (
          target &&
          target instanceof Pixi.Sprite &&
          this.pencils.includes(target) &&
          target !== this.eraser
        ) {
          console.log("선택된 스프라이트:", target);
          this.readyToSelect = true;
        }
      }
    });

    this.palette.on("pointerup", (e: Pixi.FederatedPointerEvent) => {
      const target = e.target;

      if (this.palette && target instanceof Pixi.Sprite) {
        if (
          this.palette.children.includes(target as Pixi.DisplayObject) &&
          target !== this.eraser
        ) {
          const index = this.pencils.indexOf(target as Pixi.Sprite);
          this.choicePencil(index + 1, target as Pixi.Sprite);
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

  private choiceEraser() {
    if (this.selectedIndex === 0 || this.isAnimation) {
      return;
    }
    if (this.eraser) {
      let eraserTargetY = this.eraser.y;
      let pencilTargetY = this.pencils[this.selectedIndex - 1].y;
      eraserTargetY = this.paletteY - 20;
      pencilTargetY = 50;

      gsap.to(this.eraser, {
        y: eraserTargetY,
        duration: 0.2,
        onStart: () => {
          this.isAnimation = true;
        },
        onComplete: () => {
          this.isAnimation = false;
        },
      });
      gsap.to(this.pencils[this.selectedIndex - 1], {
        y: pencilTargetY,
        duration: 0.2,
        onStart: () => {
          this.isAnimation = true;
        },
        onComplete: () => {
          this.isAnimation = false;
        },
      });
      this.selectedIndex = 0;
    }
  }

  private choicePencil(i: number, sprite: Pixi.Sprite) {
    if (this.selectedIndex === i || !this.readyToSelect || this.isAnimation) {
      return;
    }

    gsap.to(sprite, {
      y: 30,
      duration: 0.2,
      onStart: () => {
        this.isAnimation = true;
      },
      onComplete: () => {
        this.isAnimation = false;
      },
    });
    if (this.selectedIndex >= 1) {
      gsap.to(this.pencils[this.selectedIndex - 1], {
        y: 50,
        duration: 0.2,
        onStart: () => {
          this.isAnimation = true;
        },
        onComplete: () => {
          this.isAnimation = false;
        },
      });
    } else {
      if (this.eraser) {
        let eraserTargetY = this.eraser.y;
        eraserTargetY = this.paletteY;
        this.isAnimation = true;
        gsap.to(this.eraser, {
          y: eraserTargetY,
          duration: 0.2,
          onStart: () => {
            this.isAnimation = true;
          },
          onComplete: () => {
            this.isAnimation = false;
          },
        });
      }
    }

    this.selectedIndex = i;

    // this.choiceEraser();
  }

  private onDragStart(e: Pixi.FederatedPointerEvent) {
    if (this.palette) {
      this.startGlobalX = e.globalX - this.x;
      this.drag.start.x = e.globalX - this.x - this.palette.x;
      this.drag.dragging = true;

      const clickedSprite = this.palette.children.find((child) => {
        const bounds = child.getBounds();
        const padding = (this.pencilWidth - bounds.width) / 2;
        bounds.x -= padding;
        bounds.y -= padding;
        bounds.width += padding * 2;
        bounds.height += padding * 2;
        return bounds.contains(e.globalX, e.globalY);
      }) as Pixi.Sprite;

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
      Pixi.Assets.unload(`${this.path}/background.png`);
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

  public getColor() {
    if (this.colors[this.selectedIndex] === Infinity) {
      return 0xFFFFFF;
    } else {
      return this.colors[this.selectedIndex];
    }
  }

  public async hide() {
    if (this.palette && this.background && this.eraser) {
      this.paletteShow = false;
      if (!this.paletteShow) {
        if (!this.isPaletteMoving) {
          this.togglePalette(false);
        }
      }
    }
  }

  public async show() {
    if (this.palette && this.background && this.eraser) {
      this.paletteShow = true;
      this.togglePalette(true);
    }
  }

  private togglePalette(enable: boolean) {
    if (this.palette && this.background && this.eraser) {
      let travelDistance;
      if (enable) {
        travelDistance = 0;
      } else {
        travelDistance = 100;
      }
      this.isPaletteMoving = true;
      gsap.to(this.palette.position, {
        y: this.paletteY + travelDistance,
        duration: 0.3,
        onComplete: () => {
          this.isPaletteMoving = false;
        },
      });
      gsap.to(this.background.position, {
        y: this.backgroundY + travelDistance,
        duration: 0.3,
      });
      gsap.to(this.eraser.position, {
        y: this.eraserY + travelDistance,
        duration: 0.3,
      });
    }
  }
}
