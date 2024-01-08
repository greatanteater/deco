import * as Pixi from 'pixi.js';
import * as PixiSpine from 'pixi-spine';
import * as PixiSound from '@pixi/sound';
import Setting from './Setting';

export enum ResourceType {
  none,
  image,
  audio,
  video,
  spine,
}