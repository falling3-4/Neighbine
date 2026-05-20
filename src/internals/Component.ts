import { GameObject } from "./GameObject";

export abstract class Component {
  public gameObject!: GameObject;

  public init(): void {}
  public abstract onUpdate(dt: number): void;
  public onDestroy(): void {}
}
