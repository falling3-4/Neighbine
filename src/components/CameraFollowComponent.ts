import { Component } from "../internals/Component";

export class CameraFollowComponent extends Component {
  public lerp: number;

  constructor(lerp: number = 0.1) {
    super();
    this.lerp = lerp;
  }

  public onUpdate(dt: number): void {
    const viewport = this.gameObject.scene.viewport;
    const targetPos = this.gameObject.container.position;

    viewport.moveCenter(
      viewport.center.x + (targetPos.x - viewport.center.x) * this.lerp * dt,
      viewport.center.y + (targetPos.y - viewport.center.y) * this.lerp * dt
    );
  }
}
