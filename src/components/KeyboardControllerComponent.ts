import { Component } from "../internals/Component";

export class KeyboardControllerComponent extends Component {
  private keys: Record<string, boolean> = {};
  public speed: number;

  constructor(speed: number = 5) {
    super();
    this.speed = speed;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  public init(): void {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  public onUpdate(dt: number): void {
    const container = this.gameObject.container;

    if (this.keys["ArrowUp"] || this.keys["w"]) {
      container.y -= this.speed * dt;
    }
    if (this.keys["ArrowDown"] || this.keys["s"]) {
      container.y += this.speed * dt;
    }
    if (this.keys["ArrowLeft"] || this.keys["a"]) {
      container.x -= this.speed * dt;
    }
    if (this.keys["ArrowRight"] || this.keys["d"]) {
      container.x += this.speed * dt;
    }
  }

  public onDestroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
