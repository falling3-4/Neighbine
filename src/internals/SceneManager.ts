import { Scene } from "../scenes/Scene";
import * as PIXI from "pixi.js";

export class SceneManager {
  private app: PIXI.Application;
  private currentScene: Scene | null = null;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  async changeScene(nextScene: Scene) {
    if (this.currentScene) {
      this.app.stage.removeChildren();
      this.currentScene.destroy();
      this.currentScene = null;
    }

    if (typeof (nextScene as any)._internalLoad == "function") {
      await (nextScene as any)._internalLoad();
    }

    this.currentScene = nextScene;
  }

  get activeScene(): Scene | null {
    return this.currentScene;
  }
}
