import { Component } from "../internals/Component";

export class BouncingComponent extends Component {
  private velocity: { x: number; y: number };

  constructor(vx: number, vy: number) {
    super();
    this.velocity = { x: vx, y: vy };
  }

  public onUpdate(dt: number): void {
    const container = this.gameObject.container;
    const app = this.gameObject.scene.app;

    container.x += this.velocity.x * dt;
    container.y += this.velocity.y * dt;

    const bounds = container.getLocalBounds();
    const halfWidth = (bounds.width * container.scale.x) / 2;
    const halfHeight = (bounds.height * container.scale.y) / 2;

    if (container.x - halfWidth < 0 || container.x + halfWidth > app.screen.width) {
      this.velocity.x *= -1;
    }

    if (container.y - halfHeight < 0 || container.y + halfHeight > app.screen.height) {
      this.velocity.y *= -1;
    }
  }
}
