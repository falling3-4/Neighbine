const fs = require("fs");
const path = require("path");

const config = require("./neutralino.config.json");
const binaryPath = config.cli.binaryName;

const src = path.join(__dirname, "dist", binaryPath);
const dest = path.join(__dirname, "build");

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
} else {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
}

if (!fs.existsSync(src)) {
  console.error(`[Error] Source directory not found: ${src}`);
  process.exit(1);
}

console.log(`Moving build files from ${binaryPath} to /build...`);

const files = fs.readdirSync(src);

files.forEach((file) => {
  const srcFile = path.join(src, file);
  const destFile = path.join(dest, file);

  try {
    fs.renameSync(srcFile, destFile);
    console.log(`  [OK] ${file}`);
  } catch (err) {
    console.error(`  [FAIL] ${file}: ${err.message}`);
  }
});

console.log("Build files moved successfully.");
