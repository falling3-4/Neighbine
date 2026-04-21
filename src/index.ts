import * as PIXI from "pixi.js";
import { Sound2D } from "./internals/Sound";
import * as Neutralino from "@neutralinojs/lib";
import { initialize } from "./internals/Initialize";
import { SceneManager } from "./internals/SceneManager";
import { TestScene } from "./scenes/TestScene";

Neutralino.init();

async function initGame() {
  const app = await initialize();

  const manager = new SceneManager(app);

  await manager.changeScene(new TestScene(app));
}

initGame();
