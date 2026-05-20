import * as PIXI from "pixi.js";
import { ISound, SoundPositional, VideoSound2D } from "./Sound";

export class VideoManager {
  public sprite: PIXI.Sprite;
  public videoElement: HTMLVideoElement;
  public audio: ISound;
  private videoSound: VideoSound2D;

  constructor(
    textureAlias: string,
    loop: boolean = true,
    volume: number = 1.0,
    positional: boolean = true,
    maxDistance: number = 500,
    position?: { x: number; y: number },
  ) {
    this.sprite = PIXI.Sprite.from(textureAlias);
    this.sprite.anchor.set(0.5);

    this.videoElement = (
      this.sprite.texture.source as PIXI.VideoSource
    ).resource;

    this.videoElement.loop = loop;
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;
    this.videoElement.autoplay = false;
    this.videoElement.crossOrigin = "anonymous";

    this.videoSound = new VideoSound2D(this.videoElement, volume);

    if (positional) {
      this.audio = new SoundPositional(
        this.videoSound,
        position || this.sprite.position,
        volume,
        maxDistance,
      );
    } else {
      this.audio = this.videoSound;
    }

    const unlock = () => {
      this.videoSound.unlock();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.stop();
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time: number) {
    this.audio.seek(time);
  }

  setVolume(volume: number) {
    this.audio.setVolume(volume);
  }

  currentTime(): number {
    return this.audio.currentTime();
  }

  duration(): number {
    return this.audio.duration();
  }

  isPlaying(): boolean {
    return this.audio.isPlaying();
  }

  destroy() {
    this.audio.destroy();
    this.sprite.destroy();
  }
}
