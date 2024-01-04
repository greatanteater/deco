import * as Pixi from "pixi.js";

export interface Position {
  x: number;
  y: number;
}

export interface Face {
  sprite: Pixi.Sprite;
  charNumber: number;
}

export interface Displacement {
  sprite: Pixi.Sprite;
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