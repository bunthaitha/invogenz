# Invogenz Production Deployment Zipper for cPanel / LiteSpeed
$ErrorActionPreference = "Stop"

$workspace = $PSScriptRoot
$zipOutput = Join-Path $workspace "invogenz-laravel-deploy.zip"
$tempStaging = Join-Path $workspace ".staging_deploy"

Write-Host "==> Cleaning old zip and staging directory..." -ForegroundColor Cyan
if (Test-Path $zipOutput) { Remove-Item $zipOutput -Force }
if (Test-Path $tempStaging) { Remove-Item $tempStaging -Recurse -Force }

New-Item -ItemType Directory -Path $tempStaging | Out-Null

Write-Host "==> Staging core application directories..." -ForegroundColor Cyan
$folders = @('app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'storage', 'vendor')
foreach ($folder in $folders) {
    $src = Join-Path $workspace $folder
    if (Test-Path $src) {
        Write-Host "  -> Copying $folder..."
        Copy-Item -Path $src -Destination (Join-Path $tempStaging $folder) -Recurse -Force
    }
}

Write-Host "==> Staging root config & front-controller files..." -ForegroundColor Cyan
$files = @('.env', '.htaccess', 'index.php', 'artisan', 'composer.json', 'README.md')
foreach ($file in $files) {
    $src = Join-Path $workspace $file
    if (Test-Path $src) {
        Write-Host "  -> Copying $file..."
        Copy-Item -Path $src -Destination (Join-Path $tempStaging $file) -Force
    }
}

# Clean any cache files in staging bootstrap/cache
$stagedCache = Join-Path $tempStaging "bootstrap\cache"
if (Test-Path $stagedCache) {
    Get-ChildItem -Path $stagedCache -Filter "*.php" | Remove-Item -Force
}

# Clean any log files in staging storage/logs
$stagedLogs = Join-Path $tempStaging "storage\logs"
if (Test-Path $stagedLogs) {
    Get-ChildItem -Path $stagedLogs -Filter "*.log" | Remove-Item -Force
}

Write-Host "==> Compressing into $zipOutput..." -ForegroundColor Cyan
# Using .NET ZipFile to ensure proper paths and inclusion of hidden files (.env, .htaccess)
Add-Type -AssemblyName "System.IO.Compression.FileSystem"
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempStaging, $zipOutput, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Write-Host "==> Cleaning up staging directory..." -ForegroundColor Cyan
Remove-Item $tempStaging -Recurse -Force

$zipSize = (Get-Item $zipOutput).Length / 1MB
Write-Host "==> SUCCESS: invogenz-laravel-deploy.zip created ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor Green
