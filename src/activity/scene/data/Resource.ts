import assetManifest from "./AssetManifest";

interface ImagePath {
  [key: string]: string | string[];
}

export class ImageResourcePath {
  private sceneImagePaths: { [key: string]: ImagePath } = {};

  constructor() {
    assetManifest.forEach((scene: any) => {
      let imagePath: ImagePath = {};
      Object.keys(scene.imageCount).forEach((resourceType) => {
        let extension = this.getImageExtension(resourceType);
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
    return `images/${sceneName}/${resourceType}${extension}`;
  }

  private makeMultipleImagePath(
    resourceType: string,
    count: number,
    sceneName: string,
    extension: string
  ): string[] {
    let paths: string[] = [];
    for (let i = 1; i <= count; i++) {
      paths.push(`images/${sceneName}/${resourceType + i}${extension}`);
    }
    return paths;
  }

  public getImagePath(sceneName: string): ImagePath {
    return this.sceneImagePaths[sceneName];
  }
}

export default class AssetCounter {
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

  public getResourceCount(sceneName: string): { [key: string]: number } {
    return this.sceneCounts[sceneName];
  }
}

export function getAssets(sceneName: string): { [key: string]: any } {
  let resourcePath = new ImageResourcePath();
  let assetCounter = new AssetCounter();

  let sceneAssets: { [key: string]: any } = {};
  let imagePaths = resourcePath.getImagePath(sceneName);
  let resourceCounts = assetCounter.getResourceCount(sceneName);

  Object.keys(imagePaths).forEach((resourceType) => {
    if (resourceCounts[resourceType] === 1) {
      sceneAssets[resourceType] = {
        path: imagePaths[resourceType],
        count: resourceCounts[resourceType],
      };
    } else {
      let resourceObj: { [key: number]: { path: string, count: number } } = {};
      for (let i = 0; i < resourceCounts[resourceType]; i++) {
        resourceObj[i] = { path: imagePaths[resourceType][i], count: 1 };
      }
      sceneAssets[resourceType] = resourceObj;
    }
  });

  return sceneAssets;
}