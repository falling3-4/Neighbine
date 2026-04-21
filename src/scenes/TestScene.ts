import * as PIXI from "pixi.js";
import { Scene } from "./Scene";
import { VideoManager } from "../internals/VideoManager";

export class TestScene extends Scene {
  public assetManifest: Record<string, string> = {
    dabigpres: "textures/test_video.mp4",
  };

  private elvisVideo!: VideoManager;
  private velocity = { x: 4, y: 4 };

  constructor(app: PIXI.Application) {
    super(app);
  }

  async load(): Promise<void> {
    this.elvisVideo = new VideoManager("dabigpres", true, 0.5);

    this.elvisVideo.sprite.anchor.set(0.5);
    this.elvisVideo.sprite.scale.set(0.25);
    this.elvisVideo.sprite.x = this.app.screen.width / 2;
    this.elvisVideo.sprite.y = this.app.screen.height / 2;

    this.viewport.addChild(this.elvisVideo.sprite);

    this.elvisVideo.audio.maxDistance = 800;
    this.elvisVideo.audio.minVolume = 0.1;
    this.elvisVideo.play();
  }

  unload(): void {
    if (this.elvisVideo) {
      this.elvisVideo.destroy();
    }
  }

  protected onRender(dt: number): void {
    if (!this.elvisVideo) return;

    this.elvisVideo.sprite.x += this.velocity.x * dt;
    this.elvisVideo.sprite.y += this.velocity.y * dt;

    const halfWidth = this.elvisVideo.sprite.width / 2;
    const halfHeight = this.elvisVideo.sprite.height / 2;

    if (
      this.elvisVideo.sprite.x - halfWidth < 0 ||
      this.elvisVideo.sprite.x + halfWidth > this.app.screen.width
    ) {
      this.velocity.x *= -1;
    }

    if (
      this.elvisVideo.sprite.y - halfHeight < 0 ||
      this.elvisVideo.sprite.y + halfHeight > this.app.screen.height
    ) {
      this.velocity.y *= -1;
    }
  }
}
