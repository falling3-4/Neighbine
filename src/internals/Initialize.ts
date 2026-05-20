import * as PIXI from "pixi.js";
import * as Neutralino from "@neutralinojs/lib";

export async function initialize(): Promise<PIXI.Application> {
  const app = new PIXI.Application();

  if (__IS_NEUTRALINO__) {
    Neutralino.init();
  }

  await app.init({ background: "#000000", width: 1920, height: 1080 });
  document.body.appendChild(app.canvas);

  let availableGB = 0;
  let cpuModel = "Unknown";

  if (__IS_NEUTRALINO__) {
    const ramInfo = await Neutralino.computer.getMemoryInfo();
    const cpuInfo = await Neutralino.computer.getCPUInfo();
    availableGB = ramInfo.physical.available / (1024 * 1024 * 1024);
    cpuModel = cpuInfo.model;
  }

  console.log(`Available RAM: ${availableGB} GB`);
  console.log(`CPU: ${cpuModel}`);
  console.log(`Version: ${__VERSION__}`);

  return app;
}
