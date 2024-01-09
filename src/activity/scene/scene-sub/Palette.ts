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

export default class Palette extends Pixi.Container {
  private sceneName = "palette";
  // private imageAssets: { [key: string]: any };
  private scene: DecoScene;
  private palette: Pixi.Container | null = null;
  private colors: number[]; // 색상을 16진수로 저장합니다.
  private colorRects: Pixi.Graphics[]; // 각 색상을 대표하는 Graphics 객체를 저장합니다.
  private colorRectGroups: {
    leftGroup: Pixi.Graphics[];
    middleGroup: Pixi.Graphics[];
    rightGroup: Pixi.Graphics[];
  };
  private selectedColor: number;
  private drag = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    dragging: false,
  };

  constructor(scene: DecoScene) {
    super();
    // this.imageAssets = getAssets(this.sceneName).image;
    this.scene = scene;
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
    this.scene = scene;
    this.initialize();
  }

  private async initialize() {
    this.palette = new Pixi.Container();
    const totalWidth = this.colors.length * 50;
    this.palette.pivot.x = totalWidth / 2;
    this.palette.pivot.y = 50;

    this.palette.x = 650;
    this.palette.y = 750; // pivot 값을 고려해 위치를 설정합니다.
    this.addChild(this.palette);

    this.palette.interactive = true;
    this.palette.on("pointerdown", (e: Pixi.FederatedPointerEvent) =>
      this.onDragStart(e)
    );
    this.palette.on("pointerup", () => this.onDragEnd());
    this.palette.on("pointerupoutside", () => this.onDragEnd());
    this.palette.on("pointermove", (e: Pixi.FederatedPointerEvent) =>
      this.onDragMove(e)
    );

    const mask = new Pixi.Graphics();
    const maskWidth = 300;
    mask.beginFill(0xffffff);
    mask.drawRect(650 - maskWidth / 2, this.palette.y - this.palette.pivot.y, maskWidth, 100);
    mask.endFill();
    this.addChild(mask);

    this.palette.mask = mask;

    for (let i = 0; i < this.colors.length; i++) {
      const colorRect = new Pixi.Graphics();
      colorRect.beginFill(this.colors[i]);
      colorRect.drawRect(0, 0, 50, 50);
      colorRect.endFill();
      colorRect.x = i * 50;
      colorRect.interactive = true;
      colorRect.on("pointerdown", () => {
        this.selectedColor = this.colors[i];
      });

      const integerPart = Math.floor(this.colors.length / 3);
      if (i < integerPart) {
        this.colorRectGroups.leftGroup.push(colorRect);
      } else if (i < integerPart * 2) {
        this.colorRectGroups.middleGroup.push(colorRect);
      } else {
        this.colorRectGroups.rightGroup.push(colorRect);
      }

      this.palette.addChild(colorRect);
    }
  }

  private onDragStart(e: Pixi.FederatedPointerEvent) {
    if (this.palette) {
      this.drag.start.x = e.globalX - this.x - this.palette.x;
      this.drag.dragging = true;

      const clickedColorRect = this.palette.children.find((child) =>
        child.getBounds().contains(e.globalX, e.globalY)
      ) as Pixi.Graphics;

      if (this.colorRectGroups.leftGroup.includes(clickedColorRect)) {
        const leftGroupFirstX = this.colorRectGroups.leftGroup[0].x;
        this.colorRectGroups.rightGroup
          .slice()
          .reverse()
          .forEach((colorRect, index) => {
            colorRect.x = leftGroupFirstX - 50 * (index + 1);
          });

        const leftGroupLastX =
          this.colorRectGroups.leftGroup[
            this.colorRectGroups.leftGroup.length - 1
          ].x;
        this.colorRectGroups.middleGroup.slice().forEach((colorRect, index) => {
          colorRect.x = leftGroupLastX + 50 * (index + 1);
        });
      }
      if (this.colorRectGroups.rightGroup.includes(clickedColorRect)) {
        const rightGroupFirstX = this.colorRectGroups.rightGroup[0].x;
        this.colorRectGroups.middleGroup
          .slice()
          .reverse()
          .forEach((colorRect, index) => {
            colorRect.x = rightGroupFirstX - 50 * (index + 1);
          });

        const rightGroupLastX =
          this.colorRectGroups.rightGroup[
            this.colorRectGroups.rightGroup.length - 1
          ].x;
        this.colorRectGroups.leftGroup.slice().forEach((colorRect, index) => {
          colorRect.x = rightGroupLastX + 50 * (index + 1);
        });
      }
      if (this.colorRectGroups.middleGroup.includes(clickedColorRect)) {
        const middleGroupFirstX = this.colorRectGroups.middleGroup[0].x;
        const middleGroupLastX =
          this.colorRectGroups.middleGroup[
            this.colorRectGroups.middleGroup.length - 1
          ].x;

        this.colorRectGroups.leftGroup
          .slice()
          .reverse()
          .forEach((colorRect, index) => {
            colorRect.x = middleGroupFirstX - 50 * (index + 1);
          });

        this.colorRectGroups.rightGroup.slice().forEach((colorRect, index) => {
          colorRect.x = middleGroupLastX + 50 * (index + 1);
        });
      }
    }
  }

  private onDragEnd() {
    this.drag.dragging = false;
  }

  private onDragMove(e: Pixi.FederatedPointerEvent) {
    if (this.palette) {
      if (this.drag.dragging) {
        this.palette.x = e.globalX - this.x - this.drag.start.x;
      }
    }
  }
}
