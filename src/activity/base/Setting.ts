/*
  프로젝트에서 static하게 사용되는 변수들 정의
*/

export default {
  withHost: false, // 빌드시 체크

  usePixiSound: true,
  log: true,
  removeAppearMotion: true, // 모든 등장 효과 제거 요구(능률)
  displayFps: false,
  useVideoTag: false,

  sceneWidth: 1300,
  sceneHeight: 780,

  sceneZindex: 1,
  widgetZindex: 10,
  topMostZindex: 100,
  baseZindex: 5,
  affordanceZindex: 50,

  fontJua: 'jua',
};
