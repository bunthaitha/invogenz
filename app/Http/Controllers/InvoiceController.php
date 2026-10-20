<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Show the main Invogenz studio workspace.
     */
    public function index()
    {
        return view('index');
    }

    /**
     * Generate and download PDF.
     */
    public function generatePdf(Request $request)
    {
        $data = $request->all();
        $paperSize = strtolower($data['paper_size'] ?? 'a4') === 'letter' ? 'letter' : 'a4';

        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $data]);
        $pdf->setPaper($paperSize, 'portrait');
        $pdf->setOption(['isRemoteEnabled' => true, 'isHtml5ParserEnabled' => true]);

        $rawFilename = $data['invoice_number'] ?? 'invoice';
        $safeFilename = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $rawFilename) ?: 'invoice';
        $filename = $safeFilename . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Stream PDF for in-browser preview tab.
     */
    public function previewPdf(Request $request)
    {
        $data = $request->all();
        $paperSize = strtolower($data['paper_size'] ?? 'a4') === 'letter' ? 'letter' : 'a4';

        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $data]);
        $pdf->setPaper($paperSize, 'portrait');
        $pdf->setOption(['isRemoteEnabled' => true, 'isHtml5ParserEnabled' => true]);

        $rawFilename = $data['invoice_number'] ?? 'invoice';
        $safeFilename = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $rawFilename) ?: 'invoice';
        $filename = $safeFilename . '.pdf';

        return $pdf->stream($filename);
    }

    /**
     * Preview invoice directly as HTML web page.
     */
    public function previewWeb(Request $request)
    {
        $data = $request->all();
        return view('pdf.invoice', ['invoice' => $data]);
    }
}
