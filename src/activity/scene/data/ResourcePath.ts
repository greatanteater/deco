import assetManifest from "./AssetManifest";

interface ImagePath {
  [key: string]: string | string[];
}

export class ResourcePath {
    private sceneImagePaths: { [key: string]: ImagePath; } = {};

    constructor() {
      assetManifest.forEach((scene: any) => {
        let imagePath: ImagePath = {};
        Object.keys(scene.imageCount).forEach((resourceType) => {
          let extension = this.getImageExtension(resourceType);
          if (scene.imageCount[resourceType] === 1) {
            imagePath[resourceType] = this.makeSingleImagePath(resourceType, scene.scene, extension);
          } else {
            imagePath[resourceType] = this.makeMultipleImagePath(resourceType, scene.imageCount[resourceType], scene.scene, extension);
          }
        });
        this.sceneImagePaths[scene.scene] = imagePath;
      });
    }

    private getImageExtension(resourceType: string): string {
      switch(resourceType) {
        case 'background':
          return '.jpg';
        default:
          return '.png';
      }
    }

    private makeSingleImagePath(resourceType: string, sceneName: string, extension: string): string {
      return `images/${sceneName}/${resourceType}${extension}`;
    }

    private makeMultipleImagePath(resourceType: string, count: number, sceneName: string, extension: string): string[] {
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