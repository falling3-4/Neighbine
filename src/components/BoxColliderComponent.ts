import * as PIXI from "pixi.js";
import { Component } from "../internals/Component";

export class BoxColliderComponent extends Component {
  public width: number;
  public height: number;
  public offset: { x: number; y: number };
  public isTrigger: boolean;

  constructor(width: number, height: number, offset: { x: number; y: number } = { x: 0, y: 0 }, isTrigger: boolean = true) {
    super();
    this.width = width;
    this.height = height;
    this.offset = offset;
    this.isTrigger = isTrigger;
  }

  public get bounds(): PIXI.Rectangle {
    const pos = this.gameObject.container.position;
    return new PIXI.Rectangle(
      pos.x + this.offset.x - (this.width * this.gameObject.container.scale.x) / 2,
      pos.y + this.offset.y - (this.height * this.gameObject.container.scale.y) / 2,
      this.width * this.gameObject.container.scale.x,
      this.height * this.gameObject.container.scale.y
    );
  }

  public intersects(other: BoxColliderComponent): boolean {
    const r1 = this.bounds;
    const r2 = other.bounds;

    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  public onUpdate(dt: number): void {
  }
}
