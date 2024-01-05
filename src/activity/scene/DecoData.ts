import * as Pixi from "pixi.js";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";

export interface Position {
  x: number;
  y: number;
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

export const hairCoordinates: HairCoordinate[] = [{
  coordinates: [
    { x: 538, y: 169 },
      { x: 546, y: 163 },
      { x: 552, y: 157 },
      { x: 560, y: 152 },
      { x: 568, y: 149 },
      { x: 573, y: 586 },
      { x: 586, y: 595 },
      { x: 607, y: 129 },
      { x: 620, y: 124 },
      { x: 635, y: 120 },
      { x: 646, y: 118 },
      { x: 664, y: 115 },
      { x: 674, y: 115 },
      { x: 688, y: 117 },
      { x: 702, y: 119 },
      { x: 712, y: 123 },
      { x: 724, y: 128 },
      { x: 736, y: 133 },
      { x: 754, y: 145 },
      { x: 761, y: 155 },
      { x: 774, y: 168 },
      { x: 782, y: 177 },
      { x: 790, y: 191 },
      { x: 794, y: 198 },
      { x: 798, y: 204 },
      { x: 808, y: 213 },
      { x: 823, y: 222 },
      { x: 834, y: 229 },
      { x: 845, y: 233 },
      { x: 868, y: 233 },
      { x: 894, y: 236 },
      { x: 913, y: 237 },
      { x: 929, y: 238 },
      { x: 947, y: 238 },
      { x: 962, y: 238 },
      { x: 971, y: 238 },
      { x: 974, y: 237 },
      { x: 970, y: 226 },
      { x: 971, y: 210 },
      { x: 968, y: 202 },
      { x: 962, y: 185 },
      { x: 959, y: 170 },
      { x: 948, y: 145 },
      { x: 932, y: 123 },
      { x: 910, y: 108 },
      { x: 891, y: 97 },
      { x: 869, y: 87 },
      { x: 856, y: 81 },
      { x: 836, y: 72 },
      { x: 814, y: 68 },
      { x: 793, y: 65 },
      { x: 764, y: 61 },
      { x: 720, y: 58 },
      { x: 688, y: 59 },
      { x: 658, y: 56 },
      { x: 632, y: 54 },
      { x: 589, y: 55 },
      { x: 566, y: 57 },
      { x: 514, y: 63 },
      { x: 492, y: 65 },
      { x: 458, y: 71 },
      { x: 434, y: 79 },
      { x: 423, y: 83 },
      { x: 414, y: 89 },
      { x: 402, y: 95 },
      { x: 396, y: 105 },
      { x: 387, y: 115 },
      { x: 382, y: 120 },
      { x: 379, y: 133 },
      { x: 376, y: 141 },
      { x: 372, y: 150 },
      { x: 364, y: 160 },
      { x: 358, y: 198 },
      { x: 350, y: 184 },
      { x: 338, y: 198 },
      { x: 327, y: 214 },
      { x: 324, y: 223 },
      { x: 324, y: 229 },
      { x: 338, y: 233 },
      { x: 359, y: 237 },
      { x: 384, y: 240 },
      { x: 418, y: 238 },
      { x: 441, y: 233 },
      { x: 472, y: 220 },
      { x: 491, y: 210 },
      { x: 511, y: 193 },
      { x: 524, y: 179 },
      { x: 538, y: 169 },
  ]
}];