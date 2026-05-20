import * as PIXI from "pixi.js";
import * as Neutralino from "@neutralinojs/lib";

export async function initialize(): Promise<PIXI.Application> {
  const app = new PIXI.Application();
  Neutralino.init();

  await app.init({ background: "#000000", width: 1920, height: 1080 });
  document.body.appendChild(app.canvas);

  const ramInfo = await Neutralino.computer.getMemoryInfo();
  const cpuInfo = await Neutralino.computer.getCPUInfo();
  const availableGB = ramInfo.physical.available / (1024 * 1024 * 1024);

  console.log(`Available RAM: ${availableGB} GB`);
  console.log(`CPU: ${cpuInfo.model}`);
  console.log(`Version: ${__VERSION__}`);

  return app;
}
