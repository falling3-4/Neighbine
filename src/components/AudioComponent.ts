import { Component } from "../internals/Component";
import { AssetManager } from "../internals/AssetManager";
import { Sound2D, SoundPositional, ISound } from "../internals/Sound";

export class AudioComponent extends Component {
  private sound: ISound | null = null;
  private alias: string;
  private loop: boolean;
  private volume: number;
  private positional: boolean;
  private autoplay: boolean;
  private maxDistance: number;

  constructor(
    alias: string,
    loop: boolean = false,
    volume: number = 0.5,
    positional: boolean = true,
    autoplay: boolean = true,
    maxDistance: number = 500,
  ) {
    super();
    this.alias = alias;
    this.loop = loop;
    this.volume = volume;
    this.positional = positional;
    this.autoplay = autoplay;
    this.maxDistance = maxDistance;
  }

  public init(): void {
    const howl = AssetManager.getSound(this.alias);
    if (!howl) {
      console.warn(`AudioComponent: Sound alias "${this.alias}" not found.`);
      return;
    }

    howl.loop(this.loop);
    howl.volume(this.volume);

    if (this.positional) {
      this.sound = new SoundPositional(
        howl,
        this.gameObject.container.position,
        this.volume,
        this.maxDistance,
      );
    } else {
      this.sound = new Sound2D(howl, this.loop, this.volume);
    }

    if (this.autoplay) {
      this.play();
    }
  }

  public play(): void {
    this.sound?.play();
  }

  public pause(): void {
    this.sound?.pause();
  }

  public stop(): void {
    this.sound?.stop();
  }

  public togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(time: number): void {
    this.sound?.seek(time);
  }

  public setVolume(volume: number): void {
    this.sound?.setVolume(volume);
  }

  public currentTime(): number {
    return this.sound?.currentTime() || 0;
  }

  public duration(): number {
    return this.sound?.duration() || 0;
  }

  public isPlaying(): boolean {
    return this.sound?.isPlaying() || false;
  }

  public onUpdate(_dt: number): void {}

  public onDestroy(): void {
    this.sound?.destroy();
  }
}
