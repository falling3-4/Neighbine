import { Component } from "../internals/Component";

export class RotationComponent extends Component {
  public rotationSpeed: number;

  constructor(rotationSpeed: number = 0.01) {
    super();
    this.rotationSpeed = rotationSpeed;
  }

  public onUpdate(dt: number): void {
    this.gameObject.container.rotation += this.rotationSpeed * dt;
  }
}
