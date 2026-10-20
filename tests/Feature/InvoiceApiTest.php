<?php

namespace Tests\Feature;

use Tests\TestCase;

class InvoiceApiTest extends TestCase
{
    /**
     * Test web health and status endpoints.
     */
    public function test_web_health_and_status_endpoints(): void
    {
        $responseHealth = $this->get('/health');
        $responseHealth->assertStatus(200)
            ->assertJson(['status' => 'ok', 'service' => 'invogenz-web']);

        $responseStatus = $this->get('/status');
        $responseStatus->assertStatus(200)
            ->assertJson(['status' => 'ok', 'service' => 'invogenz-web']);
    }

    /**
     * Test api health and status endpoints.
     */
    public function test_api_health_and_status_endpoints(): void
    {
        $responseHealth = $this->get('/api/health');
        $responseHealth->assertStatus(200)
            ->assertJson(['status' => 'ok', 'service' => 'invogenz-pdf-engine']);

        $responseStatus = $this->get('/api/status');
        $responseStatus->assertStatus(200)
            ->assertJson(['status' => 'ok', 'service' => 'invogenz-pdf-engine']);
    }

    /**
     * Test generating downloadable PDF with sanitized filename.
     */
    public function test_generate_pdf_endpoint(): void
    {
        $payload = [
            'invoice_number' => 'INV/2026:001*TEST',
            'paper_size' => 'a4',
            'company_name' => 'Acme Corp',
            'client_name' => 'John Doe',
            'items' => [
                [
                    'description' => 'Test Item',
                    'quantity' => 2,
                    'rate' => 50,
                    'tax_rate' => 10,
                ],
            ],
        ];

        $response = $this->postJson('/api/generate-pdf', $payload);

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
        $this->assertStringContainsString('INV_2026_001_TEST.pdf', $response->headers->get('content-disposition'));
    }

    /**
     * Test streaming preview PDF.
     */
    public function test_preview_pdf_endpoint(): void
    {
        $payload = [
            'invoice_number' => 'INV-PREVIEW-001',
            'paper_size' => 'letter',
            'company_name' => 'Acme Corp',
            'client_name' => 'Jane Doe',
            'items' => [
                [
                    'description' => 'Consulting Services',
                    'quantity' => 5,
                    'rate' => 100,
                    'tax_rate' => 0,
                ],
            ],
        ];

        $response = $this->postJson('/api/preview-pdf', $payload);

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
        $this->assertStringContainsString('inline', $response->headers->get('content-disposition'));
    }

    /**
     * Test preview web route.
     */
    public function test_preview_web_route(): void
    {
        $response = $this->get('/preview-web');
        $response->assertStatus(200);
    }
}
