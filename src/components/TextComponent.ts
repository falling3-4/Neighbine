import * as PIXI from "pixi.js";
import { Component } from "../internals/Component";

export class TextComponent extends Component {
  public text: PIXI.Text;

  constructor(content: string, style?: Partial<PIXI.TextStyle>) {
    super();
    this.text = new PIXI.Text(content, style);
    this.text.anchor.set(0.5);
  }

  public init(): void {
    this.gameObject.container.addChild(this.text);
  }

  public setText(content: string): void {
    this.text.text = content;
  }

  public onUpdate(dt: number): void {
  }

  public onDestroy(): void {
    this.text.destroy();
  }
}
