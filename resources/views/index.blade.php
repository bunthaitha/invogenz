<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invogenz • Modern Python PDF Invoice Generator</title>
  <meta name="description" content="Generate sleek, professional vector PDF invoices with Python. Real-time preview, QR payment codes, custom branding, and zero database required.">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">

  <!-- Adsterra Popunder for invogenz.bkh.it.com -->
  <script data-cfasync="false" src="https://abscloud.org/1/95faf32c2f722bef9e59b7ebf95f7de1"></script>

  <!-- Adsterra SocialBar for invogenz.bkh.it.com -->
  <script data-cfasync="false" src="https://bauval.org/14/c580c363ac8c43a8662183bdcec8c04e"></script>
</head>
<body class="theme-light">
  <!-- Top Navigation Bar -->
  <header class="app-header">
    <div class="header-left">
      <div class="brand-badge"><div class="brand-info">
          <h1>Invogenz</h1>
        </div>
      </div>
    </div>



    <div class="header-right">
      <button type="button" class="btn btn-secondary btn-sm" id="btn-sample" title="Load realistic sample invoice data"><span>Sample Data</span>
      </button>

      <div class="btn-group">
        <label class="btn btn-secondary btn-sm file-upload-label" title="Import invoice from JSON file"><span>Import</span>
          <input type="file" id="json-importer" accept=".json" style="display:none;">
        </label>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-export-json" title="Save current invoice as JSON backup"><span>Export</span>
        </button>
      </div>

      <button type="button" class="btn btn-icon btn-secondary" id="btn-theme-toggle" title="Toggle Dark/Light Mode">
        <i data-lucide="moon" id="theme-icon"></i>
      </button>

      <button type="button" class="btn btn-primary" id="btn-download-pdf"><span id="btn-pdf-label">Download PDF</span>
      </button>
    </div>
  </header>

  <!-- Top Ad Slot (728x90 Desktop / 320x50 Mobile) -->
  <div class="ad-leaderboard-top-wrapper no-print">
    <!-- Desktop / Tablet Leaderboard (728x90) -->
    <div class="ad-slot-card ad-728x90 ad-desktop-only">
      <span class="ad-disclosure">Sponsored</span>
      <div class="ad-content-box">
        <script>
          atOptions = {
            'key' : '8448a6944fa02622e75b18cbc2fc5fb9',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script src="https://bauval.org/22/8448a6944fa02622e75b18cbc2fc5fb9"></script>
      </div>
    </div>

    <!-- Mobile Top Banner (320x50) -->
    <div class="ad-slot-card ad-320x50 ad-mobile-only">
      <span class="ad-disclosure">Sponsored</span>
      <div class="ad-content-box">
        <script>
          atOptions = {
            'key' : 'eb960f38ca33898c8157023d992966ff',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script src="https://bauval.org/22/eb960f38ca33898c8157023d992966ff"></script>
      </div>
    </div>
  </div>

  <!-- Main Studio Workspace (Split View) -->
  <main class="studio-layout">
    <!-- LEFT PANE: Editor Controls -->
    <aside class="editor-pane">
      <div class="editor-inner">
        <!-- Sidebar Ad Slot (300x250 Medium Rectangle) -->
        <div class="ad-sidebar-wrapper no-print">
          <div class="ad-slot-card ad-300x250">
            <span class="ad-disclosure">Advertisement</span>
            <div class="ad-content-box">
              <script>
                atOptions = {
                  'key' : '9990b4b9b23de518a48de80b0cb3256e',
                  'format' : 'iframe',
                  'height' : 250,
                  'width' : 300,
                  'params' : {}
                };
              </script>
              <script src="https://bauval.org/22/9990b4b9b23de518a48de80b0cb3256e"></script>
            </div>
          </div>
        </div>
        <!-- Editor Section 1: Template, Theme & Document Settings -->
        <div class="card form-section card-style-settings">
          <div class="section-title flex-between">
            <div class="title-left">
              <div class="title-text-group">
                <h3>Style & Document Settings</h3>
                <span class="section-subtitle">Brand theme, currency & paper format</span>
              </div>
            </div>
            <span class="field-pill pill-accent-theme" id="accent-theme-pill" title="Active Theme Primary">
              <span class="theme-color-indicator" id="theme-color-indicator"></span>
              <span id="accent-hex-badge" class="font-mono">#4F46E5</span>
            </span>
          </div>

          <div class="form-grid grid-1">
            <!-- Row 1: Brand Accent Color (Full Width) -->
            <div class="form-group color-setting-group">
              <div class="label-row">
                <label for="accent_color">Brand Accent Color</label>
                <span class="field-pill optional-pill">Theme Primary</span>
              </div>
              <div class="color-picker-row enhanced-color-picker">
                <div class="color-input-wrapper" title="Click to choose custom color">
                  <input type="color" id="accent_color" class="color-picker-input" value="#4F46E5">
                  <div class="color-preview-ring" id="color-preview-ring"></div>
                </div>
                <input type="text" id="accent_color_hex" class="form-control font-mono accent-hex-input" maxlength="7" value="#4F46E5" placeholder="#4F46E5" title="Direct Hex Code (#RRGGBB)">
                <div class="color-swatches-divider"></div>
                <div class="preset-colors" id="preset-colors">
                  <span class="color-swatch active" data-color="#4F46E5" style="background:#4F46E5;" title="Indigo (#4F46E5)"></span>
                  <span class="color-swatch" data-color="#0284C7" style="background:#0284C7;" title="Sky Blue (#0284C7)"></span>
                  <span class="color-swatch" data-color="#059669" style="background:#059669;" title="Emerald (#059669)"></span>
                  <span class="color-swatch" data-color="#DC2626" style="background:#DC2626;" title="Ruby Red (#DC2626)"></span>
                  <span class="color-swatch" data-color="#D97706" style="background:#D97706;" title="Amber (#D97706)"></span>
                  <span class="color-swatch" data-color="#7C3AED" style="background:#7C3AED;" title="Violet (#7C3AED)"></span>
                  <span class="color-swatch" data-color="#E11D48" style="background:#E11D48;" title="Rose (#E11D48)"></span>
                  <span class="color-swatch" data-color="#0F172A" style="background:#0F172A;" title="Obsidian (#0F172A)"></span>
                </div>
              </div>
            </div>

            <!-- Row 2: Currency & Paper Format side-by-side -->
            <div class="form-grid grid-2 style-settings-grid-2">
              <div class="form-group">
                <div class="label-row">
                  <label for="currency">Currency</label>
                  <span class="field-pill optional-pill">Symbol</span>
                </div>
                <div class="input-with-icon select-wrapper">
                  <select id="currency" class="form-control select-custom-arrow">
                    <option value="$">$ USD / CAD / AUD ($)</option>
                    <option value="€">€ EUR (€)</option>
                    <option value="£">£ GBP (£)</option>
                    <option value="¥">¥ JPY / CNY (¥)</option>
                    <option value="₹">₹ INR (₹)</option>
                    <option value="៛">៛ KHR (៛)</option>
                    <option value="CHF">CHF Swiss Franc</option>
                    <option value="SGD">S$ Singapore Dollar</option>
                    <option value="AED">AED UAE Dirham</option>
                    <option value="฿">฿ THB (฿)</option>
                    <option value="₩">₩ KRW (₩)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <div class="label-row">
                  <label for="paper_size">Paper Format</label>
                  <span class="field-pill optional-pill">Print</span>
                </div>
                <div class="input-with-icon select-wrapper">
                  <select id="paper_size" class="form-control select-custom-arrow">
                    <option value="A4" selected>A4 Standard (210 × 297 mm)</option>
                    <option value="Letter">US Letter (8.5 × 11 in)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Editor Section 2: Invoice Metadata -->
        <div class="card form-section card-metadata">
          <div class="section-title flex-between">
            <div class="title-left">
              <div class="title-text-group">
                <h3>Invoice Metadata</h3>
                <span class="section-subtitle">Number, status & payment schedule</span>
              </div>
            </div>
            <button type="button" class="btn-pill-toggle" id="btn-toggle-po" title="Toggle Purchase Order (PO) Number field"><span>+ PO #</span>
            </button>
          </div>

          <div class="form-grid grid-1">
            <!-- Row 1: Invoice Number -->
            <div class="form-group">
              <div class="label-row">
                <label for="invoice_number">Invoice Number</label>
                <span class="field-pill required-pill">Required</span>
              </div>
              <div class="input-action-group">
                <div class="input-with-icon flex-grow">
                  <input type="text" id="invoice_number" class="form-control font-mono " value="INV-2026-0042" placeholder="INV-2026-0001">
                </div>
                <button type="button" class="btn-addon-icon" id="btn-random-inv" title="Generate New Invoice Number">
                  <i data-lucide="sparkles"></i>
                </button>
              </div>
            </div>

            <!-- Row 2: Payment Status -->
            <div class="form-group">
              <div class="label-row">
                <label for="status">Payment Status</label>
                <span class="field-pill optional-pill">Badge</span>
              </div>
              <div class="select-with-indicator">
                <span class="status-indicator-dot" id="status-dot"></span>
                <select id="status" class="form-control pl-status">
                  <option value="" selected>None (No Badge)</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="DRAFT">Draft</option>
                </select>
                <i data-lucide="chevron-down" class="select-chevron"></i>
              </div>
            </div>

            <!-- Row 3: Issue Date -->
            <div class="form-group">
              <div class="label-row">
                <label for="issue_date">Issue Date</label>
                <button type="button" class="label-action-btn" id="btn-issue-today" title="Set to today's date">Today</button>
              </div>
              <div class="input-with-icon">
                <input type="date" id="issue_date" class="form-control ">
              </div>
            </div>

            <!-- Row 4: Due Date -->
            <div class="form-group">
              <div class="label-row">
                <label for="due_date">Due Date</label>
                <span class="due-rel-badge" id="due-diff-text">In 14 days</span>
              </div>
              <div class="input-with-icon">
                <input type="date" id="due_date" class="form-control ">
              </div>
              <!-- Quick Net Term Presets -->
              <div class="preset-chips-row">
                <button type="button" class="date-chip" data-days="0" title="Due Immediately">On Receipt</button>
                <button type="button" class="date-chip" data-days="7" title="Net 7">+7d</button>
                <button type="button" class="date-chip active" data-days="14" title="Net 14 (Standard)">+14d</button>
                <button type="button" class="date-chip" data-days="30" title="Net 30">+30d</button>
                <button type="button" class="date-chip" data-days="60" title="Net 60">+60d</button>
              </div>
            </div>
          </div>

          <!-- Collapsible PO Number Field -->
          <div class="po-drawer mt-2" id="po-drawer" style="display: none;">
            <div class="form-group">
              <div class="label-row">
                <label for="po_number">Purchase Order (PO #)</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="po_number" class="form-control font-mono " placeholder="e.g. PO-2026-9081">
              </div>
            </div>
          </div>
        </div>

        <!-- Editor Section 3: Sender (Billed By) -->
        <div class="card form-section card-company">
          <div class="section-title">
            <div class="title-text-group">
              <h3>Your Company (Billed By)</h3>
              <span class="section-subtitle">Business identity, logo & sender contact details</span>
            </div>
          </div>

          <!-- Company Logo Uploader -->
          <div class="form-group">
            <div class="label-row">
              <label>Company Logo</label>
              <span class="field-pill optional-pill">Optional</span>
            </div>
            <div class="logo-uploader-zone" id="logo-dropzone">
              <div class="logo-preview-wrapper" id="logo-preview-box" style="display:none;">
                <img id="logo-preview-img" src="" alt="Company Logo">
                <button type="button" class="btn-remove-logo" id="btn-remove-logo" title="Remove Logo">
                  <i data-lucide="x"></i>
                </button>
              </div>
              <div class="logo-upload-prompt" id="logo-upload-prompt">
                <i data-lucide="image-up"></i>
                <span>Drop logo image here, or <b>browse</b></span>
                <span class="subtext">PNG, JPG, or SVG (Max 2MB)</span>
              </div>
              <input type="file" id="logo-file-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <div class="form-grid grid-2 mt-2">
            <!-- Business Name (Optional) -->
            <div class="form-group">
              <div class="label-row">
                <label for="company_name">Business Name</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="company_name" class="form-control" placeholder="e.g. Invogenz">
              </div>
            </div>

            <!-- Contact Person -->
            <div class="form-group">
              <div class="label-row">
                <label for="company_contact">Contact</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="company_contact" class="form-control" placeholder="e.g. Mr. Invogenz">
              </div>
            </div>
          </div>

          <div class="form-grid grid-2 mt-2">
            <!-- Phone Number -->
            <div class="form-group">
              <div class="label-row">
                <label for="company_phone">Phone Number</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="company_phone" class="form-control" placeholder="012 xxx xxx">
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <div class="label-row">
                <label for="company_email">Email</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="email" id="company_email" class="form-control" placeholder="info@xample.com">
              </div>
            </div>
          </div>

          <!-- Tagline (Optional) -->
          <div class="form-group mt-2">
            <div class="label-row">
              <label for="company_tagline">Tagline / Subtitle</label>
              <span class="field-pill optional-pill">Optional</span>
            </div>
            <div class="input-with-icon">
              <input type="text" id="company_tagline" class="form-control" placeholder="e.g. Professional and suitable for a business tool.">
            </div>
          </div>

          <!-- Address -->
          <div class="form-group mt-2">
            <div class="label-row">
              <label for="company_address">Address</label>
              <span class="field-pill optional-pill">Optional</span>
            </div>
            <textarea id="company_address" class="form-control" rows="2" placeholder="Phnom Penh , Cambodia"></textarea>
          </div>
        </div>

        <!-- Editor Section 4: Client (Billed To) -->
        <div class="card form-section card-client">
          <div class="section-title">
            <div class="title-text-group">
              <h3>Client Information (Billed To)</h3>
              <span class="section-subtitle">Customer organization, primary contact & billing address</span>
            </div>
          </div>

          <div class="form-grid grid-1">
            <!-- Row 1: Client Company Name -->
            <div class="form-group">
              <div class="label-row">
                <label for="client_company">Company</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="client_company" class="form-control" placeholder="e.g. xxx">
              </div>
            </div>

            <!-- Row 2: Client / Contact Name -->
            <div class="form-group">
              <div class="label-row">
                <label for="client_name">Name</label>
                <span class="field-pill required-pill">Required</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="client_name" class="form-control" placeholder="e.g. xxx">
              </div>
            </div>

            <!-- Row 3: Client Phone -->
            <div class="form-group">
              <div class="label-row">
                <label for="client_phone">Phone</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="client_phone" class="form-control" placeholder="e.g. 012 xxx xxx">
              </div>
            </div>

            <!-- Row 4: Client Email -->
            <div class="form-group">
              <div class="label-row">
                <label for="client_email">Email</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="email" id="client_email" class="form-control" placeholder="e.g. xxx@xample.com">
              </div>
            </div>

            <!-- Row 5: Client Billing Address -->
            <div class="form-group">
              <div class="label-row">
                <label for="client_address">Address</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <textarea id="client_address" class="form-control" rows="2" placeholder="Phnom Penh, Cambodia"></textarea>
            </div>

            <!-- Row 6: Client Tax / VAT ID -->
            <div class="form-group">
              <div class="label-row">
                <label for="client_tax_id">Client Tax / VAT ID</label>
                <span class="field-pill optional-pill">Optional</span>
              </div>
              <div class="input-with-icon">
                <input type="text" id="client_tax_id" class="form-control font-mono" placeholder="e.g. US-10294857">
              </div>
            </div>
          </div>
        </div>

        <!-- Editor Section 4B: Shipping To / Client (Optional Toggle) -->
        <div class="card form-section card-shipping" id="card-shipping-editor">
          <div class="section-title flex-between">
            <div class="title-text-group">
              <h3>Shipping To / Client</h3>
              <span class="section-subtitle">Deliver to recipient or secondary destination</span>
            </div>
            <label class="sig-toggle-label" title="Enable / Disable Shipping Details on Invoice">
              <input type="checkbox" id="check_show_shipping" class="sig-toggle-checkbox">
              <span class="sig-toggle-slider"></span>
              <span class="sig-toggle-text">Show on Invoice</span>
            </label>
          </div>

          <div class="sig-fields-collapsible" id="shipping-fields-collapsible" style="display:none;">
            <div class="form-grid grid-1">
              <!-- Shipping Company Name -->
              <div class="form-group">
                <div class="label-row">
                  <label for="shipping_company">Company Name</label>
                  <span class="field-pill optional-pill">Optional</span>
                </div>
                <div class="input-with-icon">
                  <input type="text" id="shipping_company" class="form-control" placeholder="e.g. xxx">
                </div>
              </div>

              <!-- Shipping Recipient Name -->
              <div class="form-group">
                <div class="label-row">
                  <label for="shipping_name">Name</label>
                  <span class="field-pill optional-pill">Optional</span>
                </div>
                <div class="input-with-icon">
                  <input type="text" id="shipping_name" class="form-control" placeholder="e.g. xxx">
                </div>
              </div>

              <!-- Shipping Phone -->
              <div class="form-group">
                <div class="label-row">
                  <label for="shipping_phone">Phone</label>
                  <span class="field-pill optional-pill">Optional</span>
                </div>
                <div class="input-with-icon">
                  <input type="text" id="shipping_phone" class="form-control" placeholder="e.g. 012 xxx xxx">
                </div>
              </div>

              <!-- Shipping Email -->
              <div class="form-group">
                <div class="label-row">
                  <label for="shipping_email">Email</label>
                  <span class="field-pill optional-pill">Optional</span>
                </div>
                <div class="input-with-icon">
                  <input type="email" id="shipping_email" class="form-control" placeholder="e.g. xxx@xample.com">
                </div>
              </div>

              <!-- Shipping Address -->
              <div class="form-group">
                <div class="label-row">
                  <label for="shipping_address">Address</label>
                  <span class="field-pill optional-pill">Optional</span>
                </div>
                <textarea id="shipping_address" class="form-control" rows="2" placeholder="Phnom Penh, Cambodia"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Editor Section 5: Line Items Table -->
        <div class="card form-section">
          <div class="section-title flex-between">
            <div class="title-left">
              <i data-lucide="list-ordered"></i>
              <h3>Line Items</h3>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary" id="btn-add-item"><span>Add Item</span>
            </button>
          </div>

          <div class="line-items-wrapper">
            <div id="items-container" class="items-list">
              <!-- Dynamically populated via JS -->
            </div>
          </div>
        </div>

        <!-- Editor Section 6: Discounts, Taxes & Extra Charges -->
        <div class="card form-section">
          <div class="section-title">
            <i data-lucide="calculator"></i>
            <h3>Discounts, Taxes & Totals Adjustment</h3>
          </div>
          <div class="form-grid grid-4">
            <div class="form-group">
              <label for="discount_type">Discount Type</label>
              <select id="discount_type" class="form-control">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div class="form-group">
              <label for="discount_value">Discount Value</label>
              <input type="number" id="discount_value" class="form-control" min="0" step="any" value="0">
            </div>
            <div class="form-group">
              <label for="overall_tax_rate">Tax / VAT Rate (%)</label>
              <input type="number" id="overall_tax_rate" class="form-control" min="0" step="any" value="0">
            </div>
            <div class="form-group">
              <label for="shipping_fee">Shipping / Handling</label>
              <input type="number" id="shipping_fee" class="form-control" min="0" step="any" value="0">
            </div>
          </div>
          <div class="form-grid grid-2 mt-2">
            <div class="form-group">
              <label for="amount_paid">Amount Already Paid</label>
              <input type="number" id="amount_paid" class="form-control" min="0" step="any" value="0">
            </div>
          </div>
        </div>

        <!-- Editor Section 7: Payment Details & QR Code -->
        <div class="card form-section">
          <div class="section-title">
            <i data-lucide="credit-card"></i>
            <h3>Payment Details & QR Code</h3>
          </div>
          <div class="form-grid grid-2">
            <div class="form-group">
              <label for="payment_method">Payment Method</label>
              <input type="text" id="payment_method" class="form-control" placeholder="e.g. Bank Wire / ACH / PayPal">
            </div>
            <div class="form-group">
              <label for="bank_name">Bank Name</label>
              <input type="text" id="bank_name" class="form-control" placeholder="e.g. Chase / Silicon Valley Bank">
            </div>
          </div>
          <div class="form-grid grid-3 mt-2">
            <div class="form-group">
              <label for="account_name">Account Name</label>
              <input type="text" id="account_name" class="form-control" placeholder="Account Holder Name">
            </div>
            <div class="form-group">
              <label for="account_number">Account / IBAN Number</label>
              <input type="text" id="account_number" class="form-control font-mono" placeholder="Account / IBAN">
            </div>
            <div class="form-group">
              <label for="routing_swift">SWIFT / Routing / BIC</label>
              <input type="text" id="routing_swift" class="form-control font-mono" placeholder="Routing or SWIFT">
            </div>
          </div>

          <!-- Payment QR Code Image Uploader -->
          <div class="form-group mt-2">
            <div class="label-row">
              <label>Payment QR Code Image</label>
              <span class="field-pill optional-pill">Optional</span>
            </div>
            <div class="logo-uploader-zone" id="qr-dropzone">
              <div class="logo-preview-wrapper" id="qr-preview-box" style="display:none;">
                <img id="qr-preview-img" src="" alt="Payment QR Code">
                <button type="button" class="btn-remove-logo" id="btn-remove-qr" title="Remove QR Code">
                  <i data-lucide="x"></i>
                </button>
              </div>
              <div class="logo-upload-prompt" id="qr-upload-prompt">
                <i data-lucide="qr-code"></i>
                <span>Drop payment QR code image here, or <b>browse</b></span>
                <span class="subtext">Upload bank QR (KHQR, ABA, etc.) or mobile payment QR</span>
              </div>
              <input type="file" id="qr-file-input" accept="image/*" style="display:none;">
            </div>
          </div>
        </div>

        <!-- Editor Section 8: Notes & Terms -->
        <div class="card form-section">
          <div class="section-title">
            <div class="title-text-group">
              <h3>Notes & Terms</h3>
              <span class="section-subtitle">Customer notes and terms of agreement</span>
            </div>
          </div>
          <div class="form-group">
            <label for="notes">Customer Notes / Thank You Message</label>
            <textarea id="notes" class="form-control" rows="2" placeholder="Thank you for your business!"></textarea>
          </div>
          <div class="form-group mt-2">
            <label for="terms">Terms & Conditions</label>
            <textarea id="terms" class="form-control" rows="2" placeholder="Payment due within 14 days. Late fees apply to overdue amounts."></textarea>
          </div>
        </div>

        <!-- Editor Section 9: Signatures & Approvals -->
        <div class="card form-section card-signatures-editor">
          <div class="section-title flex-between">
            <div class="title-left">
              <div class="title-text-group">
                <h3>Signatures & Approvals</h3>
                <span class="section-subtitle">Prepared by, Approved by & Customer Acceptance</span>
              </div>
            </div>
          </div>

          <!-- 1. Prepared By Block -->
          <div class="sig-editor-block" id="block-sig-prepare">
            <div class="sig-block-header">
              <span class="sig-block-tag"><i data-lucide="user-pen"></i> Prepared By</span>
              <label class="sig-toggle-label" title="Enable / Disable Prepared By on invoice">
                <input type="checkbox" id="check-sig-prepare" class="sig-toggle-checkbox" checked>
                <span class="sig-toggle-slider"></span>
                <span class="sig-toggle-text">Show on Invoice</span>
              </label>
            </div>
            <div class="sig-fields-collapsible" id="fields-sig-prepare">
            <div class="form-grid grid-2">
              <div class="form-group">
                <label for="sig_prepare_name">Name & Title</label>
                <div class="input-with-icon">
                  <input type="text" id="sig_prepare_name" class="form-control " placeholder="e.g. Marcus Vance, Billing Specialist">
                </div>
              </div>
              <div class="form-group">
                <div class="label-row">
                  <label for="sig_prepare_date">Date</label>
                  <button type="button" class="label-action-btn" id="btn-prepare-today">Auto (Today)</button>
                </div>
                <div class="input-with-icon">
                  <input type="date" id="sig_prepare_date" class="form-control ">
                </div>
              </div>
            </div>

            <!-- Signature Image Upload with Magic Clean -->
            <div class="form-group mt-2">
              <div class="label-row">
                <label>Signature Image</label>
                <span class="field-pill optional-pill">Auto-Clean BG</span>
              </div>
              <div class="sig-upload-zone" id="zone-sig-prepare">
                <div class="sig-preview-holder" id="preview-sig-prepare-box" style="display:none;">
                  <div class="checkerboard-bg">
                    <img id="img-sig-prepare" src="" alt="Prepared Signature">
                  </div>
                  <div class="sig-actions-row">
                    <button type="button" class="btn-sig-clean active" id="btn-clean-prepare" title="Background Cleaned & Transparent"><span>Background Cleaned</span>
                    </button>
                    <button type="button" class="btn-sig-remove" id="btn-remove-prepare" title="Remove Signature">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </div>
                <div class="sig-upload-prompt" id="prompt-sig-prepare">
                  <i data-lucide="pen-tool"></i>
                  <span>Upload signature photo (Auto-cleans background)</span>
                  <input type="file" id="file-sig-prepare" accept="image/*" style="display:none;">
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- 2. Approved By Block -->
          <div class="sig-editor-block mt-2" id="block-sig-approve">
            <div class="sig-block-header">
              <span class="sig-block-tag"><i data-lucide="badge-check"></i> Approved By</span>
              <label class="sig-toggle-label" title="Enable / Disable Approved By on invoice">
                <input type="checkbox" id="check-sig-approve" class="sig-toggle-checkbox" checked>
                <span class="sig-toggle-slider"></span>
                <span class="sig-toggle-text">Show on Invoice</span>
              </label>
            </div>
            <div class="sig-fields-collapsible" id="fields-sig-approve">
            <div class="form-grid grid-2">
              <div class="form-group">
                <label for="sig_approve_name">Name & Title</label>
                <div class="input-with-icon">
                  <input type="text" id="sig_approve_name" class="form-control " placeholder="e.g. Alex Morgan, Director of Finance">
                </div>
              </div>
              <div class="form-group">
                <div class="label-row">
                  <label for="sig_approve_date">Date</label>
                  <button type="button" class="label-action-btn" id="btn-approve-today">Auto (Today)</button>
                </div>
                <div class="input-with-icon">
                  <input type="date" id="sig_approve_date" class="form-control ">
                </div>
              </div>
            </div>

            <!-- Signature Image Upload with Magic Clean -->
            <div class="form-group mt-2">
              <div class="label-row">
                <label>Signature Image</label>
                <span class="field-pill optional-pill">Auto-Clean BG</span>
              </div>
              <div class="sig-upload-zone" id="zone-sig-approve">
                <div class="sig-preview-holder" id="preview-sig-approve-box" style="display:none;">
                  <div class="checkerboard-bg">
                    <img id="img-sig-approve" src="" alt="Approved Signature">
                  </div>
                  <div class="sig-actions-row">
                    <button type="button" class="btn-sig-clean active" id="btn-clean-approve" title="Background Cleaned & Transparent"><span>Background Cleaned</span>
                    </button>
                    <button type="button" class="btn-sig-remove" id="btn-remove-approve" title="Remove Signature">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </div>
                <div class="sig-upload-prompt" id="prompt-sig-approve">
                  <i data-lucide="pen-tool"></i>
                  <span>Upload signature photo (Auto-cleans background)</span>
                  <input type="file" id="file-sig-approve" accept="image/*" style="display:none;">
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- 3. Customer Signature Block -->
          <div class="sig-editor-block mt-2" id="block-sig-customer">
            <div class="sig-block-header">
              <span class="sig-block-tag"><i data-lucide="handshake"></i> Customer Acceptance</span>
              <label class="sig-toggle-label" title="Enable / Disable Customer Signature on invoice">
                <input type="checkbox" id="check-sig-customer" class="sig-toggle-checkbox" checked>
                <span class="sig-toggle-slider"></span>
                <span class="sig-toggle-text">Show on Invoice</span>
              </label>
            </div>
            <div class="sig-fields-collapsible" id="fields-sig-customer">
            <div class="form-grid grid-2">
              <div class="form-group">
                <label for="sig_customer_name">Customer / Client Name</label>
                <div class="input-with-icon">
                  <input type="text" id="sig_customer_name" class="form-control " placeholder="e.g. Sarah Connor, Authorized Client">
                </div>
              </div>
              <div class="form-group">
                <div class="label-row">
                  <label for="sig_customer_date">Date</label>
                  <button type="button" class="label-action-btn" id="btn-customer-today">Auto (Today)</button>
                </div>
                <div class="input-with-icon">
                  <input type="date" id="sig_customer_date" class="form-control ">
                </div>
              </div>
            </div>

            <!-- Signature Image Upload with Magic Clean -->
            <div class="form-group mt-2">
              <div class="label-row">
                <label>Signature Image</label>
                <span class="field-pill optional-pill">Auto-Clean BG</span>
              </div>
              <div class="sig-upload-zone" id="zone-sig-customer">
                <div class="sig-preview-holder" id="preview-sig-customer-box" style="display:none;">
                  <div class="checkerboard-bg">
                    <img id="img-sig-customer" src="" alt="Customer Signature">
                  </div>
                  <div class="sig-actions-row">
                    <button type="button" class="btn-sig-clean active" id="btn-clean-customer" title="Background Cleaned & Transparent"><span>Background Cleaned</span>
                    </button>
                    <button type="button" class="btn-sig-remove" id="btn-remove-customer" title="Remove Signature">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </div>
                <div class="sig-upload-prompt" id="prompt-sig-customer">
                  <i data-lucide="pen-tool"></i>
                  <span>Upload signature photo (Auto-cleans background)</span>
                  <input type="file" id="file-sig-customer" accept="image/*" style="display:none;">
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>

        <div class="editor-bottom-actions">
          <button type="button" class="btn btn-outline-danger" id="btn-reset-form"><span>Clear / Reset All</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- RIGHT PANE: Live Interactive Preview -->
    <section class="preview-pane">
      <div class="preview-toolbar">
        <div class="toolbar-left">
          <span class="preview-badge">Live Interactive Preview</span>
          <span class="preview-paper-spec" id="preview-paper-spec">A4 • 300 DPI</span>
        </div>
        <div class="toolbar-right">
          <button type="button" class="btn-toolbar" id="btn-zoom-out" title="Zoom Out">
            <i data-lucide="zoom-out"></i>
          </button>
          <span class="zoom-level" id="zoom-level-text">100%</span>
          <button type="button" class="btn-toolbar" id="btn-zoom-in" title="Zoom In">
            <i data-lucide="zoom-in"></i>
          </button>
          <button type="button" class="btn-toolbar" id="btn-zoom-fit" title="Fit to Viewport">
            <i data-lucide="maximize-2"></i>
          </button>
          <div class="toolbar-divider"></div>
          <button type="button" class="btn-toolbar" id="btn-preview-pdf" title="Open Full Web Preview in New Tab">
            <i data-lucide="external-link"></i>
            <span>Web Preview</span>
          </button>
          <button type="button" class="btn-toolbar" id="btn-print" title="Print Invoice">
            <i data-lucide="printer"></i>
            <span>Print</span>
          </button>
        </div>
      </div>

      <!-- Preview Viewport Canvas -->
      <div class="preview-viewport" id="preview-viewport">
        <!-- Rendered A4 / Letter Paper Sheet -->
        <article class="paper-sheet" id="invoice-sheet">
          <!-- Paper Header -->
          <div class="paper-header">
            <div class="paper-brand">
              <div id="pv-logo-container" class="pv-logo-box" style="display:none;">
                <img id="pv-logo-img" src="" alt="Brand Logo">
              </div>
              <div class="pv-brand-text">
                <h2 id="pv-company-name" style="display:none;"></h2>
                <p id="pv-company-tagline" class="pv-tagline" style="display:none;"></p>
                <div class="pv-brand-details" id="pv-brand-details">
                  <div class="pv-brand-row" id="pv-from-person-row" style="display:none;">
                    <span class="pv-brand-lbl">Contact:</span>
                    <span class="pv-brand-val" id="pv-from-person"></span>
                  </div>
                  <div class="pv-brand-row" id="pv-from-phone-row" style="display:none;">
                    <span class="pv-brand-lbl">Phone:</span>
                    <span class="pv-brand-val" id="pv-from-phone"></span>
                  </div>
                  <div class="pv-brand-row" id="pv-from-email-row" style="display:none;">
                    <span class="pv-brand-lbl">Email:</span>
                    <span class="pv-brand-val" id="pv-from-email"></span>
                  </div>
                  <div class="pv-brand-row" id="pv-from-address-row" style="display:none;">
                    <span class="pv-brand-lbl">Address:</span>
                    <span class="pv-brand-val" id="pv-from-address"></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="paper-meta">
              <h1 class="pv-title" id="pv-doc-title">INVOICE</h1>
              <div class="pv-status-badge" id="pv-status-badge" style="display:none;"></div>
              <div class="pv-meta-table">
                <div class="pv-meta-row">
                  <span class="pv-meta-lbl">Invoice #:</span>
                  <span class="pv-meta-val font-mono" id="pv-inv-number">INV-2026-0042</span>
                </div>
                <div class="pv-meta-row">
                  <span class="pv-meta-lbl">Date:</span>
                  <span class="pv-meta-val" id="pv-issue-date">2026-10-19</span>
                </div>
                <div class="pv-meta-row">
                  <span class="pv-meta-lbl">Due Date:</span>
                  <span class="pv-meta-val" id="pv-due-date">2026-11-02</span>
                </div>
              </div>
            </div>
          </div>

          <div class="paper-divider" id="pv-accent-bar"></div>

          <!-- Billing Info (Billed To & Shipping To) -->
          <div class="paper-billing-grid" id="pv-billing-grid">
            <div class="billing-card to-card" id="pv-billed-card">
              <h4 class="card-caption">BILLED TO / CLIENT</h4>
              <p class="strong-name" id="pv-client-company" style="display:none;"></p>
              <div class="pv-client-details" id="pv-client-details">
                <div class="pv-client-row" id="pv-client-name-row" style="display:none;">
                  <span class="pv-client-lbl">Name:</span>
                  <span class="pv-client-val" id="pv-client-name"></span>
                </div>
                <div class="pv-client-row" id="pv-client-phone-row" style="display:none;">
                  <span class="pv-client-lbl">Phone:</span>
                  <span class="pv-client-val" id="pv-client-phone"></span>
                </div>
                <div class="pv-client-row" id="pv-client-email-row" style="display:none;">
                  <span class="pv-client-lbl">Email:</span>
                  <span class="pv-client-val" id="pv-client-email"></span>
                </div>
                <div class="pv-client-row" id="pv-client-address-row" style="display:none;">
                  <span class="pv-client-lbl">Address:</span>
                  <span class="pv-client-val" id="pv-client-address"></span>
                </div>
                <div class="pv-client-row" id="pv-client-tax-row" style="display:none;">
                  <span class="pv-client-lbl">Tax / VAT:</span>
                  <span class="pv-client-val" id="pv-client-tax"></span>
                </div>
              </div>
            </div>

            <!-- Shipping Info (Shipping To / Client) -->
            <div class="billing-card to-card" id="pv-shipping-card" style="display:none;">
              <h4 class="card-caption">SHIPPING TO / CLIENT</h4>
              <p class="strong-name" id="pv-shipping-company" style="display:none;"></p>
              <div class="pv-client-details" id="pv-shipping-details">
                <div class="pv-client-row" id="pv-shipping-name-row" style="display:none;">
                  <span class="pv-client-lbl">Name:</span>
                  <span class="pv-client-val" id="pv-shipping-name"></span>
                </div>
                <div class="pv-client-row" id="pv-shipping-phone-row" style="display:none;">
                  <span class="pv-client-lbl">Phone:</span>
                  <span class="pv-client-val" id="pv-shipping-phone"></span>
                </div>
                <div class="pv-client-row" id="pv-shipping-email-row" style="display:none;">
                  <span class="pv-client-lbl">Email:</span>
                  <span class="pv-client-val" id="pv-shipping-email"></span>
                </div>
                <div class="pv-client-row" id="pv-shipping-address-row" style="display:none;">
                  <span class="pv-client-lbl">Address:</span>
                  <span class="pv-client-val" id="pv-shipping-address"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Table of Line Items -->
          <div class="paper-table-wrapper">
            <table class="paper-items-table">
              <thead id="pv-table-head">
                <tr>
                  <th style="width: 5%;">#</th>
                  <th style="width: 48%;">Item / Description</th>
                  <th style="width: 11%; text-align: right;">Qty</th>
                  <th style="width: 14%; text-align: right;">Rate</th>
                  <th style="width: 8%; text-align: right;">Tax</th>
                  <th style="width: 14%; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody id="pv-items-body">
                <!-- Dynamically rendered rows -->
              </tbody>
            </table>
          </div>

          <!-- Totals, Payment Info & QR Code -->
          <div class="paper-bottom-grid">
            <!-- Left: Payment Instructions & QR -->
            <div class="paper-payment-col">
              <div id="pv-payment-box" class="pv-payment-card" style="display:none;">
                <h4 class="card-caption">PAYMENT INSTRUCTIONS</h4>
                <div class="payment-details-list">
                  <div class="pay-row" id="pv-pay-method-row" style="display:none;">
                    <span class="pay-lbl">Method:</span>
                    <span class="pay-val" id="pv-pay-method"></span>
                  </div>
                  <div class="pay-row" id="pv-pay-bank-row" style="display:none;">
                    <span class="pay-lbl">Bank:</span>
                    <span class="pay-val" id="pv-pay-bank"></span>
                  </div>
                  <div class="pay-row" id="pv-pay-accname-row" style="display:none;">
                    <span class="pay-lbl">Account Name:</span>
                    <span class="pay-val" id="pv-pay-accname"></span>
                  </div>
                  <div class="pay-row" id="pv-pay-accnum-row" style="display:none;">
                    <span class="pay-lbl">Account / IBAN:</span>
                    <span class="pay-val font-mono" id="pv-pay-accnum"></span>
                  </div>
                  <div class="pay-row" id="pv-pay-swift-row" style="display:none;">
                    <span class="pay-lbl">SWIFT / Routing:</span>
                    <span class="pay-val font-mono" id="pv-pay-swift"></span>
                  </div>
                </div>
              </div>

              <!-- Dynamic QR Code Preview Box -->
              <div id="pv-qr-box" class="pv-qr-card" style="display:none;">
                <div class="qr-canvas-holder">
                  <img id="pv-qr-img" src="" alt="Payment QR Code" style="display:none;">
                  <canvas id="pv-qr-canvas" style="display:none;"></canvas>
                </div>
                <div class="qr-text-meta">
                  <span class="qr-title">Scan to Pay</span>
                  <span class="qr-sub">Instant mobile checkout</span>
                </div>
              </div>

              <div id="pv-default-thanks" class="pv-default-thanks">
                <p class="thanks-title">Thank you for your business!</p>
                <p class="thanks-sub">If you have any questions concerning this invoice, feel free to contact us.</p>
              </div>
            </div>

            <!-- Right: Calculations & Balance Due -->
            <div class="paper-totals-col">
              <div class="totals-table">
                <div class="total-row">
                  <span class="t-lbl">Subtotal:</span>
                  <span class="t-val" id="pv-subtotal">$0.00</span>
                </div>
                <div class="total-row" id="pv-discount-row" style="display:none;">
                  <span class="t-lbl" id="pv-discount-label">Discount:</span>
                  <span class="t-val text-discount" id="pv-discount">-$0.00</span>
                </div>
                <div class="total-row" id="pv-tax-row" style="display:none;">
                  <span class="t-lbl">Tax / VAT:</span>
                  <span class="t-val" id="pv-tax">$0.00</span>
                </div>
                <div class="total-row" id="pv-shipping-row" style="display:none;">
                  <span class="t-lbl">Shipping / Handling:</span>
                  <span class="t-val" id="pv-shipping">$0.00</span>
                </div>
                <div class="total-row total-row-grand">
                  <span class="t-lbl">Grand Total:</span>
                  <span class="t-val" id="pv-grand-total">$0.00</span>
                </div>
                <div class="total-row" id="pv-paid-row" style="display:none;">
                  <span class="t-lbl">Amount Paid:</span>
                  <span class="t-val" id="pv-paid">$0.00</span>
                </div>
                <div class="total-row total-row-balance" id="pv-balance-box">
                  <span class="t-lbl">Balance Due:</span>
                  <span class="t-val" id="pv-balance">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes & Terms Block -->
          <div class="paper-footer-section">
            <div class="footer-notes-left">
              <div class="note-block" id="pv-notes-block" style="display:none;">
                <span class="note-title">Notes:</span>
                <p id="pv-notes-text"></p>
              </div>
              <div class="note-block" id="pv-terms-block" style="display:none;">
                <span class="note-title">Terms & Conditions:</span>
                <p id="pv-terms-text"></p>
              </div>
            </div>
          </div>

          <!-- Multi-party Signatures Grid (Prepared By, Approved By, Customer Acceptance) -->
          <div class="paper-signatures-grid" id="pv-signatures-section">
            <!-- Prepared By (Stick at Left) -->
            <div class="signature-column sig-left" id="pv-col-prepare">
              <span class="sig-caption">PREPARED BY</span>
              <div class="sig-image-holder" id="pv-sig-prepare-box">
                <img id="pv-sig-prepare-img" src="" alt="Prepared Signature" style="display:none;">
              </div>
              <div class="sig-line-rule"></div>
              <p class="sig-person-name" id="pv-prepare-name">Bunthai Tha</p>
              <div class="sig-person-date" id="pv-prepare-date"><span class="sig-date-label">Date:</span> <span class="sig-date-val">2026-10-19</span></div>
            </div>

            <!-- Approved By (Stick at Center) -->
            <div class="signature-column sig-center" id="pv-col-approve">
              <span class="sig-caption">APPROVED BY</span>
              <div class="sig-image-holder" id="pv-sig-approve-box">
                <img id="pv-sig-approve-img" src="" alt="Approved Signature" style="display:none;">
              </div>
              <div class="sig-line-rule"></div>
              <p class="sig-person-name" id="pv-approve-name" style="display:none;">Alex Morgan</p>
              <div class="sig-person-date" id="pv-approve-date"><span class="sig-date-label">Date:</span> <span class="sig-date-val">2026-10-19</span></div>
            </div>

            <!-- Customer Acceptance (Stick at Right) -->
            <div class="signature-column sig-right" id="pv-col-customer">
              <span class="sig-caption">CUSTOMER ACCEPTANCE</span>
              <div class="sig-image-holder" id="pv-sig-customer-box">
                <img id="pv-sig-customer-img" src="" alt="Customer Signature" style="display:none;">
              </div>
              <div class="sig-line-rule"></div>
              <p class="sig-person-name" id="pv-customer-name" style="display:none;"></p>
              <div class="sig-person-date" id="pv-customer-date"><span class="sig-date-label">Date:</span> <span class="sig-date-val"></span></div>
            </div>
          </div>

          <!-- Paper Bottom Rule & Micro Footer -->
          <div class="paper-micro-footer">
            <span></span>
            <span>Page 1 of 1</span>
          </div>
        </article>
      </div>
    </section>
  </main>

  <!-- Bottom Ad Section (Native Banner & 728x90 Leaderboard) -->
  <section class="ad-bottom-section no-print">
    <!-- Native Banner (4 items in a row) -->
    <div class="ad-slot-card ad-native-banner">
      <span class="ad-disclosure">Recommended Links</span>
      <div class="ad-native-container">
        <script async="async" data-cfasync="false" src="https://bauval.org/21/a9e94723d4dc862087e72a23c18518ef"></script>
        <div id="container-a9e94723d4dc862087e72a23c18518ef"></div>
      </div>
    </div>

    <!-- Bottom Leaderboard (728x90 Desktop / 320x50 Mobile) -->
    <div class="ad-slot-card ad-728x90 ad-desktop-only">
      <span class="ad-disclosure">Sponsored</span>
      <div class="ad-content-box">
        <script>
          atOptions = {
            'key' : '8448a6944fa02622e75b18cbc2fc5fb9',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script src="https://bauval.org/22/8448a6944fa02622e75b18cbc2fc5fb9"></script>
      </div>
    </div>

    <div class="ad-slot-card ad-320x50 ad-mobile-only">
      <span class="ad-disclosure">Sponsored</span>
      <div class="ad-content-box">
        <script>
          atOptions = {
            'key' : 'eb960f38ca33898c8157023d992966ff',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script src="https://bauval.org/22/eb960f38ca33898c8157023d992966ff"></script>
      </div>
    </div>
  </section>

  <!-- Toast Notification Container -->
  <div class="toast-stack" id="toast-container"></div>

  <!-- QR Code Generator Client-Side Library -->
  <script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>

  <!-- Client-Side HTML to PDF Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

  <!-- Application Script -->
  <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
