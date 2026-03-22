import * as PIXI from "pixi.js";
import { Howl } from "howler";
import * as Neutralino from "@neutralinojs/lib";

Neutralino.init();

const app = new PIXI.Application();

const test_music = new Howl({
  src: ["sounds/test.ogg"],
  loop: true,
  volume: 0.75,
});

async function initGame() {
  await app.init({ background: "#1099bb", resizeTo: window });
  document.body.appendChild(app.canvas);

  const ramInfo = await Neutralino.computer.getMemoryInfo();
  const cpuInfo = await Neutralino.computer.getCPUInfo();
  const availableGB = ramInfo.physical.available / (1024 * 1024 * 1024);
  console.log(`Available RAM: ${availableGB.toFixed(2)} GB`);
  console.log(`CPU: ${cpuInfo.model}`);
  test_music.play();
}

initGame();
