import * as PIXI from "pixi.js";
import { SoundManager } from "../internals/Sound";
import { Viewport } from "pixi-viewport";
import { AssetManager } from "../internals/AssetManager";

export abstract class Scene {
  app: PIXI.Application;
  viewport: Viewport;
  soundManager: SoundManager;
  graphics: PIXI.Graphics[] = [];
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

    this.app.stage.addChild(this.viewport);
    this.soundManager = new SoundManager(app, this.viewport);

    const fpsText = new PIXI.Text("FPS: 0", {
      fontSize: 26,
      fill: 0xffffff,
    });
    fpsText.x = 10;
    fpsText.y = 10;
    fpsText.zIndex = 1000;
    fpsText.visible = debug;
    this.app.stage.addChild(fpsText);

    this.renderCallback = (delta) => {
      this.onRender(delta.deltaTime ?? delta);
      fpsText.text = `FPS: ${Math.round(this.app.ticker.FPS)}`;
      fpsText.visible = debug;
    };
    this.app.ticker.add(this.renderCallback);
  }

  addGraphic(graphic: PIXI.Graphics) {
    this.graphics.push(graphic);
    this.viewport.addChild(graphic);
  }

  async _internalLoad(): Promise<void> {
    await AssetManager.sync(this.assetManifest);
    await this.load();
  }

  protected onRender(_dt: number) {}

  protected async load(): Promise<void> {}

  destroy() {
    this.app.ticker.remove(this.renderCallback);
    this.soundManager.destroy();
    this.viewport.destroy({ children: true });

    this.graphics.length = 0;

    AssetManager.unloadAll();
  }
}
