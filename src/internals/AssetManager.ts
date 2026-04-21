import * as PIXI from "pixi.js";
import { Howl } from "howler";

export class AssetManager {
  private static loadedAssets: Set<string> = new Set();
  private static soundCache: Map<string, Howl> = new Map();
  private static readonly audioExtensions = [".mp3", ".ogg", ".wav"];

  static async sync(requiredAssets: Record<string, string>): Promise<void> {
    const requiredAliases = Object.keys(requiredAssets);

    for (const alias of this.loadedAssets) {
      if (!requiredAliases.includes(alias)) {
        await this.unload(alias);
      }
    }

    const pixiTasks: { alias: string; src: string }[] = [];
    const soundPromises: Promise<void>[] = [];

    for (const [alias, src] of Object.entries(requiredAssets)) {
      if (!this.loadedAssets.has(alias)) {
        if (this.isAudio(src)) {
          soundPromises.push(this.preloadSound(alias, src));
        } else if (src.endsWith(".mp4")) {
          PIXI.Assets.add({
            alias,
            src,
            loadParser: "loadVideo",
          });
          pixiTasks.push({ alias, src });
        } else {
          PIXI.Assets.add({ alias, src });
          pixiTasks.push({ alias, src });
        }
      }
    }

    const pixiAliases = pixiTasks.map((t) => t.alias);

    const pixiPromise =
      pixiAliases.length > 0
        ? PIXI.Assets.load(pixiAliases)
        : Promise.resolve();

    await Promise.all([pixiPromise, ...soundPromises]);

    pixiAliases.forEach((a) => this.loadedAssets.add(a));
  }

  private static isAudio(src: string): boolean {
    return this.audioExtensions.some((ext) => src.toLowerCase().endsWith(ext));
  }

  private static preloadSound(alias: string, src: string): Promise<void> {
    return new Promise((resolve) => {
      const sound = new Howl({
        src: [src],
        onload: () => {
          this.soundCache.set(alias, sound);
          this.loadedAssets.add(alias);
          resolve();
        },
        onloaderror: () => {
          resolve();
        },
      });
    });
  }

  static async unload(alias: string): Promise<void> {
    if (!this.loadedAssets.has(alias)) return;

    if (this.soundCache.has(alias)) {
      const sound = this.soundCache.get(alias);
      sound?.unload();
      this.soundCache.delete(alias);
    } else {
      await PIXI.Assets.unload(alias);
    }

    this.loadedAssets.delete(alias);
  }

  static async unloadAll(): Promise<void> {
    const aliases = Array.from(this.loadedAssets);
    await Promise.all(aliases.map((alias) => this.unload(alias)));
    this.loadedAssets.clear();
    this.soundCache.clear();
  }
}
