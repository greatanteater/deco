import * as Pixi from "pixi.js";
import Setting from "../base/Setting";
import { wait } from "../util/Util";
import { get } from "svelte/store";
import { currentView, characterNumber } from "../store/store";
import { gsap } from "gsap";
import * as Data from "./DecoSceneData";
import DecoScene from "./DecoScene";
import { SmoothGraphics, LINE_SCALE_MODE } from "@pixi/graphics-smooth";
import PixiApp from "../PixiApp";

export default class DecoDrawing extends Pixi.Container {
  private maskSprite: Pixi.Sprite | null = null;
  private graphicDraw: SmoothGraphics | null = null;
  private down = false;
  private erase = false;
  private prevX = 0;
  private prevY = 0;

  constructor(scene: DecoScene) {
    super();
    this.setupDrawing();
  }

  private async setupDrawing() {
    this.eventMode = "static";
    this.on("pointerdown", this.onPointerDown, this);
    this.on("pointermove", this.onPointerMove, this);
    this.on("pointerup", this.onPointerUp, this);
    this.on("pointerupoutside", this.onPointerUp, this);

    const maskLoad = await Pixi.Assets.load("images/drawing/mini.png");
    this.maskSprite = Pixi.Sprite.from(maskLoad);
    this.maskSprite.anchor.set(0.5);
    this.maskSprite.position.set(Setting.sceneWidth / 2, Setting.sceneHeight / 2);
    // this.interactive = true;
    // this.hitArea = new Pixi.Rectangle(
    //   0,
    //   0,
    //   this.maskSprite.width,
    //   this.maskSprite.width
    // );
    this.graphicDraw = new SmoothGraphics();
    this.graphicDraw.mask = this.maskSprite;
    this.graphicDraw.beginFill(0xffffff, 1);

    const center = {
        x: Setting.sceneWidth / 2,
        y: Setting.sceneHeight / 2
    }

    const maskHalf = {
        width: this.maskSprite.width / 2,
        height: this.maskSprite.height / 2
    }

    this.graphicDraw.drawRect(
      center.x - maskHalf.width,
      center.y - maskHalf.height,
      center.x + maskHalf.width,
      center.y + maskHalf.height
    );
    this.graphicDraw.endFill();
    this.addChild(this.maskSprite, this.graphicDraw);
  }

  protected onPointerDown(e: Pixi.FederatedEvent) {
    this.down = true;
    this.prevX = e.pageX - this.x;
    this.prevY = e.pageY - this.y;
  }

  protected onPointerMove(e: Pixi.FederatedEvent) {
    if (this.down) {
      if (this.graphicDraw) {
        this.graphicDraw.lineStyle({
          width: 10,
          color: 0x000000,
          cap: Pixi.LINE_CAP.ROUND,
          join: Pixi.LINE_JOIN.ROUND,
          scaleMode: LINE_SCALE_MODE.NONE,
        });
        this.graphicDraw.moveTo(this.prevX, this.prevY);
        this.graphicDraw.lineTo(e.pageX - this.x, e.pageY - this.y);
        this.prevX = e.pageX - this.x;
        this.prevY = e.pageY - this.y;
      }
    }
  }

  protected onPointerUp(e: Pixi.FederatedEvent) {
    this.down = false;
    this.erase = !this.erase;
  }
}
