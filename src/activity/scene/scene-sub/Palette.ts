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
  private palette: Pixi.Graphics | null = null;

  constructor(scene: DecoScene) {
    super();
    // this.imageAssets = getAssets(this.sceneName).image;
    this.scene = scene;
    this.initialize();
  }

  private async initialize() {
    this.palette = new Pixi.Graphics();
    this.palette.beginFill(0xffffff);
    this.palette.drawRect(0, 0, 300, 100);
    this.palette.endFill();
    this.palette.x = 650;
    this.palette.y = 700;
    this.addChild(this.palette);
  }
}
