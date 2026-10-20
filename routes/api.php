<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'invogenz-pdf-engine',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::post('/generate-pdf', [\App\Http\Controllers\InvoiceController::class, 'generatePdf']);
Route::post('/preview-pdf', [\App\Http\Controllers\InvoiceController::class, 'previewPdf']);

