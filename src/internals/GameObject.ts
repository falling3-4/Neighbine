import * as PIXI from "pixi.js";
import { Scene } from "../scenes/Scene";
import { Component } from "./Component";

export class GameObject {
  public scene: Scene;
  public container: PIXI.Container;
  public isDestroyed: boolean = false;
  private components: Component[] = [];

  constructor(scene: Scene, isUI: boolean = false) {
    this.scene = scene;
    this.container = new PIXI.Container();
    if (isUI) {
      this.scene.uiContainer.addChild(this.container);
    } else {
      this.scene.viewport.addChild(this.container);
    }
  }

  public addComponent<T extends Component>(component: T): T {
    component.gameObject = this;
    this.components.push(component);
    component.init();
    return component;
  }

  public getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
    return this.components.find((c) => c instanceof type) as T | undefined;
  }

  public onUpdate(dt: number): void {
    for (const component of this.components) {
      component.onUpdate(dt);
    }
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    
    for (const component of this.components) {
      component.onDestroy();
    }
    
    this.container.destroy({ children: true });
    this.scene.removeGameObject(this);
  }
}
