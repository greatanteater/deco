import * as Pixi from "pixi.js";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";

export interface Position {
  x: number;
  y: number;
}

interface FaceFeaturePositions {
  eyes: {
    left: Position;
    right: Position;
  };
  nose: Position;
  mouth: Position;
}

export interface HairCoordinate {
  coordinates: Position[];
}

export interface Face {
  displacement: Pixi.Sprite;
  sprite: Pixi.Sprite;
  graphic: SmoothGraphics;
  hairSprite: Pixi.Sprite;
  hairGraphic: SmoothGraphics;
  charNumber: number;
  hairCoordinate: Position[];
}
export interface FaceContainer {
  container: Pixi.Container;
  charNumber: number;
}

export interface Sticker {
  eye: Eye;
  nose: Nose;
  mouse: Mouse;
}

export interface Eyes {
  left: Eye;
  right: Eye;
}
export interface Eye {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

export interface Nose {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

export interface Mouse {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

export const faceFeaturePositions: FaceFeaturePositions[] = [
  {
    // 1번 캐릭터
    eyes: {
      left: { x: 536, y: 320 },
      right: { x: 760, y: 320 },
    },
    nose: { x: 0, y: 0 },
    mouth: { x: 0, y: 0 },
  },
  {
    // 2번 캐릭터
    eyes: {
      left: { x: 536, y: 320 },
      right: { x: 760, y: 320 },
    },
    nose: { x: 0, y: 0 },
    mouth: { x: 0, y: 0 },
  },
  {
    // 3번 캐릭터
    eyes: {
      left: { x: 536, y: 320 },
      right: { x: 760, y: 320 },
    },
    nose: { x: 0, y: 0 },
    mouth: { x: 0, y: 0 },
  },
  {
    // 4번 캐릭터
    eyes: {
      left: { x: 536, y: 320 },
      right: { x: 760, y: 320 },
    },
    nose: { x: 0, y: 0 },
    mouth: { x: 0, y: 0 },
  },
];

export const hairCoordinates: HairCoordinate[] = [
  {
    // 1번 캐릭터
    coordinates: [
      { x: 475.5, y: 131.5 },
      { x: 488.5, y: 131.5 },
      { x: 509.5, y: 135.5 },
      { x: 526.5, y: 137.5 },
      { x: 543.5, y: 145.5 },
      { x: 559.5, y: 151.5 },
      { x: 573.5, y: 159.5 },
      { x: 580.5, y: 167.5 },
      { x: 592.5, y: 177.5 },
      { x: 598.5, y: 188.5 },
      { x: 609.5, y: 200.5 },
      { x: 617.5, y: 211.5 },
      { x: 623.5, y: 220.5 },
      { x: 630.5, y: 232.5 },
      { x: 639.5, y: 248.5 },
      { x: 642.5, y: 264.5 },
      { x: 646.5, y: 273.5 },
      { x: 654.5, y: 284.5 },
      { x: 659.5, y: 296.5 },
      { x: 668.5, y: 306.5 },
      { x: 676.5, y: 312.5 },
      { x: 690.5, y: 324.5 },
      { x: 700.5, y: 332.5 },
      { x: 718.5, y: 335.5 },
      { x: 749.5, y: 335.5 },
      { x: 802.5, y: 341.5 },
      { x: 878.5, y: 341.5 },
      { x: 883.5, y: 341.5 },
      { x: 881.5, y: 329.5 },
      { x: 878.5, y: 317.5 },
      { x: 879.5, y: 290.5 },
      { x: 872.5, y: 277.5 },
      { x: 874.5, y: 270.5 },
      { x: 869.5, y: 261.5 },
      { x: 856.5, y: 199.5 },
      { x: 855.5, y: 190.5 },
      { x: 853.5, y: 187.5 },
      { x: 848.5, y: 173.5 },
      { x: 838.5, y: 151.5 },
      { x: 826.5, y: 139.5 },
      { x: 802.5, y: 116.5 },
      { x: 769.5, y: 94.5 },
      { x: 706.5, y: 57.5 },
      { x: 684.5, y: 51.5 },
      { x: 655.5, y: 43.5 },
      { x: 637.5, y: 39.5 },
      { x: 609.5, y: 38.5 },
      { x: 244.5, y: 43.5 },
      { x: 223.5, y: 46.5 },
      { x: 201.5, y: 53.5 },
      { x: 172.5, y: 63.5 },
      { x: 158.5, y: 74.5 },
      { x: 138.5, y: 92.5 },
      { x: 122.5, y: 113.5 },
      { x: 109.5, y: 137.5 },
      { x: 102.5, y: 166.5 },
      { x: 96.5, y: 179.5 },
      { x: 94.5, y: 188.5 },
      { x: 90.5, y: 205.5 },
      { x: 84.5, y: 214.5 },
      { x: 74.5, y: 229.5 },
      { x: 62.5, y: 251.5 },
      { x: 53.5, y: 269.5 },
      { x: 52.5, y: 276.5 },
      { x: 37.5, y: 296.5 },
      { x: 34.5, y: 301.5 },
      { x: 30.5, y: 311.5 },
      { x: 32.5, y: 324.5 },
      { x: 52.5, y: 337.5 },
      { x: 86.5, y: 345.5 },
      { x: 119.5, y: 343.5 },
      { x: 160.5, y: 341.5 },
      { x: 190.5, y: 332.5 },
      { x: 231.5, y: 315.5 },
      { x: 247.5, y: 307.5 },
      { x: 264.5, y: 292.5 },
      { x: 281.5, y: 267.5 },
      { x: 301.5, y: 240.5 },
      { x: 316.5, y: 216.5 },
      { x: 336.5, y: 199.5 },
      { x: 362.5, y: 178.5 },
      { x: 385.5, y: 163.5 },
      { x: 405.5, y: 154.5 },
      { x: 422.5, y: 145.5 },
      { x: 449.5, y: 137.5 },
    ],
  },
  {
    // 2번 캐릭터
    coordinates: [],
  },
  {
    // 3번 캐릭터
    coordinates: [],
  },
  {
    // 4번 캐릭터
    coordinates: [],
  },
];
