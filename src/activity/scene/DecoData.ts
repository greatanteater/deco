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

export interface Coordinate {
  coordinates: Position[];
}

export interface Face {
  displacement: Pixi.Sprite;
  sprite: Pixi.Sprite;
  graphic: SmoothGraphics;
  hairSprite: Pixi.Sprite;
  hairGraphic: SmoothGraphics;
  charNumber: number;
  faceCoordinate: Position[];
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

export const hairCoordinates: Coordinate[] = [
  {
    // 1번 캐릭터
    coordinates: [
      { x: 203.5, y: 43.5 },
      { x: 168.5, y: 55.5 },
      { x: 151.5, y: 71.5 },
      { x: 129.5, y: 92.5 },
      { x: 112.5, y: 111.5 },
      { x: 103.5, y: 127.5 },
      { x: 96.5, y: 147.5 },
      { x: 92.5, y: 166.5 },
      { x: 81.5, y: 196.5 },
      { x: 69.5, y: 216.5 },
      { x: 53.5, y: 251.5 },
      { x: 45.5, y: 266.5 },
      { x: 40.5, y: 274.5 },
      { x: 33.5, y: 286.5 },
      { x: 27.5, y: 294.5 },
      { x: 27.5, y: 298.5 },
      { x: 20.5, y: 310.5 },
      { x: 20.5, y: 322.5 },
      { x: 49.5, y: 335.5 },
      { x: 93.5, y: 340.5 },
      { x: 143.5, y: 338.5 },
      { x: 204.5, y: 321.5 },
      { x: 256.5, y: 291.5 },
      { x: 280.5, y: 261.5 },
      { x: 304.5, y: 233.5 },
      { x: 326.5, y: 208.5 },
      { x: 365.5, y: 173.5 },
      { x: 405.5, y: 150.5 },
      { x: 456.5, y: 130.5 },
      { x: 501.5, y: 127.5 },
      { x: 541.5, y: 136.5 },
      { x: 581.5, y: 163.5 },
      { x: 622.5, y: 210.5 },
      { x: 642.5, y: 245.5 },
      { x: 669.5, y: 300.5 },
      { x: 700.5, y: 324.5 },
      { x: 720.5, y: 333.5 },
      { x: 775.5, y: 336.5 },
      { x: 837.5, y: 340.5 },
      { x: 892.5, y: 340.5 },
      { x: 894.5, y: 338.5 },
      { x: 891.5, y: 322.5 },
      { x: 888.5, y: 288.5 },
      { x: 880.5, y: 259.5 },
      { x: 872.5, y: 216.5 },
      { x: 864.5, y: 185.5 },
      { x: 846.5, y: 148.5 },
      { x: 780.5, y: 90.5 },
      { x: 723.5, y: 53.5 },
      { x: 663.5, y: 36.5 },
      { x: 611.5, y: 28.5 },
      { x: 523.5, y: 21.5 },
      { x: 457.5, y: 16.5 },
      { x: 376.5, y: 16.5 },
      { x: 324.5, y: 20.5 },
      { x: 276.5, y: 27.5 },
      { x: 247.5, y: 31.5 },
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

export const faceCoordinates: Coordinate[] = [
  {
    // 1번 캐릭터
    coordinates: [
      { x: 319, y: 28 },
      { x: 283, y: 33 },
      { x: 244, y: 43 },
      { x: 221, y: 48 },
      { x: 180, y: 68 },
      { x: 143, y: 90 },
      { x: 115, y: 116 },
      { x: 96, y: 137 },
      { x: 71, y: 169 },
      { x: 58, y: 197 },
      { x: 36, y: 258 },
      { x: 29, y: 294 },
      { x: 29, y: 337 },
      { x: 32, y: 367 },
      { x: 47, y: 418 },
      { x: 74, y: 474 },
      { x: 125, y: 535 },
      { x: 187, y: 578 },
      { x: 277, y: 605 },
      { x: 371, y: 604 },
      { x: 469, y: 569 },
      { x: 532, y: 518 },
      { x: 579, y: 445 },
      { x: 606, y: 374 },
      { x: 613, y: 306 },
      { x: 607, y: 270 },
      { x: 568, y: 171 },
      { x: 524, y: 116 },
      { x: 476, y: 77 },
      { x: 435, y: 56 },
      { x: 380, y: 37 },
      { x: 354, y: 31 },
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

export const charGlobalCoordinates: Coordinate[] = [
  {
    // 1번 캐릭터
    coordinates: [
      { x: 363.3333435058594, y: 349.66668701171875 },
      { x: 370.66668701171875, y: 319.66668701171875 },
      { x: 410.66668701171875, y: 267.66668701171875 },
      { x: 484.66668701171875, y: 198.33334350585938 },
      { x: 576.6666870117188, y: 135 },
      { x: 722, y: 109.66667175292969 },
      { x: 832, y: 165 },
      { x: 898, y: 233.66668701171875 },
      { x: 920, y: 278.3333435058594 },
      { x: 926.6666870117188, y: 329.66668701171875 },
      { x: 936.6666870117188, y: 350.3333435058594 },
      { x: 916.6666870117188, y: 407.66668701171875 },
      { x: 899.3333740234375, y: 457 },
      { x: 868, y: 497 },
      { x: 830.6666870117188, y: 535.6666870117188 },
      { x: 749.3333740234375, y: 563.6666870117188 },
      { x: 620, y: 577 },
      { x: 534, y: 573 },
      { x: 463.3333435058594, y: 496.3333740234375 },
      { x: 411.3333435058594, y: 397.66668701171875 },
      { x: 380.66668701171875, y: 366.3333435058594 },
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
