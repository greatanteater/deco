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
      { x: 240.5, y: 42.5 },
      { x: 431, y: 7 },
      { x: 224.5, y: 49.5 },
      { x: 415, y: 14 },
      { x: 204.5, y: 54.5 },
      { x: 395, y: 19 },
      { x: 179.5, y: 61.5 },
      { x: 370, y: 26 },
      { x: 162.5, y: 71.5 },
      { x: 353, y: 36 },
      { x: 138.5, y: 92.5 },
      { x: 329, y: 57 },
      { x: 121.5, y: 114.5 },
      { x: 312, y: 79 },
      { x: 109.5, y: 136.5 },
      { x: 300, y: 101 },
      { x: 99.5, y: 165.5 },
      { x: 290, y: 130 },
      { x: 91.5, y: 200.5 },
      { x: 282, y: 165 },
      { x: 28.5, y: 316.5 },
      { x: 219, y: 281 },
      { x: 71.5, y: 341.5 },
      { x: 262, y: 306 },
      { x: 172.5, y: 337.5 },
      { x: 363, y: 302 },
      { x: 263.5, y: 292.5 },
      { x: 454, y: 257 },
      { x: 331.5, y: 201.5 },
      { x: 522, y: 166 },
      { x: 399.5, y: 154.5 },
      { x: 590, y: 119 },
      { x: 472.5, y: 130.5 },
      { x: 663, y: 95 },
      { x: 527.5, y: 135.5 },
      { x: 718, y: 100 },
      { x: 589.5, y: 173.5 },
      { x: 780, y: 138 },
      { x: 627.5, y: 228.5 },
      { x: 818, y: 193 },
      { x: 652.5, y: 286.5 },
      { x: 843, y: 251 },
      { x: 697.5, y: 328.5 },
      { x: 888, y: 293 },
      { x: 771.5, y: 338.5 },
      { x: 962, y: 303 },
      { x: 882.5, y: 339.5 },
      { x: 1073, y: 304 },
      { x: 880.5, y: 301.5 },
      { x: 1071, y: 266 },
      { x: 867.5, y: 237.5 },
      { x: 1058, y: 202 },
      { x: 834.5, y: 149.5 },
      { x: 1025, y: 114 },
      { x: 788.5, y: 107.5 },
      { x: 979, y: 72 },
      { x: 706.5, y: 61.5 },
      { x: 897, y: 26 },
      { x: 657.5, y: 46.5 },
      { x: 848, y: 11 },
      { x: 614.5, y: 40.5 },
      { x: 805, y: 5 },
      { x: 431.5, y: 40.5 },
      { x: 622, y: 5 },
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
