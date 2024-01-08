import assetManifest from "./AssetManifest";
import soundManifest from "./SoundManifest";

interface AssetPath {
  [key: string]: string | string[];
}

export class ImageResourcePath {
  private sceneImagePaths: { [key: string]: AssetPath } = {};

  constructor() {
    assetManifest.forEach((scene: any) => {
      const imagePath: AssetPath = {};
      Object.keys(scene.imageCount).forEach((resourceType) => {
        const extension = this.getImageExtension(resourceType);
        if (scene.imageCount[resourceType] === 1) {
          imagePath[resourceType] = this.makeSingleImagePath(
            resourceType,
            scene.scene,
            extension
          );
        } else {
          imagePath[resourceType] = this.makeMultipleImagePath(
            resourceType,
            scene.imageCount[resourceType],
            scene.scene,
            extension
          );
        }
      });
      this.sceneImagePaths[scene.scene] = imagePath;
    });
  }

  private getImageExtension(resourceType: string): string {
    switch (resourceType) {
      case "background":
      case "map":
        return ".jpg";
      default:
        return ".png";
    }
  }

  private makeSingleImagePath(
    resourceType: string,
    sceneName: string,
    extension: string
  ): string {
    return `image/${sceneName}/${resourceType}${extension}`;
  }

  private makeMultipleImagePath(
    resourceType: string,
    count: number,
    sceneName: string,
    extension: string
  ): string[] {
    const paths: string[] = [];
    for (let i = 1; i <= count; i++) {
      paths.push(`image/${sceneName}/${resourceType + i}${extension}`);
    }
    return paths;
  }

  public getImagePath(sceneName: string): AssetPath {
    return this.sceneImagePaths[sceneName];
  }
}

export class SoundResourcePath {
  private sceneSoundPaths: { [key: string]: AssetPath } = {};

  constructor() {
    soundManifest.forEach((scene: any) => {
      const soundPath: AssetPath = {};
      Object.keys(scene.soundCount).forEach((resourceType) => {
        const extension = this.getSoundExtension(resourceType);
        if (scene.soundCount[resourceType] === 1) {
          soundPath[resourceType] = this.makeSingleSoundPath(
            resourceType,
            scene.scene,
            extension
          );
        } else {
          soundPath[resourceType] = this.makeMultipleSoundPath(
            resourceType,
            scene.soundCount[resourceType],
            scene.scene,
            extension
          );
        }
      });
      this.sceneSoundPaths[scene.scene] = soundPath;
    });
  }

  private getSoundExtension(resourceType: string): string {
    switch (resourceType) {
      default:
        return ".mp3";
    }
  }

  private makeSingleSoundPath(
    resourceType: string,
    sceneName: string,
    extension: string
  ): string {
    return `sound/${sceneName}/${resourceType}${extension}`;
  }

  private makeMultipleSoundPath(
    resourceType: string,
    count: number,
    sceneName: string,
    extension: string
  ): string[] {
    const paths: string[] = [];
    for (let i = 1; i <= count; i++) {
      paths.push(`sound/${sceneName}/${resourceType + i}${extension}`);
    }
    return paths;
  }

  public getSoundPath(sceneName: string): AssetPath {
    return this.sceneSoundPaths[sceneName];
  }
}

export class ImageCounter {
  private sceneCounts: { [key: string]: { [key: string]: number } } = {};

  constructor() {
    assetManifest.forEach((scene: any) => {
      let count: { [key: string]: number } = {};
      Object.keys(scene.imageCount).forEach((resourceType) => {
        count[resourceType] = scene.imageCount[resourceType];
      });
      this.sceneCounts[scene.scene] = count;
    });
  }

  public getImageCount(sceneName: string): { [key: string]: number } {
    return this.sceneCounts[sceneName];
  }
}

export class SoundCounter {
  private sceneCounts: { [key: string]: { [key: string]: number } } = {};

  constructor() {
    soundManifest.forEach((scene: any) => {
      let count: { [key: string]: number } = {};
      Object.keys(scene.soundCount).forEach((resourceType) => {
        count[resourceType] = scene.soundCount[resourceType];
      });
      this.sceneCounts[scene.scene] = count;
    });
  }

  public getSoundCount(sceneName: string): { [key: string]: number } {
    return this.sceneCounts[sceneName];
  }
}

export function getAssets(sceneName: string): { [key: string]: any } {
  const imageResourcePath = new ImageResourcePath();
  const soundResourcePath = new SoundResourcePath();
  const imageCounter = new ImageCounter();
  const soundCounter = new SoundCounter();

  const sceneImageAssets: { [key: string]: any } = {};
  const sceneSoundAssets: { [key: string]: any } = {};
  const imagePaths = imageResourcePath.getImagePath(sceneName);
  const soundPaths = soundResourcePath.getSoundPath(sceneName);
  const imageResourceCounts = imageCounter.getImageCount(sceneName);
  const soundResourceCounts = soundCounter.getSoundCount(sceneName);

  Object.keys(imagePaths).forEach((resourceType) => {
    if (imageResourceCounts[resourceType] === 1) {
      sceneImageAssets[resourceType] = {
        path: imagePaths[resourceType],
        count: imageResourceCounts[resourceType],
      };
    } else {
      const resourceObj: { [key: number]: { path: string, count: number } } = {};
      for (let i = 0; i < imageResourceCounts[resourceType]; i++) {
        resourceObj[i] = { path: imagePaths[resourceType][i], count: 1 };
      }
      sceneImageAssets[resourceType] = resourceObj;
    }
  });

  Object.keys(soundPaths).forEach((resourceType) => {
    if (soundResourceCounts[resourceType] === 1) {
      sceneSoundAssets[resourceType] = {
        path: soundPaths[resourceType],
        count: soundResourceCounts[resourceType],
      };
    } else {
      const resourceObj: { [key: number]: { path: string, count: number } } = {};
      for (let i = 0; i < soundResourceCounts[resourceType]; i++) {
        resourceObj[i] = { path: soundPaths[resourceType][i], count: 1 };
      }
      sceneSoundAssets[resourceType] = resourceObj;
    }
  });

  return { "image": sceneImageAssets, "sound": sceneSoundAssets };
}
