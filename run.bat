@echo off
title Invogenz - Laravel Invoice Studio
echo ========================================================
echo   Launching Invogenz (Laravel 10 - No Database)
echo   Local Address: http://127.0.0.1:5000
echo ========================================================
echo.
php artisan serve --host=0.0.0.0 --port=5000
pause
