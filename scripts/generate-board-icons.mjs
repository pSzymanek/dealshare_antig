import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const projectRoot = process.cwd();
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

await mkdir(path.join(projectRoot, ".local"), { recursive: true });

// Read the uploaded perfect sygnet as base64
const sygnetBuffer = await readFile(path.join(projectRoot, "public", "dealshare-sygnet-transparent.png"));
const sygnetBase64 = `data:image/png;base64,${sygnetBuffer.toString("base64")}`;

// HTML template with white background and the exact image scaled to a safe zone (58%)
const html512 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 512px;
      height: 512px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .icon-wrapper {
      width: 290px;
      height: 290px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 6px 16px rgba(0, 91, 255, 0.20));
    }
  </style>
</head>
<body>
  <div class="icon-wrapper">
    <img src="${sygnetBase64}" alt="Sygnet" />
  </div>
</body>
</html>`;

const html192 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 192px;
      height: 192px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .icon-wrapper {
      width: 108px;
      height: 108px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 3px 8px rgba(0, 91, 255, 0.20));
    }
  </style>
</head>
<body>
  <div class="icon-wrapper">
    <img src="${sygnetBase64}" alt="Sygnet" />
  </div>
</body>
</html>`;

const html512Path = path.join(projectRoot, ".local", "icon512.html");
const html192Path = path.join(projectRoot, ".local", "icon192.html");

await writeFile(html512Path, html512, "utf8");
await writeFile(html192Path, html192, "utf8");

const out512 = path.join(projectRoot, "public", "zarzad-icon-512.png");
const out192 = path.join(projectRoot, "public", "zarzad-icon-192.png");
const outMaskable = path.join(projectRoot, "public", "zarzad-icon-maskable-512.png");

console.log("Generowanie ikon PWA (Zarząd DS) ze strefą bezpieczeństwa...");

await execAsync(`"${edgePath}" --headless --disable-gpu --window-size=512,512 --screenshot="${out512}" "${html512Path}"`);
await execAsync(`"${edgePath}" --headless --disable-gpu --window-size=192,192 --screenshot="${out192}" "${html192Path}"`);
await execAsync(`"${edgePath}" --headless --disable-gpu --window-size=512,512 --screenshot="${outMaskable}" "${html512Path}"`);

console.log("Nowe ikony oparte na oryginalnym PNG zostały wygenerowane pomyślnie!");
