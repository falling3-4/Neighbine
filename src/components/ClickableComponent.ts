import * as PIXI from "pixi.js";
import { Component } from "../internals/Component";

export class ClickableComponent extends Component {
  private onClickCallback: () => void;

  constructor(onClick: () => void) {
    super();
    this.onClickCallback = onClick;
  }

  public init(): void {
    const container = this.gameObject.container;
    container.eventMode = "static";
    container.cursor = "pointer";
    container.on("pointertap", this.onClick);
  }

  private onClick = (): void => {
    this.onClickCallback();
  };

  public onUpdate(dt: number): void {
  }

  public onDestroy(): void {
    this.gameObject.container.off("pointertap", this.onClick);
  }
}
