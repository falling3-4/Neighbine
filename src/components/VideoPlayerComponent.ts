import { Component } from "../internals/Component";
import { VideoManager } from "../internals/VideoManager";

export class VideoPlayerComponent extends Component {
  public video: VideoManager;

  constructor(
    alias: string,
    loop: boolean = true,
    volume: number = 0.5,
    positional: boolean = true,
    maxDistance: number = 500,
  ) {
    super();
    this.video = new VideoManager(alias, loop, volume, positional, maxDistance);
  }

  public init(): void {
    this.gameObject.container.addChild(this.video.sprite);
    this.video.play();
  }

  public onUpdate(_dt: number): void {}

  public onDestroy(): void {
    this.video.destroy();
  }
}
