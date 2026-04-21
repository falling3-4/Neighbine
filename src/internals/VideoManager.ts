import * as PIXI from "pixi.js";
import { SoundPositional, VideoSound2D } from "./Sound";

export class VideoManager {
  public sprite: PIXI.Sprite;
  public videoElement: HTMLVideoElement;
  public audio: SoundPositional;
  private videoSound: VideoSound2D;

  constructor(
    textureAlias: string,
    loop: boolean = true,
    volume: number = 1.0,
  ) {
    this.sprite = PIXI.Sprite.from(textureAlias);

    this.videoElement = (
      this.sprite.texture.source as PIXI.VideoSource
    ).resource;

    this.videoElement.loop = loop;
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;
    this.videoElement.autoplay = false;
    this.videoElement.crossOrigin = "anonymous";

    this.videoSound = new VideoSound2D(this.videoElement, volume);

    this.audio = new SoundPositional(
      this.videoSound,
      this.sprite.position,
      volume,
    );

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

  destroy() {
    this.audio.destroy();
    this.sprite.destroy();
  }
}
