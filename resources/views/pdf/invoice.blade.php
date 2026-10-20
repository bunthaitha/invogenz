<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $invoice['invoice_number'] ?? 'Invoice' }}</title>
    <style>
        @page {
            margin: 28px 36px 36px 36px;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.45;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 0;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        .header-table td {
            vertical-align: top;
        }
        .company-logo {
            max-width: 160px;
            max-height: 70px;
            margin-bottom: 8px;
        }
        .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
            margin: 0 0 2px 0;
        }
        .company-tagline {
            font-size: 10px;
            color: #64748b;
            margin: 0 0 6px 0;
        }
        .company-info {
            font-size: 10px;
            color: #475569;
            line-height: 1.4;
        }
        .doc-title {
            font-size: 26px;
            font-weight: 800;
            text-align: right;
            color: #0f172a;
            letter-spacing: 1px;
            margin: 0 0 6px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            float: right;
            margin-bottom: 8px;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }
        .meta-table td {
            font-size: 10px;
            padding: 2px 0;
            text-align: right;
        }
        .meta-label {
            color: #64748b;
            font-weight: 600;
            padding-right: 8px !important;
        }
        .meta-val {
            color: #0f172a;
            font-weight: bold;
            font-family: 'Courier', monospace;
        }
        .accent-bar {
            height: 3px;
            width: 100%;
            background-color: {{ $invoice['accent_color'] ?? '#4F46E5' }};
            margin: 12px 0 16px 0;
            border-radius: 2px;
        }
        .client-box {
            background-color: #f8fafc;
            border-left: 3px solid {{ $invoice['accent_color'] ?? '#4F46E5' }};
            padding: 10px 14px;
            margin-bottom: 18px;
            border-radius: 0 6px 6px 0;
        }
        .client-caption {
            font-size: 9px;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin: 0 0 4px 0;
        }
        .client-company {
            font-size: 13px;
            font-weight: bold;
            color: #0f172a;
            margin: 0 0 2px 0;
        }
        .client-details {
            font-size: 10px;
            color: #475569;
            line-height: 1.4;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }
        .items-table th {
            background-color: {{ $invoice['accent_color'] ?? '#4F46E5' }};
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 7px 10px;
            text-align: left;
        }
        .items-table td {
            padding: 8px 10px;
            font-size: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .item-desc {
            font-weight: 600;
            color: #0f172a;
        }
        .item-subdesc {
            font-size: 9px;
            color: #64748b;
            margin-top: 2px;
        }
        .bottom-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .bottom-table td {
            vertical-align: top;
        }
        .payment-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            font-size: 10px;
            color: #475569;
            width: 90%;
        }
        .payment-title {
            font-size: 9px;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 6px;
        }
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 4px 6px;
            font-size: 10px;
            text-align: right;
        }
        .totals-label {
            color: #64748b;
            font-weight: 600;
        }
        .totals-value {
            font-family: 'Courier', monospace;
            font-weight: bold;
            color: #0f172a;
        }
        .grand-total-row td {
            background-color: {{ $invoice['accent_color'] ?? '#4F46E5' }};
            color: #ffffff !important;
            font-size: 13px !important;
            font-weight: bold;
            padding: 8px 10px !important;
            border-radius: 4px;
        }
        .grand-total-row .totals-label {
            color: #ffffff !important;
        }
        .grand-total-row .totals-value {
            color: #ffffff !important;
        }
        .notes-box {
            margin-top: 20px;
            padding: 10px 14px;
            background: #f8fafc;
            border-radius: 6px;
            border-left: 2px solid #cbd5e1;
            font-size: 9.5px;
            color: #475569;
        }
        .signatures-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 28px;
            table-layout: fixed;
        }
        .signature-cell {
            vertical-align: top;
            padding: 0 8px;
        }
        .signature-cell-left {
            text-align: left;
            width: 33.33%;
        }
        .signature-cell-center {
            text-align: center;
            width: 33.34%;
        }
        .signature-cell-right {
            text-align: right;
            width: 33.33%;
        }
        .sig-block-wrap {
            display: inline-block;
            width: 140px;
            max-width: 100%;
        }
        .signature-cell-left .sig-block-wrap {
            text-align: left;
        }
        .signature-cell-center .sig-block-wrap {
            text-align: center;
        }
        .signature-cell-right .sig-block-wrap {
            text-align: right;
        }
        .sig-line {
            border-top: 1px solid #94a3b8;
            margin-top: 45px;
            padding-top: 4px;
        }
        .sig-name {
            font-size: 10px;
            font-weight: bold;
            color: #0f172a;
        }
        .sig-role {
            font-size: 8.5px;
            color: #64748b;
            text-transform: uppercase;
        }
        .sig-date {
            font-size: 8px;
            color: #64748b;
            margin-top: 2px;
        }
        .sig-img {
            max-height: 40px;
            max-width: 120px;
            margin-bottom: -40px;
        }
    </style>
</head>
<body>

    @php
        $curr = $invoice['currency'] ?? '$';
        $accent = $invoice['accent_color'] ?? '#4F46E5';
        $subtotal = 0;
        $taxTotal = 0;
        foreach ($invoice['items'] ?? [] as $item) {
            $qty = floatval($item['quantity'] ?? 0);
            $rate = floatval($item['rate'] ?? 0);
            $taxRate = floatval($item['tax_rate'] ?? 0);
            $lineBase = $qty * $rate;
            $lineTax = $lineBase * ($taxRate / 100.0);
            $subtotal += $lineBase;
            $taxTotal += $lineTax;
        }
        $discInput = floatval($invoice['discount_value'] ?? 0);
        $discountAmount = ($invoice['discount_type'] ?? 'percentage') === 'percentage'
            ? $subtotal * ($discInput / 100.0)
            : $discInput;
        $shipping = floatval($invoice['shipping_fee'] ?? 0);
        $grandTotal = max(0, $subtotal - $discountAmount + $taxTotal + $shipping);
        $paid = floatval($invoice['amount_paid'] ?? 0);
        $balance = max(0, $grandTotal - $paid);
    @endphp

    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td style="width: 58%;">
                @if(!empty($invoice['company_logo']))
                    <img src="{{ $invoice['company_logo'] }}" class="company-logo" alt="Logo"><br>
                @endif
                @if(!empty($invoice['company_name']))
                    <div class="company-name">{{ $invoice['company_name'] }}</div>
                @endif
                @if(!empty($invoice['company_tagline']))
                    <div class="company-tagline">{{ $invoice['company_tagline'] }}</div>
                @endif
                <div class="company-info">
                    @if(!empty($invoice['company_contact']))
                        <div><strong>Contact Person:</strong> {{ $invoice['company_contact'] }}</div>
                    @endif
                    @if(!empty($invoice['company_address']))
                        <div>{!! nl2br(e($invoice['company_address'])) !!}</div>
                    @endif
                    @php
                        $contacts = array_filter([$invoice['company_phone'] ?? '', $invoice['company_email'] ?? '']);
                    @endphp
                    @if(count($contacts))
                        <div>{{ implode(' • ', $contacts) }}</div>
                    @endif
                </div>
            </td>
            <td style="width: 42%;">
                <div class="doc-title">INVOICE</div>
                @if(!empty($invoice['status']))
                    @php
                        $statusColors = [
                            'PAID' => '#10B981',
                            'OVERDUE' => '#EF4444',
                            'DRAFT' => '#64748B'
                        ];
                        $bg = $statusColors[strtoupper($invoice['status'])] ?? $accent;
                    @endphp
                    <div style="text-align: right;">
                        <span class="status-badge" style="background-color: {{ $bg }};">{{ $invoice['status'] }}</span>
                    </div>
                    <div style="clear: both;"></div>
                @endif
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Invoice #:</td>
                        <td class="meta-val">{{ $invoice['invoice_number'] ?? 'INV-0001' }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Issue Date:</td>
                        <td class="meta-val">{{ $invoice['issue_date'] ?? date('Y-m-d') }}</td>
                    </tr>
                    @if(!empty($invoice['due_date']))
                    <tr>
                        <td class="meta-label">Due Date:</td>
                        <td class="meta-val">{{ $invoice['due_date'] }}</td>
                    </tr>
                    @endif
                    @if(!empty($invoice['po_number']))
                    <tr>
                        <td class="meta-label">PO #:</td>
                        <td class="meta-val">{{ $invoice['po_number'] }}</td>
                    </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <div class="accent-bar"></div>

    <!-- Billed To / Client -->
    <div class="client-box">
        <div class="client-caption">BILLED TO / CLIENT</div>
        @if(!empty($invoice['client_company']))
            <div class="client-company">{{ $invoice['client_company'] }}</div>
        @endif
        <div class="client-details">
            @if(!empty($invoice['client_name']))
                <div><strong>Attn:</strong> {{ $invoice['client_name'] }}</div>
            @endif
            @if(!empty($invoice['client_address']))
                <div>{!! nl2br(e($invoice['client_address'])) !!}</div>
            @endif
            @php
                $clientContacts = array_filter([$invoice['client_phone'] ?? '', $invoice['client_email'] ?? '']);
            @endphp
            @if(count($clientContacts))
                <div>{{ implode(' • ', $clientContacts) }}</div>
            @endif
            @if(!empty($invoice['client_tax_id']))
                <div>Tax / VAT ID: {{ $invoice['client_tax_id'] }}</div>
            @endif
        </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 48%;">Item / Description</th>
                <th style="width: 10%; text-align: right;">Qty</th>
                <th style="width: 14%; text-align: right;">Rate</th>
                <th style="width: 8%; text-align: right;">Tax</th>
                <th style="width: 15%; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice['items'] ?? [] as $index => $item)
                @php
                    $q = floatval($item['quantity'] ?? 0);
                    $r = floatval($item['rate'] ?? 0);
                    $t = floatval($item['tax_rate'] ?? 0);
                    $tot = ($q * $r) * (1 + $t / 100.0);
                @endphp
                <tr>
                    <td style="color: #64748b; font-family: 'Courier', monospace;">{{ $index + 1 }}</td>
                    <td>
                        <div class="item-desc">{{ $item['description'] ?? 'Item' }}</div>
                        @if(!empty($item['sub_description']))
                            <div class="item-subdesc">{{ $item['sub_description'] }}</div>
                        @endif
                    </td>
                    <td style="text-align: right; font-family: 'Courier', monospace;">{{ $q }}</td>
                    <td style="text-align: right; font-family: 'Courier', monospace;">{{ $curr }} {{ number_format($r, 2) }}</td>
                    <td style="text-align: right; font-family: 'Courier', monospace; color: #64748b;">{{ $t > 0 ? $t . '%' : '—' }}</td>
                    <td style="text-align: right; font-family: 'Courier', monospace; font-weight: bold;">{{ $curr }} {{ number_format($tot, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Bottom Section: Payment Info & Totals -->
    <table class="bottom-table">
        <tr>
            <td style="width: 55%;">
                @if(!empty($invoice['bank_name']) || !empty($invoice['account_number']) || !empty($invoice['payment_method']))
                    <div class="payment-box">
                        <div class="payment-title">PAYMENT DETAILS</div>
                        @if(!empty($invoice['payment_method']))
                            <div><strong>Method:</strong> {{ $invoice['payment_method'] }}</div>
                        @endif
                        @if(!empty($invoice['bank_name']))
                            <div><strong>Bank:</strong> {{ $invoice['bank_name'] }}</div>
                        @endif
                        @if(!empty($invoice['account_name']))
                            <div><strong>Account Name:</strong> {{ $invoice['account_name'] }}</div>
                        @endif
                        @if(!empty($invoice['account_number']))
                            <div><strong>Account #:</strong> {{ $invoice['account_number'] }}</div>
                        @endif
                        @if(!empty($invoice['routing_swift']))
                            <div><strong>SWIFT / Routing:</strong> {{ $invoice['routing_swift'] }}</div>
                        @endif
                    </div>
                @endif
            </td>
            <td style="width: 45%;">
                <table class="totals-table">
                    <tr>
                        <td class="totals-label">Subtotal:</td>
                        <td class="totals-value">{{ $curr }} {{ number_format($subtotal, 2) }}</td>
                    </tr>
                    @if($discountAmount > 0)
                    <tr>
                        <td class="totals-label">Discount:</td>
                        <td class="totals-value">-{{ $curr }} {{ number_format($discountAmount, 2) }}</td>
                    </tr>
                    @endif
                    @if($taxTotal > 0)
                    <tr>
                        <td class="totals-label">Tax:</td>
                        <td class="totals-value">+{{ $curr }} {{ number_format($taxTotal, 2) }}</td>
                    </tr>
                    @endif
                    @if($shipping > 0)
                    <tr>
                        <td class="totals-label">Shipping:</td>
                        <td class="totals-value">+{{ $curr }} {{ number_format($shipping, 2) }}</td>
                    </tr>
                    @endif
                    <tr class="grand-total-row">
                        <td class="totals-label">Total:</td>
                        <td class="totals-value">{{ $curr }} {{ number_format($grandTotal, 2) }}</td>
                    </tr>
                    @if($paid > 0)
                    <tr>
                        <td class="totals-label">Amount Paid:</td>
                        <td class="totals-value">-{{ $curr }} {{ number_format($paid, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="totals-label" style="font-weight: bold; color: {{ $accent }};">Balance Due:</td>
                        <td class="totals-value" style="font-weight: bold; color: {{ $accent }};">{{ $curr }} {{ number_format($balance, 2) }}</td>
                    </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- Notes & Terms -->
    @if(!empty($invoice['notes']) || !empty($invoice['terms']))
        <div class="notes-box">
            @if(!empty($invoice['notes']))
                <div><strong>Notes:</strong> {{ $invoice['notes'] }}</div>
            @endif
            @if(!empty($invoice['terms']))
                <div style="margin-top: 4px;"><strong>Terms & Conditions:</strong> {{ $invoice['terms'] }}</div>
            @endif
        </div>
    @endif

    <!-- Signatures -->
    @php
        $showPrepare = ($invoice['show_sig_prepare'] ?? true) && (!empty($invoice['sig_prepare_name']) || !empty($invoice['sig_prepare_image']) || !empty($invoice['sig_prepare_date']));
        $showApprove = ($invoice['show_sig_approve'] ?? true) && (!empty($invoice['sig_approve_name']) || !empty($invoice['sig_approve_image']) || !empty($invoice['sig_approve_date']) || !empty($invoice['signature_name']));
        $showCustomer = ($invoice['show_sig_customer'] ?? true) && (!empty($invoice['sig_customer_name']) || !empty($invoice['sig_customer_image']) || !empty($invoice['sig_customer_date']));
        $hasAnySigner = $showPrepare || $showApprove || $showCustomer;
    @endphp

    @if($hasAnySigner)
        <table class="signatures-table">
            <tr>
                <!-- PREPARED BY: Automatically sticks at left side -->
                <td class="signature-cell signature-cell-left" style="width: 33.33%;">
                    @if($showPrepare)
                        <div class="sig-block-wrap">
                            @if(!empty($invoice['sig_prepare_image']))
                                <div><img src="{{ $invoice['sig_prepare_image'] }}" class="sig-img" alt="Prepared Signature"></div>
                            @endif
                            <div class="sig-line">
                                <div class="sig-name">{{ $invoice['sig_prepare_name'] ?: '( Authorized Signer )' }}</div>
                                <div class="sig-role">Prepared By</div>
                                @if(!empty($invoice['sig_prepare_date']))
                                    <div class="sig-date">Date: {{ $invoice['sig_prepare_date'] }}</div>
                                @endif
                            </div>
                        </div>
                    @endif
                </td>

                <!-- APPROVED BY: Automatically sticks at center -->
                <td class="signature-cell signature-cell-center" style="width: 33.34%;">
                    @if($showApprove)
                        @php
                            $approveImg = $invoice['sig_approve_image'] ?? '';
                            $approveName = $invoice['sig_approve_name'] ?? $invoice['signature_name'] ?? '';
                            $approveDate = $invoice['sig_approve_date'] ?? '';
                        @endphp
                        <div class="sig-block-wrap">
                            @if(!empty($approveImg))
                                <div><img src="{{ $approveImg }}" class="sig-img" alt="Approved Signature"></div>
                            @endif
                            <div class="sig-line">
                                <div class="sig-name">{{ $approveName ?: '( Authorized Signer )' }}</div>
                                <div class="sig-role">Approved By</div>
                                @if(!empty($approveDate))
                                    <div class="sig-date">Date: {{ $approveDate }}</div>
                                @endif
                            </div>
                        </div>
                    @endif
                </td>

                <!-- CUSTOMER ACCEPTANCE: Automatically sticks at right side -->
                <td class="signature-cell signature-cell-right" style="width: 33.33%;">
                    @if($showCustomer)
                        <div class="sig-block-wrap">
                            @if(!empty($invoice['sig_customer_image']))
                                <div><img src="{{ $invoice['sig_customer_image'] }}" class="sig-img" alt="Customer Acceptance"></div>
                            @endif
                            <div class="sig-line">
                                <div class="sig-name">{{ $invoice['sig_customer_name'] ?: '( Customer Acceptance )' }}</div>
                                <div class="sig-role">Customer Acceptance</div>
                                @if(!empty($invoice['sig_customer_date']))
                                    <div class="sig-date">Date: {{ $invoice['sig_customer_date'] }}</div>
                                @endif
                            </div>
                        </div>
                    @endif
                </td>
            </tr>
        </table>
    @endif

</body>
</html>
