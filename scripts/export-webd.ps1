$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$exportDir = Join-Path $projectRoot "export"
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

        if (Test-Path -LiteralPath $temporaryZip) {
            Remove-Item -LiteralPath $temporaryZip -Force
        }

        New-Item -ItemType Directory -Path $exportDir | Out-Null
    }

    Run-Step "Budowanie aplikacji Next.js" {
        & npm.cmd run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build zakonczyl sie kodem $LASTEXITCODE. Export nie zostal przygotowany."
        }
    }

    Run-Step "Kopiowanie plikow aplikacji" {
        Copy-Item -LiteralPath (Join-Path $projectRoot ".next") -Destination $exportDir -Recurse
        Copy-Item -LiteralPath (Join-Path $projectRoot "content") -Destination $exportDir -Recurse
        Copy-Item -LiteralPath (Join-Path $projectRoot "private") -Destination $exportDir -Recurse
        Copy-Item -LiteralPath (Join-Path $projectRoot "public") -Destination $exportDir -Recurse

        @(
            ".env.example"
            "next.config.mjs"
            "package-lock.json"
            "package.json"
            "server.js"
        ) | ForEach-Object {
            Copy-Item -LiteralPath (Join-Path $projectRoot $_) -Destination $exportDir
        }

        @'
omit=dev
audit=false
fund=false
loglevel=notice
'@ | Set-Content -LiteralPath (Join-Path $exportDir ".npmrc") -Encoding ASCII

        @'
Ten folder zawiera aktualna paczke do wgrania na hosting Node/Next.

Wgraj plik `dealshare-webd.zip` na serwer i rozpakuj go w katalogu aplikacji.
Archiwum zawiera:
- `.next`
- `content`
- `private`
- `public`
- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `server.js`
- `.npmrc`, ktory ogranicza instalacje na serwerze do zaleznosci produkcyjnych
- `.env.example` jako wzor wymaganych zmiennych

Prawdziwe zmienne srodowiskowe pozostaja skonfigurowane osobno w aplikacji Node na hostingu.
Do panelu zarzadu wymagane sa takze zmienne Supabase z `.env.example`.
Po rozpakowaniu kliknij `npm install` tylko raz i poczekaj na zakonczenie instalacji.
Nastepnie uruchom lub zrestartuj aplikacje w panelu hostingu.
'@ | Set-Content -LiteralPath (Join-Path $exportDir "README.md") -Encoding UTF8
    }

    Run-Step "Tworzenie archiwum dealshare-webd.zip" {
        New-ZipArchive -SourceDirectory $exportDir -DestinationPath $temporaryZip
        Move-Item -LiteralPath $temporaryZip -Destination $zipPath
    }

    $zipSizeMb = [math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 2)

    Write-Host "`nExport gotowy:" -ForegroundColor Green
    Write-Host "Folder: $exportDir"
    Write-Host "ZIP:    $zipPath ($zipSizeMb MB)"
}
catch {
    if (Test-Path -LiteralPath $temporaryZip) {
        Remove-Item -LiteralPath $temporaryZip -Force
    }

    Write-Error $_
    exit 1
}
finally {
    Pop-Location
}
