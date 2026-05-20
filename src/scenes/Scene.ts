import * as PIXI from "pixi.js";
import { SoundManager } from "../internals/Sound";
import { Viewport } from "pixi-viewport";
import { AssetManager } from "../internals/AssetManager";
import { GameObject } from "../internals/GameObject";

export abstract class Scene {
  public app: PIXI.Application;
  public viewport: Viewport;
  public uiContainer: PIXI.Container;
  public soundManager: SoundManager;
  private gameObjects: GameObject[] = [];
  private renderCallback: (delta: any) => void;

  public abstract readonly assetManifest: Record<string, string>;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.viewport = new Viewport({
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      worldWidth: app.screen.width,
      worldHeight: app.screen.height,
      events: app.renderer.events,
    });

    this.uiContainer = new PIXI.Container();

    this.app.stage.addChild(this.viewport);
    this.app.stage.addChild(this.uiContainer);
    this.soundManager = new SoundManager(app, this.viewport);

    const fpsText = new PIXI.Text("FPS: 0", {
      fontSize: 26,
      fill: 0xffffff,
    });
    fpsText.x = 10;
    fpsText.y = 10;
    fpsText.zIndex = 1000;
    fpsText.visible = (window as any).debug;
    this.app.stage.addChild(fpsText);

    this.renderCallback = (delta) => {
      const dt = delta.deltaTime ?? delta;
      this.update(dt);
      fpsText.text = `FPS: ${Math.round(this.app.ticker.FPS)}`;
      fpsText.visible = (window as any).debug;
    };
    this.app.ticker.add(this.renderCallback);
  }

  public addGameObject<T extends GameObject>(gameObject: T): T {
    this.gameObjects.push(gameObject);
    return gameObject;
  }

  public removeGameObject(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);
    if (index !== -1) {
      this.gameObjects.splice(index, 1);
    }
  }

  public async _internalLoad(): Promise<void> {
    await AssetManager.sync(this.assetManifest);
    await this.init();
  }

  private update(dt: number): void {
    for (let i = this.gameObjects.length - 1; i >= 0; i--) {
      const go = this.gameObjects[i];
      if (!go.isDestroyed) {
        go.onUpdate(dt);
      }
    }
    this.onUpdate(dt);
  }

  protected async init(): Promise<void> {}

  protected onUpdate(_dt: number): void {}

  public destroy(): void {
    this.app.ticker.remove(this.renderCallback);
    
    for (const go of [...this.gameObjects]) {
      go.destroy();
    }
    
    this.soundManager.destroy();
    this.viewport.destroy({ children: true });
    this.uiContainer.destroy({ children: true });
    AssetManager.unloadAll();
  }
}
