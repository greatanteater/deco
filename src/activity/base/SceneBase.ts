/*
  Base 클래스를 상속받아 리소스 처리
  모든 씬의 부모가 되는 클래스
  initializeScene과 uninitializeScene은 생성시, 소멸시 한번만 호출되어야 함
*/

import * as Pixi from 'pixi.js';
import * as PixiSpine from 'pixi-spine';
import Setting from '@/activity/base/Setting';
import { activityStore } from '@/store/ActivityModule';
import PixiApp from '@/activity/PixiApp';
import { Base, ResourceItem, ResourceType } from '@/activity/base/Base';
import AudioWrapper from '@/activity/util/AudioWrapper';

export default class SceneBase extends Base {
  protected pixiApp: PixiApp = null;
  protected enabled = true;

  // 클릭 및 정답 스파인 효과 추가
  private clickEffectAudioPath = '';
  private clickEffectSpinePath = '';
  private clickEffectAudio: AudioWrapper = null;
  private clickEffectSpine: PixiSpine.Spine = null;
  private clickEffectSpineIndex = 0;
  private clickEffectSpineAnimationNames = ['01', '02'];

  private correctEffectAudioPath = '';
  private correctEffectSpinePath = '';
  private correctEffectAudio: AudioWrapper = null;
  private correctEffectSpine: PixiSpine.Spine = null;
  private correctEffectSpineIndex = 0;
  private correctEffectSpineAnimationNames = ['01', '02'];

  constructor(pixiApp: PixiApp, resourceItems: ResourceItem[]) {
    super(resourceItems);
    this.pixiApp = pixiApp;
    this.sortableChildren = true;
    this.zIndex = Setting.sceneZindex;

    this.addEffectResource();
  }

  public async initializeScene() {
    await this.load();

    this.setEffect();
  }

  public async uninitializeScene() {
    this.freeEffect();

    this.quitScene();
    await this.unload();
  }

  // 자식 클래스에서 재정의
  public runScene() {}

  // 자식 클래스에서 재정의
  public pauseScene() {}

  // 자식 클래스에서 재정의
  public resumeScene() {}

  // 자식 클래스에서 재정의
  protected quitScene() {}

  // 자식 클래스에서 재정의
  public enable(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  protected async fireSceneEvent(eventName: string, parameter?: any) {
    await this.pixiApp.handleSceneEvent(eventName, parameter);
  }

  private addEffectResource() {
    // const config = activityStore();
    // this.clickEffectAudioPath = `${config.globalCommonPath}/Effects_Click.mp3`;
    // this.clickEffectSpinePath = `${config.globalCommonPath}/Effects_Click.json`;
    // this.addResourceItem(ResourceType.audio, this.clickEffectAudioPath);
    // this.addResourceItem(ResourceType.spine, this.clickEffectSpinePath);

    // this.correctEffectAudioPath = `${config.globalCommonPath}/Effects_Correct.mp3`;
    // this.correctEffectSpinePath = `${config.globalCommonPath}/Effects_Correct.json`;
    // this.addResourceItem(ResourceType.audio, this.correctEffectAudioPath);
    // this.addResourceItem(ResourceType.spine, this.correctEffectSpinePath);

    this.clickEffectAudioPath = './resources/common/Effects_Click.mp3';
    this.clickEffectSpinePath = './resources/common/Effects_Click.json';
    this.addResourceItem(ResourceType.audio, this.clickEffectAudioPath);
    this.addResourceItem(ResourceType.spine, this.clickEffectSpinePath);
  }

  private setEffect() {
    this.eventMode = 'static';
    this.on('pointerdown', this.showClickSpine, this);
    this.clickEffectAudio = new AudioWrapper(this.getAudio(this.clickEffectAudioPath));
    this.clickEffectSpine = this.getSpine(this.clickEffectSpinePath);
    this.clickEffectSpine.zIndex = Setting.topMostZindex;
    this.clickEffectSpine.eventMode = 'none';
    this.addChild(this.clickEffectSpine);

    // this.correctEffectAudio = new AudioWrapper(this.getAudio(this.correctEffectAudioPath));
    // this.correctEffectSpine = this.getSpine(this.correctEffectSpinePath);
    // this.correctEffectSpine.zIndex = Setting.topMostZindex;
    // this.addChild(this.clickEffectSpine, this.correctEffectSpine);
  }

  private freeEffect() {
    this.off('pointerdown', this.showClickSpine, this);
    this.clickEffectAudio.clear();
    this.removeChild(this.clickEffectSpine);
    // this.correctEffectAudio.clear();
    // this.removeChild(this.clickEffectSpine, this.correctEffectSpine);
  }

  private showClickSpine(e: Pixi.FederatedEvent) {
    this.clickEffectSpine.position.set(e.pageX, e.pageY);
    this.clickEffectSpine.state.setAnimation(0, this.clickEffectSpineAnimationNames[this.clickEffectSpineIndex], false);
    this.clickEffectSpineIndex += 1;
    if (this.clickEffectSpineIndex == this.clickEffectSpineAnimationNames.length) {
      this.clickEffectSpineIndex = 0;
    }
    this.clickEffectAudio.play();
    // e.stopPropagation();
  }

  public hideClickSpine() {
    this.clickEffectSpine.visible = false;
  }

  public async showCorrectEffect(x: number, y: number) {
    this.correctEffectSpine.position.set(x, y);
    this.correctEffectSpine.state.setAnimation(0, this.correctEffectSpineAnimationNames[this.correctEffectSpineIndex], false);
    this.correctEffectSpineIndex += 1;
    if (this.correctEffectSpineIndex == this.correctEffectSpineAnimationNames.length) {
      this.correctEffectSpineIndex = 0;
    }
    await this.correctEffectAudio.blockPlay();
  }
}
