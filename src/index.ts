import * as PIXI from "pixi.js";
import { Sound } from "./internals/Sound";
import * as Neutralino from "@neutralinojs/lib";

Neutralino.init();

const app = new PIXI.Application();

async function initGame() {
  await app.init({ background: "#1099bb", resizeTo: window });
  document.body.appendChild(app.canvas);

  console.log("Version:", __VERSION__);
  const ramInfo = await Neutralino.computer.getMemoryInfo();
  const cpuInfo = await Neutralino.computer.getCPUInfo();
  const availableGB = ramInfo.physical.available / (1024 * 1024 * 1024);
  console.log(`Available RAM: ${availableGB.toFixed(2)} GB`);
  console.log(`CPU: ${cpuInfo.model}`);

  const music = new Sound("sounds/test.ogg", true, 0.5);
  music.play();
}

initGame();
