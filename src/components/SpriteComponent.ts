import * as PIXI from "pixi.js";
import { Component } from "../internals/Component";

export class SpriteComponent extends Component {
  public sprite: PIXI.Sprite;

  constructor(textureAlias: string) {
    super();
    const texture = PIXI.Assets.get(textureAlias);
    if (!texture) {
      console.warn(`Texture alias "${textureAlias}" not found in PIXI Assets.`);
    }
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
  }

  public init(): void {
    this.gameObject.container.addChild(this.sprite);
  }

  public setTexture(textureAlias: string): void {
    const texture = PIXI.Assets.get(textureAlias);
    if (texture) {
      this.sprite.texture = texture;
    }
  }

  public onUpdate(dt: number): void {
  }

  public onDestroy(): void {
    this.sprite.destroy();
  }
}
