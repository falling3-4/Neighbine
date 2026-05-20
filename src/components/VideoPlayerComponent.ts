import { Component } from "../internals/Component";
import { VideoManager } from "../internals/VideoManager";

export class VideoPlayerComponent extends Component {
  public video!: VideoManager;
  private alias: string;
  private loop: boolean;
  private volume: number;
  private positional: boolean;
  private maxDistance: number;

  constructor(
    alias: string,
    loop: boolean = true,
    volume: number = 0.5,
    positional: boolean = true,
    maxDistance: number = 500,
  ) {
    super();
    this.alias = alias;
    this.loop = loop;
    this.volume = volume;
    this.positional = positional;
    this.maxDistance = maxDistance;
  }

  public init(): void {
    this.video = new VideoManager(
      this.alias,
      this.loop,
      this.volume,
      this.positional,
      this.maxDistance,
      this.gameObject.container.position,
    );

    this.gameObject.container.addChild(this.video.sprite);
    this.video.play();
  }

  public play(): void {
    this.video?.play();
  }

  public pause(): void {
    this.video?.pause();
  }

  public stop(): void {
    this.video?.stop();
  }

  public togglePlay(): void {
    this.video?.togglePlay();
  }

  public seek(time: number): void {
    this.video?.seek(time);
  }

  public setVolume(volume: number): void {
    this.video?.setVolume(volume);
  }

  public currentTime(): number {
    return this.video?.currentTime() || 0;
  }

  public duration(): number {
    return this.video?.duration() || 0;
  }

  public isPlaying(): boolean {
    return this.video?.isPlaying() || false;
  }

  public onUpdate(_dt: number): void {}

  public onDestroy(): void {
    this.video?.destroy();
  }
}
