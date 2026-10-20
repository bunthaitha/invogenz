<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;

Route::get('/', [InvoiceController::class, 'index'])->name('home');

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'invogenz-web',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/status', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'invogenz-web',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::match(['get', 'post'], '/preview-web', [InvoiceController::class, 'previewWeb']);
