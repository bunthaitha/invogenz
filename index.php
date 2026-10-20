<?php

/**
 * Invogenz • Laravel 10 Root Front-Controller Fallback
 * Designed for cPanel, LiteSpeed & Shared Hosting environments
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/'
);

// If the requested file exists in the public directory, allow the web server to serve it directly
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri) && !is_dir(__DIR__ . '/public' . $uri)) {
    return false;
}

// Forward execution to the primary public front controller
require_once __DIR__ . '/public/index.php';
