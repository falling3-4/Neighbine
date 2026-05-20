import { Component } from "../internals/Component";

export class HUDComponent extends Component {
  public offsetX: number;
  public offsetY: number;

  constructor(offsetX: number = 0, offsetY: number = 0) {
    super();
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  public init(): void {
    this.gameObject.container.x = this.offsetX;
    this.gameObject.container.y = this.offsetY;
  }

  public onUpdate(dt: number): void {}
}
