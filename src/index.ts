import * as PIXI from "pixi.js";
import * as Neutralino from "@neutralinojs/lib";
import { initialize } from "./internals/Initialize";
import { SceneManager } from "./internals/SceneManager";
import { DemoScene } from "./scenes/DemoScene";

Neutralino.init();

async function initGame() {
  const app = await initialize();
  const manager = new SceneManager(app);
  await manager.changeScene(new DemoScene(app));
}

(window as any).debug = true;
initGame();
