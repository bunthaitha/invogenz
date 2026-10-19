<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvoiceController;

Route::get('/', [InvoiceController::class, 'index'])->name('home');
Route::post('/api/generate-pdf', [InvoiceController::class, 'generatePdf']);
Route::post('/api/preview-pdf', [InvoiceController::class, 'previewPdf']);
