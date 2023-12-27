// RectangleContainer.ts
import * as Pixi from "pixi.js";
import Setting from "../base/Setting";

export default class DeceMain extends Pixi.Container {
  private backSprite: Pixi.Sprite | null = null;
  private char1Sprite: Pixi.Sprite | null = null;
  private char2Sprite: Pixi.Sprite | null = null;

  constructor() {
    super();
    this.runScene();
  }

  private runScene() {
    this.setMainBack();
    this.setChars();
  }

  private setMainBack() {
    this.backSprite = Pixi.Sprite.from('images/background_main.jpg');
    this.backSprite.width = Setting.sceneWidth;
    this.backSprite.height = Setting.sceneHeight;
    this.addChild(this.backSprite);
  }

  private setChars() {
    this.char1Sprite = Pixi.Sprite.from('images/char1.png');
    this.char1Sprite.width = 300;
    this.char1Sprite.height = 400;
    this.char1Sprite.anchor.set(0.5);
    this.char1Sprite.position.set(300, 400);
    this.addChild(this.char1Sprite);

    this.char2Sprite = Pixi.Sprite.from('images/char2.png');
    this.char2Sprite.width = 300;
    this.char2Sprite.height = 400;
    this.char2Sprite.anchor.set(0.5);
    this.char2Sprite.position.set(900, 400);
    this.addChild(this.char2Sprite);
  }

  private destroyBack() {
    if (this.backSprite) {
      this.backSprite.destroy();
      this.backSprite = null;
    }
  }

  public destroy() {
    this.destroyBack();
    super.destroy();
  }
}
