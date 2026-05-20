import { Scene } from "../scenes/Scene";
import * as PIXI from "pixi.js";

export class SceneManager {
  private app: PIXI.Application;
  private currentScene: Scene | null = null;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  public async changeScene(nextScene: Scene): Promise<void> {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.app.stage.removeChildren();
    }

    await nextScene._internalLoad();
    this.currentScene = nextScene;
  }

  public get activeScene(): Scene | null {
    return this.currentScene;
  }
}
