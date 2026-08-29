$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$exportDir = Join-Path $projectRoot "export"
$stagingDir = Join-Path $projectRoot ".local\staging-export"
$zipPath = Join-Path $exportDir "dealshare-webd.zip"
$temporaryZip = Join-Path $projectRoot "dealshare-webd.tmp.zip"

function Run-Step {
    param(
        [string]$Description,
        [scriptblock]$Action
    )

    Write-Host "`n==> $Description" -ForegroundColor Cyan
    & $Action
}

function New-ZipArchive {
    param(
        [string]$SourceDirectory,
        [string]$DestinationPath
    )

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    $archive = [System.IO.Compression.ZipFile]::Open(
        $DestinationPath,
        [System.IO.Compression.ZipArchiveMode]::Create
    )

    try {
        Get-ChildItem -LiteralPath $SourceDirectory -File -Recurse | ForEach-Object {
            $relativePath = $_.FullName.Substring($SourceDirectory.Length).TrimStart("\", "/")
            $entryName = $relativePath.Replace("\", "/")

            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $archive,
                $_.FullName,
                $entryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
    }
    finally {
        $archive.Dispose()
    }
}

Push-Location $projectRoot

try {
    Run-Step "Czyszczenie poprzedniego exportu" {
        if (Test-Path -LiteralPath $exportDir) {
            Remove-Item -LiteralPath $exportDir -Recurse -Force
        }

        if (Test-Path -LiteralPath $stagingDir) {
            Remove-Item -LiteralPath $stagingDir -Recurse -Force
        }

        if (Test-Path -LiteralPath $temporaryZip) {
            Remove-Item -LiteralPath $temporaryZip -Force
        }

        New-Item -ItemType Directory -Path $exportDir | Out-Null
        New-Item -ItemType Directory -Path $stagingDir | Out-Null
    }

    Run-Step "Budowanie aplikacji Next.js" {
        & npm.cmd run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build zakonczyl sie kodem $LASTEXITCODE. Export nie zostal przygotowany."
        }
    }

    Run-Step "Kopiowanie plikow aplikacji" {
        Copy-Item -LiteralPath (Join-Path $projectRoot ".next") -Destination $stagingDir -Recurse
        Copy-Item -LiteralPath (Join-Path $projectRoot "content") -Destination $stagingDir -Recurse
        Copy-Item -LiteralPath (Join-Path $projectRoot "private") -Destination $stagingDir -Recurse
        Copy-Item -LiteralPath (Join-Path $projectRoot "public") -Destination $stagingDir -Recurse

        @(
            ".env.example"
            "next.config.mjs"
            "package-lock.json"
            "package.json"
            "server.js"
        ) | ForEach-Object {
            Copy-Item -LiteralPath (Join-Path $projectRoot $_) -Destination $stagingDir
        }

        $localEnv = Join-Path $projectRoot ".env.local"
        if (Test-Path -LiteralPath $localEnv) {
            Copy-Item -LiteralPath $localEnv -Destination (Join-Path $stagingDir ".env")
            Copy-Item -LiteralPath $localEnv -Destination (Join-Path $exportDir ".env")
        }

        @'
omit=dev
audit=false
fund=false
loglevel=notice
'@ | Set-Content -LiteralPath (Join-Path $stagingDir ".npmrc") -Encoding ASCII

        @'
Ten folder zawiera gotowa paczke produkcyjna DEALSHARE.

Plik `.env` jest juz dolaczony i wstepnie skonfigurowany pod Wasz projekt Supabase.
Wystarczy wrzucic plik `dealshare-webd.zip` na hosting, rozpakowac go,
kliknac `npm install` w panelu Node i uruchomic aplikacje.
'@ | Set-Content -LiteralPath (Join-Path $exportDir "README.md") -Encoding UTF8
    }

    Run-Step "Tworzenie archiwum dealshare-webd.zip" {
        New-ZipArchive -SourceDirectory $stagingDir -DestinationPath $temporaryZip
        Move-Item -LiteralPath $temporaryZip -Destination $zipPath
        Remove-Item -LiteralPath $stagingDir -Recurse -Force
    }

    Run-Step "Generowanie lokalnej instrukcji PDF dla zarzadu" {
        & node scripts/generate-board-pdf.mjs
    }

    $zipSizeMb = [math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 2)

    Write-Host "`nExport gotowy:" -ForegroundColor Green
    Write-Host "Folder: $exportDir"
    Write-Host "ZIP:    $zipPath ($zipSizeMb MB)"
    Write-Host "PDF:    $exportDir\DEALSHARE_Board_Instrukcja.pdf (tylko lokalnie)"
}
catch {
    if (Test-Path -LiteralPath $temporaryZip) {
        Remove-Item -LiteralPath $temporaryZip -Force
    }
    if (Test-Path -LiteralPath $stagingDir) {
        Remove-Item -LiteralPath $stagingDir -Recurse -Force
    }

    Write-Error $_
    exit 1
}
finally {
    Pop-Location
}
