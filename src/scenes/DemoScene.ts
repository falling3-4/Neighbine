import * as PIXI from "pixi.js";
import { Scene } from "./Scene";
import { GameObject } from "../internals/GameObject";
import { SpriteComponent } from "../components/SpriteComponent";
import { KeyboardControllerComponent } from "../components/KeyboardControllerComponent";
import { RotationComponent } from "../components/RotationComponent";
import { TextComponent } from "../components/TextComponent";
import { ClickableComponent } from "../components/ClickableComponent";
import { FollowTargetComponent } from "../components/FollowTargetComponent";
import { CameraFollowComponent } from "../components/CameraFollowComponent";
import { AudioComponent } from "../components/AudioComponent";

export class DemoScene extends Scene {
  public assetManifest: Record<string, string> = {
    playerTexture: "textures/dabigpres.jpg",
    testSound: "sounds/test.ogg",
  };

  constructor(app: PIXI.Application) {
    super(app);
  }

  protected async init(): Promise<void> {
    const player = new GameObject(this);
    player.addComponent(new SpriteComponent("playerTexture"));
    player.addComponent(new KeyboardControllerComponent(50));
    player.addComponent(new CameraFollowComponent(0.5));
    player.addComponent(new RotationComponent(0.02));
    player.container.x = this.app.screen.width / 2;
    player.container.y = this.app.screen.height / 2;
    player.container.scale.set(0.1);
    this.addGameObject(player);

    const soundEmitter = new GameObject(this);
    soundEmitter.addComponent(new SpriteComponent("playerTexture"));
    soundEmitter.addComponent(
      new AudioComponent("testSound", true, 0.5, true, true, 1000),
    );
    soundEmitter.container.x = this.app.screen.width / 2 + 200;
    soundEmitter.container.y = this.app.screen.height / 2;
    soundEmitter.container.scale.set(0.05);
    soundEmitter.container.tint = 0xff0000;
    this.addGameObject(soundEmitter);

    const uiText = new GameObject(this);
    const textComp = uiText.addComponent(
      new TextComponent("Click me!", {
        fill: 0xffffff,
        fontSize: 24,
        fontWeight: "bold",
      }),
    );
    uiText.addComponent(
      new ClickableComponent(() => {
        textComp.setText("Clicked!");
        setTimeout(() => textComp.setText("Click me!"), 1000);
      }),
    );
    uiText.container.x = 100;
    uiText.container.y = 100;
    this.addGameObject(uiText);
  }
}
