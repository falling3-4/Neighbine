import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Howl, Howler } from "howler";

export interface ISound {
  play(): void;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  seek(time: number): void;
  currentTime(): number;
  duration(): number;
  isPlaying(): boolean;
  destroy(): void;
}

export interface ISound2D extends ISound {
  setPan(pan: number): void;
}

export class Sound2D implements ISound2D {
  private howl: Howl;

  constructor(
    srcOrHowl: string | string[] | Howl,
    loop: boolean = false,
    volume: number = 1.0,
    pan: number = 0,
  ) {
    if (srcOrHowl instanceof Howl) {
      this.howl = srcOrHowl;
    } else {
      this.howl = new Howl({
        src: Array.isArray(srcOrHowl) ? srcOrHowl : [srcOrHowl],
        loop,
        volume,
      });
    }
    this.howl.stereo(pan);
  }

  play() {
    if (!this.howl.playing()) this.howl.play();
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
  seek(time: number) {
    this.howl.seek(time);
  }
  currentTime(): number {
    return this.howl.seek() as number;
  }
  duration(): number {
    return this.howl.duration();
  }
  isPlaying(): boolean {
    return this.howl.playing();
  }
  setPan(pan: number) {
    this.howl.stereo(pan);
  }
  destroy() {
    this.howl.unload();
  }
}

export class VideoSound2D implements ISound2D {
  private videoElement: HTMLVideoElement;
  private sourceNode: MediaElementAudioSourceNode;
  private gainNode: GainNode;
  private pannerNode: StereoPannerNode;
  private isUnlocked: boolean = false;

  constructor(
    videoElement: HTMLVideoElement,
    volume: number = 1.0,
    pan: number = 0,
  ) {
    this.videoElement = videoElement;

    if (!Howler.ctx) {
      new Howl({
        src: [
          "data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A",
        ],
      });
    }

    const ctx = Howler.ctx as AudioContext;

    if (!(this.videoElement as any)._mediaSource) {
      (this.videoElement as any)._mediaSource = ctx.createMediaElementSource(
        this.videoElement,
      );
    }

    this.sourceNode = (this.videoElement as any)._mediaSource;

    this.gainNode = ctx.createGain();
    this.pannerNode = ctx.createStereoPanner();

    this.gainNode.gain.value = volume;
    this.pannerNode.pan.value = pan;

    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.pannerNode);
    this.pannerNode.connect(ctx.destination);
  }

  play() {
    if (!this.isUnlocked) {
      this.videoElement.muted = true;
    }
    this.videoElement.play();
  }

  unlock() {
    this.isUnlocked = true;
    const ctx = Howler.ctx as AudioContext;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    this.videoElement.muted = false;
    this.videoElement.play();
  }

  pause() {
    this.videoElement.pause();
  }

  stop() {
    this.videoElement.pause();
    this.videoElement.currentTime = 0;
  }

  setVolume(volume: number) {
    this.gainNode.gain.value = volume;
  }

  seek(time: number) {
    this.videoElement.currentTime = time;
  }

  currentTime(): number {
    return this.videoElement.currentTime;
  }

  duration(): number {
    return this.videoElement.duration;
  }

  isPlaying(): boolean {
    return !this.videoElement.paused;
  }

  setPan(pan: number) {
    this.pannerNode.pan.value = pan;
  }

  destroy() {
    this.sourceNode.disconnect();
    this.gainNode.disconnect();
    this.pannerNode.disconnect();
  }
}
export class SoundPositional implements ISound {
  private sound: ISound2D;
  public position: { x: number; y: number };
  public maxDistance: number = 500;
  public minVolume: number = 0;
  public baseVolume: number;

  constructor(
    soundOrSrc: ISound2D | string | string[] | Howl,
    position: { x: number; y: number },
    volume: number = 1.0,
    maxDistance: number = 500,
  ) {
    this.position = position;
    this.baseVolume = Math.max(0, volume);
    this.maxDistance = maxDistance;

    if (
      typeof soundOrSrc === "string" ||
      Array.isArray(soundOrSrc) ||
      soundOrSrc instanceof Howl
    ) {
      this.sound = new Sound2D(soundOrSrc, false, volume);
    } else {
      this.sound = soundOrSrc;
    }

    const manager = (window as any).SoundManager?.instance;
    if (manager) manager.add(this);
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  setBaseVolume(volume: number) {
    this.baseVolume = Math.max(0, volume);
  }

  updateInternal(centerX: number, centerY: number, halfWorldWidth: number) {
    const dx = this.position.x - centerX;
    const dy = this.position.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const distanceRatio = Math.max(0, Math.min(distance / this.maxDistance, 1));
    const falloff = 1 - Math.pow(distanceRatio, 2);
    const newVolume = this.baseVolume * falloff;

    this.sound.setVolume(Math.max(newVolume, this.minVolume));

    let pan = dx / halfWorldWidth;
    pan = Math.max(-1, Math.min(1, pan));

    this.sound.setPan(pan);
  }

  play() {
    this.sound.play();
  }
  pause() {
    this.sound.pause();
  }
  stop() {
    this.sound.stop();
  }
  setVolume(volume: number) {
    this.setBaseVolume(volume);
  }
  seek(time: number) {
    this.sound.seek(time);
  }
  currentTime(): number {
    return this.sound.currentTime();
  }
  duration(): number {
    return this.sound.duration();
  }
  isPlaying(): boolean {
    return this.sound.isPlaying();
  }

  destroy() {
    const manager = (window as any).SoundManager?.instance;
    if (manager) manager.remove(this);
    this.sound.destroy();
  }
}

export class SoundManager {
  private static _instance: SoundManager;
  private sounds: Set<SoundPositional> = new Set();
  private app: Application;
  private viewport: Viewport;

  constructor(app: Application, viewport: Viewport) {
    this.app = app;
    this.viewport = viewport;
    this.app.ticker.add(this.update, this);
    SoundManager._instance = this;
    (window as any).SoundManager = SoundManager;
  }

  static get instance(): SoundManager {
    if (!SoundManager._instance)
      console.warn("SoundManager is not initialized!");
    return SoundManager._instance;
  }

  add(sound: SoundPositional) {
    this.sounds.add(sound);
  }
  remove(sound: SoundPositional) {
    this.sounds.delete(sound);
  }

  private update() {
    const centerX = this.viewport.center.x;
    const centerY = this.viewport.center.y;
    const halfWorldWidth = this.viewport.worldScreenWidth / 2;

    this.sounds.forEach((sound) => {
      sound.updateInternal(centerX, centerY, halfWorldWidth);
    });
  }

  destroy() {
    this.app.ticker.remove(this.update, this);
    this.sounds.forEach((s) => s.destroy());
    this.sounds.clear();
  }
}
