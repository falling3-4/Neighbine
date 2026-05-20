import * as PIXI from "pixi.js";
import { Scene } from "./Scene";
import { GameObject } from "../internals/GameObject";
import { SpriteComponent } from "../components/SpriteComponent";
import { KeyboardControllerComponent } from "../components/KeyboardControllerComponent";
import { RotationComponent } from "../components/RotationComponent";
import { TextComponent } from "../components/TextComponent";
import { ClickableComponent } from "../components/ClickableComponent";
import { CameraFollowComponent } from "../components/CameraFollowComponent";
import { VideoPlayerComponent } from "../components/VideoPlayerComponent";

export class DemoScene extends Scene {
  public assetManifest: Record<string, string> = {
    playerTexture: "textures/dabigpres.jpg",
    video: "https://pixijs.com/assets/video.mp4",
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
    player.container.zIndex = 9999;
    this.addGameObject(player);

    const videoPlayer = new GameObject(this);
    videoPlayer.addComponent(
      new VideoPlayerComponent("video", true, 0.5, true, 1000),
    );
    videoPlayer.container.x = this.app.screen.width / 2;
    videoPlayer.container.y = this.app.screen.height / 2;
    videoPlayer.container.scale.set(2);
    this.addGameObject(videoPlayer);

    const uiText = new GameObject(this, false);
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

    const hudElement = new GameObject(this, true);
    hudElement.addComponent(
      new TextComponent("HUD Text", { fill: 0xffff00, fontSize: 50 }),
    );
    hudElement.container.position.set(100, 60);
    this.addGameObject(hudElement);
  }
}
