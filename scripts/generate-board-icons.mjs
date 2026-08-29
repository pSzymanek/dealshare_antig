import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const projectRoot = process.cwd();
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

await mkdir(path.join(projectRoot, ".local"), { recursive: true });

// HTML template with white background and sygnet safely scaled down (58% size) so Android/iOS will never crop it
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
    svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 6px 16px rgba(0, 91, 255, 0.20));
    }
  </style>
</head>
<body>
  <div class="icon-wrapper">
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33 40L80 13L127 40V94L80 121L33 94V40Z" fill="url(#g)"/>
      <path d="M57 55L90 36L107 51L73 70L105 70V89L72 108L55 93L88 74H57V55Z" fill="white"/>
      <defs>
        <linearGradient id="g" x1="37" y1="32" x2="125" y2="114" gradientUnits="userSpaceOnUse">
          <stop stop-color="#005BFF"/>
          <stop offset="1" stop-color="#00D1D1"/>
        </linearGradient>
      </defs>
    </svg>
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
    svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 3px 8px rgba(0, 91, 255, 0.20));
    }
  </style>
</head>
<body>
  <div class="icon-wrapper">
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33 40L80 13L127 40V94L80 121L33 94V40Z" fill="url(#g)"/>
      <path d="M57 55L90 36L107 51L73 70L105 70V89L72 108L55 93L88 74H57V55Z" fill="white"/>
      <defs>
        <linearGradient id="g" x1="37" y1="32" x2="125" y2="114" gradientUnits="userSpaceOnUse">
          <stop stop-color="#005BFF"/>
          <stop offset="1" stop-color="#00D1D1"/>
        </linearGradient>
      </defs>
    </svg>
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

console.log("Generowanie ikon PWA ze strefą bezpieczeństwa (safe-zone)...");

await execAsync(`"${edgePath}" --headless --disable-gpu --window-size=512,512 --screenshot="${out512}" "${html512Path}"`);
await execAsync(`"${edgePath}" --headless --disable-gpu --window-size=192,192 --screenshot="${out192}" "${html192Path}"`);
await execAsync(`"${edgePath}" --headless --disable-gpu --window-size=512,512 --screenshot="${outMaskable}" "${html512Path}"`);

console.log("Ikony wygenerowane pomyślnie!");
