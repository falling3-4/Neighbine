import { Howl } from "howler";

export class Sound {
  private howl: Howl;

  constructor(
    src: string | string[],
    loop: boolean = false,
    volume: number = 1.0,
  ) {
    this.howl = new Howl({
      src: Array.isArray(src) ? src : [src],
      loop,
      volume,
    });
  }

  play() {
    this.howl.play();
  }

  pause() {
    this.howl.pause();
  }

  stop() {
    this.howl.stop();
  }

  setVolume(volume: number) {
    this.howl.volume(volume);
  }

  destroy() {
    this.howl.unload();
  }
}
