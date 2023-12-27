/*
  픽시에서 사용되는 리소스 로딩 / 해제를 담당하는 픽시 컨테이너를 상속받는 클래스
  모든 씬 / 위젯 객체의 부모 클래스
  메인 앱에서 사용되는 컨트롤들의 부모 클래스
  Base 객체의 삽입(add)과 삭제(removeChild)는 부모 컨테이너의 몫
  load와 unload는 생성시, 소멸시 한번만 호출되어야 함
*/

import * as Pixi from 'pixi.js';
import * as PixiSpine from 'pixi-spine';
import * as PixiSound from '@pixi/sound';
import Setting from '@/activity/base/Setting';

export enum ResourceType {
  none,
  image,
  audio,
  video,
  spine,
}

// 리소스 이름(name, path)은 중복되지 않도록 사용해야 함 (이름 중복으로 인한 오류는 책임지지 못함)
export class ResourceItem {
  public type: ResourceType = ResourceType.none;
  public name = '';
  public path = '';
  public texture: Pixi.Texture = null;
  public sprite: Pixi.Sprite = null;
  public spine: PixiSpine.Spine = null;
  public pixiSound: PixiSound.Sound = null;
  public audioElement: HTMLAudioElement = null;
  public video: HTMLVideoElement = null;
  public loaded = false;

  constructor(type: ResourceType, name: string, path: string) {
    this.type = type;
    this.name = name;
    this.path = path;
  }

  private setNull() {
    this.texture = null;
    this.sprite = null;
    this.spine = null;
    this.pixiSound = null;
    this.audioElement = null;
    this.video = null;
  }

  public async destroy() {
    if (this.loaded) {
      if (this.type == ResourceType.image) {
        this.sprite.destroy();
        await Pixi.Assets.unload(this.path);
      } else if (this.type == ResourceType.audio) {
        if (this.pixiSound) {
          this.pixiSound.pause();
          this.pixiSound.destroy();
        }
        if (this.audioElement) {
          this.audioElement.pause();
        }
      } else if (this.type == ResourceType.video) {
        this.video.pause();
        this.sprite.destroy();
        this.texture.destroy(true);
      } else if (this.type == ResourceType.spine) {
        await Pixi.Assets.unload(this.path);
      }
    }
    this.setNull();
  }
}

export class Base extends Pixi.Container {
  protected resourceItems: ResourceItem[] = [];

  constructor(resourceItems: ResourceItem[]) {
    super();
    this.resourceItems = resourceItems;
  }

  private backgroundLoadImageAndSpine() {
    for (const item of this.resourceItems) {
      if (item.type == ResourceType.image || item.type == ResourceType.spine) {
        Pixi.Assets.backgroundLoad(item.path);
      }
    }
  }

  private async loadImageAndSpine() {
    for (const item of this.resourceItems) {
      if (item.type == ResourceType.image) {
        await this.loadImage(item);
      } else if (item.type == ResourceType.spine) {
        await this.loadSpine(item);
      }
    }
  }

  private async loadAudioAndVideo() {
    for (const item of this.resourceItems) {
      if (item.type == ResourceType.audio) {
        await this.loadAudio(item);
      } else if (item.type == ResourceType.video) {
        await this.loadVideo(item);
      }
    }
  }

  protected async load() {
    this.backgroundLoadImageAndSpine();
    await this.loadAudioAndVideo();
    await this.loadImageAndSpine();
  }

  protected async unload() {
    for (const item of this.resourceItems) {
      await item.destroy();
    }
    this.removeChildren();
    Pixi.utils.clearTextureCache();
  }

  private async loadImage(item: ResourceItem) {
    const asset = await Pixi.Assets.load(item.path);
    if (asset) {
      item.texture = asset;
      item.sprite = new Pixi.Sprite(item.texture);
      item.loaded = true;
    } else {
      console.log('image loading error');
      console.log(item.name + ', ' + item.path);
    }
  }

  private async loadSpine(item: ResourceItem) {
    const asset = await Pixi.Assets.load(item.path);
    if (asset) {
      item.spine = new PixiSpine.Spine(asset.spineData);
      item.loaded = true;
    } else {
      console.log('spine loading error: ' + item.name + ', ' + item.path);
    }
  }

  private async loadAudio(item: ResourceItem) {
    Setting.usePixiSound ? await this.loadPixiSound(item) : await this.loadAudioElement(item);
  }

  private loadPixiSound(item: ResourceItem) {
    return new Promise<void>((resolve) => {
      PixiSound.Sound.from({
        url: item.path,
        preload: true,
        singleInstance: true,
        autoPlay: false,
        loaded: (err: any, sound: PixiSound.Sound) => {
          if (sound) {
            item.pixiSound = sound;
            item.loaded = true;
          } else {
            console.log('PixiSound loading error: ' + item.path);
            console.log(err);
          }
          resolve();
        },
      });
    });
  }

  private loadAudioElement(item: ResourceItem) {
    return new Promise<void>((resolve) => {
      item.audioElement = document.createElement('audio');
      item.audioElement.autoplay = false;
      item.audioElement.crossOrigin = '';
      item.audioElement.src = item.path;
      item.audioElement.load();
      item.audioElement.oncanplay = async () => {
        item.audioElement.oncanplay = null;
        item.loaded = true;
        resolve();
      };
      item.audioElement.onerror = () => {
        console.log('audio.onerror: ' + item.path);
        resolve();
      };
    });
  }

  private loadVideo(item: ResourceItem) {
    return new Promise<void>((resolve) => {
      item.video = document.createElement('video');
      item.video.autoplay = false;
      item.video.crossOrigin = '';
      item.video.playsInline = false;
      item.video.src = item.path;
      item.video.load();
      item.video.oncanplay = async () => {
        item.video.oncanplay = null;
        item.video.currentTime = 0;
        item.video.pause();
        item.sprite = new Pixi.Sprite();
        item.sprite.texture = Pixi.Texture.from(item.video);
        (item.sprite.texture.baseTexture.resource as Pixi.VideoResource).updateFPS = 30;
        item.loaded = true;
        resolve();
      };
      item.video.onerror = () => {
        console.log('video.onerror: ' + item.path);
        resolve();
      };
    });
  }

  public addResourceItem(type: ResourceType, path: string) {
    if (this.resourceItems.findIndex((item) => item.path == path) == -1) {
      this.resourceItems.push(new ResourceItem(type, path, path));
    }
  }

  private findResourceItem(name: string): ResourceItem {
    return this.resourceItems.find((item) => item.name == name);
  }

  public getSprite(name: string): Pixi.Sprite {
    return this.findResourceItem(name)?.sprite;
  }

  public getTexture(name: string): Pixi.Texture {
    return this.findResourceItem(name)?.texture;
  }

  public getSpine(name: string): PixiSpine.Spine {
    return this.findResourceItem(name)?.spine;
  }

  public getAudio(name: string): HTMLAudioElement | PixiSound.Sound {
    return Setting.usePixiSound ? this.findResourceItem(name)?.pixiSound : this.findResourceItem(name)?.audioElement;
  }

  public getPixiSound(name: string): PixiSound.Sound {
    return this.findResourceItem(name)?.pixiSound;
  }

  public getAudioElement(name: string): HTMLAudioElement {
    return this.findResourceItem(name)?.audioElement;
  }

  public getVideo(name: string): HTMLVideoElement {
    return this.findResourceItem(name)?.video;
  }
}
