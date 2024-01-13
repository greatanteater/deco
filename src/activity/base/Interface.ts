import * as Pixi from "pixi.js";
import { Spine } from "pixi-spine";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";

export interface LoadableAsset {
  path: string;
  count: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface FaceFeaturePositions {
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
  [key: string]: Eye[] | Nose[] | Mouth[];
  eye: Eye[];
  nose: Nose[];
  mouth: Mouth[];
}

export interface DrawingEyes {
  left: DrawingEye;
  right: DrawingEye;
}
export interface DrawingEye {
  sprite: Pixi.Sprite;
  wrapperSprite: Pixi.Sprite;
  position: Position;
}

export interface Eye {
  sprite: Pixi.Sprite;
}

export interface Nose {
  sprite: Pixi.Sprite;
}

export interface Mouth {
  sprite: Pixi.Sprite;
}