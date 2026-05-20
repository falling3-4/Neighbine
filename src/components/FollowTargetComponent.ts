import { Component } from "../internals/Component";
import { GameObject } from "../internals/GameObject";

export class FollowTargetComponent extends Component {
  public target: GameObject;
  public lerp: number;
  public offset: { x: number; y: number };

  constructor(target: GameObject, lerp: number = 0.1, offset: { x: number; y: number } = { x: 0, y: 0 }) {
    super();
    this.target = target;
    this.lerp = lerp;
    this.offset = offset;
  }

  public onUpdate(dt: number): void {
    if (!this.target || this.target.isDestroyed) return;

    const targetPos = this.target.container.position;
    const currentPos = this.gameObject.container.position;

    this.gameObject.container.x += (targetPos.x + this.offset.x - currentPos.x) * this.lerp * dt;
    this.gameObject.container.y += (targetPos.y + this.offset.y - currentPos.y) * this.lerp * dt;
  }
}
