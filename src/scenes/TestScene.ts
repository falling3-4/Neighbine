import * as PIXI from "pixi.js";
import { Scene } from "./Scene";
import { GameObject } from "../internals/GameObject";
import { VideoPlayerComponent } from "../components/VideoPlayerComponent";
import { BouncingComponent } from "../components/BouncingComponent";

export class TestScene extends Scene {
  public assetManifest: Record<string, string> = {
    dabigpres: "textures/test_video.mp4",
  };

  constructor(app: PIXI.Application) {
    super(app);
  }

  protected async init(): Promise<void> {
    const elvis = new GameObject(this);
    
    const video = elvis.addComponent(
      new VideoPlayerComponent("dabigpres", true, 0.5, false),
    );
    video.video.sprite.anchor.set(0.5);
    video.video.sprite.scale.set(0.5);
    
    elvis.container.x = this.app.screen.width / 2;
    elvis.container.y = this.app.screen.height / 2;
    
    elvis.addComponent(new BouncingComponent(12, 8));
    
    this.addGameObject(elvis);
  }
}
