import * as Pixi from "pixi.js";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";

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
  mouth: Mouth;
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

export interface Mouth {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}