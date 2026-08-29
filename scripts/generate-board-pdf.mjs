import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const projectRoot = process.cwd();

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

await mkdir(path.join(projectRoot, ".local"), { recursive: true });

// Read logo as base64
const logoBuffer = await readFile(path.join(projectRoot, "public", "logo-dark.png"));
const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

const sygnetBuffer = await readFile(path.join(projectRoot, "public", "sygnet-white.png"));
const sygnetBase64 = `data:image/png;base64,${sygnetBuffer.toString("base64")}`;

const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>DEALSHARE Board — Instrukcja Aktywacji</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      padding: 0;
      width: 210mm;
      min-height: 297mm;
      position: relative;
    }

    .header-hero {
      background: linear-gradient(135deg, #020711 0%, #041738 50%, #062b66 100%);
      color: #ffffff;
      padding: 36px 40px 32px 40px;
      position: relative;
      overflow: hidden;
      border-bottom: 3px solid #00f0ff;
    }

    .header-hero::after {
      content: '';
      position: absolute;
      right: -40px;
      top: -40px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, rgba(0, 240, 255, 0) 70%);
      border-radius: 50%;
    }

    .brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .logo-img {
      height: 38px;
      width: auto;
      object-fit: contain;
    }

    .badge-board {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid rgba(0, 240, 255, 0.4);
      color: #00f0ff;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .header-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #ffffff;
      line-height: 1.2;
    }

    .header-subtitle {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.78);
      margin-top: 8px;
      max-width: 600px;
      line-height: 1.6;
    }

    .content-body {
      padding: 28px 40px 32px 40px;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .step-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 20px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
      position: relative;
    }

    .step-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #020711;
      color: #00f0ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 900;
      flex-shrink: 0;
    }

    .step-title {
      font-size: 14px;
      font-weight: 800;
      color: #041738;
      letter-spacing: -0.01em;
    }

    .step-desc {
      font-size: 11.5px;
      color: #475569;
      line-height: 1.55;
    }

    .highlight-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 12px;
      margin-top: 10px;
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #0f172a;
      word-break: break-all;
    }

    .accounts-list {
      margin-top: 8px;
      display: grid;
      gap: 4px;
      font-size: 11px;
    }

    .account-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dashed #e2e8f0;
    }

    .account-item:last-child {
      border-bottom: none;
    }

    .key-badge {
      display: inline-block;
      background: #041738;
      color: #00f0ff;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
    }

    .feature-banner {
      background: linear-gradient(135deg, rgba(4, 23, 56, 0.04) 0%, rgba(0, 240, 255, 0.08) 100%);
      border: 1.5px solid rgba(0, 240, 255, 0.4);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .feature-icon {
      font-size: 24px;
      line-height: 1;
    }

    .feature-title {
      font-size: 13px;
      font-weight: 800;
      color: #041738;
      margin-bottom: 4px;
    }

    .feature-desc {
      font-size: 11.5px;
      color: #334155;
      line-height: 1.5;
    }

    .footer {
      position: absolute;
      bottom: 24px;
      left: 40px;
      right: 40px;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: #64748b;
      font-weight: 600;
    }

    .footer-brand {
      color: #041738;
      font-weight: 800;
    }
  </style>
</head>
<body>

  <header class="header-hero">
    <div class="brand-row">
      <img src="${logoBase64}" alt="dealshare" class="logo-img">
      <div class="badge-board">
        <span>●</span> Wewnętrzny Panel Zarządu
      </div>
    </div>
    <h1 class="header-title">Instrukcja Aktywacji DEALSHARE Board</h1>
    <p class="header-subtitle">
      Prosty przewodnik konfiguracji panelu na smartfonie, instalacji aplikacji mobilnej oraz włączenia natywnych powiadomień Push w tle.
    </p>
  </header>

  <main class="content-body">
    <div class="steps-grid">
      
      <!-- KROK 1 -->
      <div class="step-card">
        <div class="step-card-header">
          <div class="step-num">01</div>
          <h2 class="step-title">Wejście do Panelu</h2>
        </div>
        <p class="step-desc">
          Otwórz przeglądarkę w telefonie (Chrome lub Safari) i wejdź pod adres panelu:
        </p>
        <div class="highlight-box">
          👉 <strong>https://dealshare.pl/zarzad</strong>
        </div>
        <p class="step-desc" style="margin-top: 8px; font-size: 10.5px; color: #64748b;">
          Wersja testowa / podglądowa:<br>dealshare-antig.vercel.app/zarzad
        </p>
      </div>

      <!-- KROK 2 -->
      <div class="step-card">
        <div class="step-card-header">
          <div class="step-num">02</div>
          <h2 class="step-title">Logowanie Członka Zarządu</h2>
        </div>
        <p class="step-desc">
          Wpisz swój firmowy adres e-mail oraz hasło startowe:
        </p>
        <div class="accounts-list">
          <div class="account-item">
            <span><strong>Piotr:</strong></span>
            <span>piotr@dealshare.pl</span>
          </div>
          <div class="account-item">
            <span><strong>Michał:</strong></span>
            <span>michal@dealshare.pl</span>
          </div>
          <div class="account-item">
            <span><strong>Żaneta:</strong></span>
            <span>zaneta@dealshare.pl</span>
          </div>
        </div>
        <div style="margin-top: 8px; font-size: 11px;">
          Wspólne hasło startowe: <span class="key-badge">Dealshare2026</span>
        </div>
      </div>

      <!-- KROK 3 -->
      <div class="step-card">
        <div class="step-card-header">
          <div class="step-num">03</div>
          <h2 class="step-title">Instalacja Aplikacji (PWA)</h2>
        </div>
        <div class="step-desc">
          <p style="margin-bottom: 6px;">
            📱 <strong>Android (Chrome):</strong> Kliknij błękitny przycisk <code>+ Zainstaluj aplikację</code> na górze panelu (lub menu 3 kropek &rarr; <em>Zainstaluj aplikację</em>).
          </p>
          <p>
            🍎 <strong>iPhone (Safari):</strong> Kliknij ikonę udostępniania na dole (kwadrat ze strzałką ⎋) i wybierz <strong>„Do ekranu początkowego”</strong>.
          </p>
        </div>
        <p class="step-desc" style="margin-top: 8px; font-weight: 700; color: #041738;">
          Ikonka Dealshare Board pojawi się na Twoim pulpicie.
        </p>
      </div>

      <!-- KROK 4 -->
      <div class="step-card">
        <div class="step-card-header">
          <div class="step-num">04</div>
          <h2 class="step-title">Włączenie Powiadomień Push</h2>
        </div>
        <p class="step-desc">
          1. W górnym pasku kliknij: <strong>🔔 Włącz powiadomienia na telefonie</strong>.
        </p>
        <p class="step-desc" style="margin-top: 4px;">
          2. Gdy telefon wyświetli okno dialogowe, kliknij <strong>„Zezwalaj”</strong>.
        </p>
        <p class="step-desc" style="margin-top: 4px;">
          3. Kliknij <strong>„🔔 Wyślij test”</strong> i zablokuj telefon, aby sprawdzić wibrację i komunikat na ekranie blokady!
        </p>
      </div>

    </div>

    <!-- BANNER PUSH INFO -->
    <div class="feature-banner">
      <div class="feature-icon">🔔</div>
      <div>
        <h3 class="feature-title">Powiadomienia w czasie rzeczywistym — nawet przy zamkniętej aplikacji</h3>
        <p class="feature-desc">
          Dzięki technologii Web Push telefon automatycznie wibruje i wyświetla powiadomienia o nowych wiadomościach na czacie Zarządu, przypisanych zadaniach i ważnych ogłoszeniach — bez potrzeby trzymania otwartej przeglądarki.
        </p>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div>
      <span class="footer-brand">DEALSHARE</span> • Przychodzisz z potrzebą, wychodzisz z rozwiązaniem.
    </div>
    <div>
      dealshare.pl/zarzad
    </div>
  </footer>

</body>
</html>`;

const tempHtmlPath = path.join(projectRoot, ".local", "instrukcja_zarzadu.html");
await writeFile(tempHtmlPath, htmlContent, "utf8");

const outputPdfPublic = path.join(projectRoot, "public", "DEALSHARE_Board_Instrukcja.pdf");
const outputPdfExport = path.join(projectRoot, "export", "DEALSHARE_Board_Instrukcja.pdf");
const artifactDir = "C:\\Users\\poczt\\.gemini\\antigravity\\brain\\a8e31ec7-50ef-45d8-a2fd-e5fe390a129e";
const outputPdfArtifact = path.join(artifactDir, "DEALSHARE_Board_Instrukcja.pdf");

console.log("Generowanie PDF za pomocą Microsoft Edge...");

const command = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPublic}" --no-pdf-header-footer "${tempHtmlPath}"`;

await execAsync(command);
console.log("Wygenerowano:", outputPdfPublic);

// Copy to export and artifact
const pdfBuffer = await readFile(outputPdfPublic);
await writeFile(outputPdfExport, pdfBuffer).catch(() => {});
await writeFile(outputPdfArtifact, pdfBuffer).catch(() => {});

console.log("PDF pomyślnie skopiowany do export/ oraz katalogu artefaktów!");
