@echo off
echo Packaging Invogenz for cPanel / LiteSpeed Deployment...
powershell -ExecutionPolicy Bypass -File "%~dp0build-deploy-zip.ps1"
pause
