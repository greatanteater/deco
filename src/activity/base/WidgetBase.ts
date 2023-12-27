/*
  Base 클래스를 상속받아 리소스 처리
  PixiApp에서 사용되는 컨트롤의 부모가 되는 클래스
  initializeWidget과 uninitializeWidget은 생성시, 소멸시 한번만 호출되어야 함
*/

import Setting from '@/activity/base/Setting';
import PixiApp from '@/activity/PixiApp';
import { Base, ResourceItem } from '@/activity/base/Base';

export default class WidgetBase extends Base {
  protected pixiApp: PixiApp = null;
  protected initialized = false;
  protected enabled = false; // 위젯 활성 상태

  constructor(pixiApp: PixiApp, resourceItems: ResourceItem[]) {
    super(resourceItems);
    this.pixiApp = pixiApp;
    this.visible = false;
    this.zIndex = Setting.widgetZindex;
  }

  public async initializeWidget() {
    await this.load();
    this.initialized = true;
  }

  public async uninitializeWidget() {
    if (this.initialized) {
      this.quitWidget();
      await this.unload();
      this.initialized = false;
    }
  }

  // 자식 클래스에서 재정의 => 제거 전에 수행되어야 할 작업 수행
  protected quitWidget() {}

  public async show() {
    if (!this.initialized) {
      await this.initializeWidget();
    }
    this.visible = true;
  }

  public hide() {
    this.visible = false;
  }

  public isVisible() {
    return this.visible;
  }

  public enable(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled() {
    return this.enabled;
  }

  // 특정 이벤트 발생시, PixiApp에 알리는 함수
  protected async fireWidgetEvent(eventName: string, parameter?: any) {
    await this.pixiApp.handleWidgetEvent(eventName, parameter);
  }
}
