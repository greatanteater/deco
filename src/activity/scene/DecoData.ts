import * as Pixi from "pixi.js";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";

export interface Position {
  x: number;
  y: number;
}

export interface Face {
  displacement: Pixi.Sprite;
  sprite: Pixi.Sprite;
  graphic: SmoothGraphics;
  charNumber: number;
}
export interface FaceContainer {
  container: Pixi.Container;
  charNumber: number;
}

export interface Sticker {
  eye: eye;
  nose: nose;
  mouse: mouse;
}

export interface eye {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

export interface nose {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}

export interface mouse {
  sprite: Pixi.Sprite;
  path: string;
  position: Position;
}