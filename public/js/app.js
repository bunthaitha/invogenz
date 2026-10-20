/**
 * Invogenz • Interactive Client Logic
 * Zero Database • Real-Time Live Preview • Vector PDF Generation
 */

(function () {
  'use strict';

  // --- State & Defaults ---
  const STORAGE_KEY = 'invoice_gen_studio_data_v1';
  const THEME_KEY = 'invoice_gen_theme_v1';

  let currentZoom = 1.0;
  let qrInstance = null;

  // Initial Default Invoice Structure
  const defaultInvoiceData = {
    paper_size: 'A4',
    accent_color: '#4F46E5',
    currency: '$',
    invoice_number: 'INV-2026-0042',
    status: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    po_number: '',
    company_name: 'Vertex Digital Solutions Inc.',
    company_contact: 'Marcus Vance',
    company_tagline: 'Enterprise Cloud Architecture & Digital Products',
    company_address: '742 Evergreen Terrace, Suite 500\nSan Francisco, CA 94107\nUnited States',
    company_email: 'billing@vertexdigital.com',
    company_phone: '+1 (415) 555-0199',
    company_logo: '',
    client_name: 'Sarah Connor',
    client_company: 'Cyberdyne Systems Corp.',
    client_address: '18144 El Camino Real, Building 4\nSunnyvale, CA 94087\nUnited States',
    client_email: 'sconnor@cyberdyne.io',
    client_phone: '+1 (408) 555-0811',
    client_tax_id: 'US-10294857',
    items: [
      {
        description: 'Cloud Architecture & Security Audit',
        sub_description: 'Multi-region AWS Kubernetes architecture design and migration roadmap',
        quantity: 30,
        rate: 150,
        tax_rate: 0
      },
      {
        description: 'API Gateway & Microservices Engineering',
        sub_description: 'High-throughput asynchronous event streaming with Kafka & FastAPI',
        quantity: 45,
        rate: 125,
        tax_rate: 0
      },
      {
        description: 'Automated CI/CD Pipeline & IaC Setup',
        sub_description: 'GitHub Actions, Terraform automated infrastructure, container registry security scanning',
        quantity: 1,
        rate: 2200,
        tax_rate: 0
      }
    ],
    discount_type: 'percentage',
    discount_value: 5,
    overall_tax_rate: 8.5,
    shipping_fee: 0,
    amount_paid: 2500,
    payment_method: 'Wire Transfer / ACH',
    bank_name: 'Silicon Valley Commercial Bank',
    account_name: 'Vertex Digital Solutions Inc.',
    account_number: '987654321098',
    routing_swift: 'SVCBUS6S',
    qr_data: 'https://pay.vertexdigital.com/inv/INV-2026-0042',
    notes: 'Thank you for your business! All deliverables are backed by our 30-day warranty and SLA guarantee.',
    terms: 'Payment is due within 14 calendar days from invoice issue date. A late fee of 1.5% per month applies to overdue balances.',
    sig_prepare_name: 'Bunthai Tha',
    sig_prepare_date: new Date().toISOString().split('T')[0],
    sig_prepare_image: '',
    show_sig_prepare: true,
    sig_approve_name: 'Alex Morgan',
    sig_approve_date: new Date().toISOString().split('T')[0],
    sig_approve_image: '',
    show_sig_approve: true,
    sig_customer_name: '',
    sig_customer_date: '',
    sig_customer_image: '',
    show_sig_customer: true,
    signature_name: 'Bunthai Tha'
  };

  let activeData = { ...defaultInvoiceData };

  // --- DOM Elements ---
  const els = {
    // Buttons & Header
    btnDownloadPdf: document.getElementById('btn-download-pdf'),
    btnPdfLabel: document.getElementById('btn-pdf-label'),
    btnPreviewPdf: document.getElementById('btn-preview-pdf'),
    btnSample: document.getElementById('btn-sample'),
    btnExportJson: document.getElementById('btn-export-json'),
    jsonImporter: document.getElementById('json-importer'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    btnPrint: document.getElementById('btn-print'),
    btnResetForm: document.getElementById('btn-reset-form'),
    saveStatusText: document.getElementById('save-status-text'),

    // Zoom
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomFit: document.getElementById('btn-zoom-fit'),
    zoomLevelText: document.getElementById('zoom-level-text'),
    invoiceSheet: document.getElementById('invoice-sheet'),
    previewViewport: document.getElementById('preview-viewport'),

    // Form inputs
    paperSize: document.getElementById('paper_size'),
    accentColor: document.getElementById('accent_color'),
    accentColorHex: document.getElementById('accent_color_hex'),
    accentHexBadge: document.getElementById('accent-hex-badge'),
    colorPreviewRing: document.getElementById('color-preview-ring'),
    themeColorIndicator: document.getElementById('theme-color-indicator'),
    currency: document.getElementById('currency'),
    invoiceNumber: document.getElementById('invoice_number'),
    status: document.getElementById('status'),
    issueDate: document.getElementById('issue_date'),
    dueDate: document.getElementById('due_date'),
    poNumber: document.getElementById('po_number'),
    btnRandomInv: document.getElementById('btn-random-inv'),
    statusDot: document.getElementById('status-dot'),
    btnIssueToday: document.getElementById('btn-issue-today'),
    dueDiffText: document.getElementById('due-diff-text'),
    btnTogglePo: document.getElementById('btn-toggle-po'),
    poDrawer: document.getElementById('po-drawer'),

    // Company (Sender)
    companyName: document.getElementById('company_name'),
    companyContact: document.getElementById('company_contact'),
    companyTagline: document.getElementById('company_tagline'),
    companyEmail: document.getElementById('company_email'),
    companyPhone: document.getElementById('company_phone'),
    companyAddress: document.getElementById('company_address'),
    logoFileInput: document.getElementById('logo-file-input'),
    logoDropzone: document.getElementById('logo-dropzone'),
    logoPreviewBox: document.getElementById('logo-preview-box'),
    logoPreviewImg: document.getElementById('logo-preview-img'),
    logoUploadPrompt: document.getElementById('logo-upload-prompt'),
    btnRemoveLogo: document.getElementById('btn-remove-logo'),

    // Client
    clientCompany: document.getElementById('client_company'),
    clientName: document.getElementById('client_name'),
    clientEmail: document.getElementById('client_email'),
    clientPhone: document.getElementById('client_phone'),
    clientTaxId: document.getElementById('client_tax_id'),
    clientAddress: document.getElementById('client_address'),

    // Items
    itemsContainer: document.getElementById('items-container'),
    btnAddItem: document.getElementById('btn-add-item'),

    // Totals & Adjustments
    discountType: document.getElementById('discount_type'),
    discountValue: document.getElementById('discount_value'),
    overallTaxRate: document.getElementById('overall_tax_rate'),
    shippingFee: document.getElementById('shipping_fee'),
    amountPaid: document.getElementById('amount_paid'),

    // Payment
    paymentMethod: document.getElementById('payment_method'),
    bankName: document.getElementById('bank_name'),
    accountName: document.getElementById('account_name'),
    accountNumber: document.getElementById('account_number'),
    routingSwift: document.getElementById('routing_swift'),
    qrData: document.getElementById('qr_data'),

    // Notes & Multi-party Signatures Form Elements
    notes: document.getElementById('notes'),
    terms: document.getElementById('terms'),
    signatureName: document.getElementById('signature_name'),

    checkSigPrepare: document.getElementById('check-sig-prepare'),
    blockSigPrepare: document.getElementById('block-sig-prepare'),
    sigPrepareName: document.getElementById('sig_prepare_name'),
    sigPrepareDate: document.getElementById('sig_prepare_date'),
    btnPrepareToday: document.getElementById('btn-prepare-today'),
    zoneSigPrepare: document.getElementById('zone-sig-prepare'),
    fileSigPrepare: document.getElementById('file-sig-prepare'),
    previewSigPrepareBox: document.getElementById('preview-sig-prepare-box'),
    imgSigPrepare: document.getElementById('img-sig-prepare'),
    promptSigPrepare: document.getElementById('prompt-sig-prepare'),
    btnCleanPrepare: document.getElementById('btn-clean-prepare'),
    btnRemovePrepare: document.getElementById('btn-remove-prepare'),

    checkSigApprove: document.getElementById('check-sig-approve'),
    blockSigApprove: document.getElementById('block-sig-approve'),
    sigApproveName: document.getElementById('sig_approve_name'),
    sigApproveDate: document.getElementById('sig_approve_date'),
    btnApproveToday: document.getElementById('btn-approve-today'),
    zoneSigApprove: document.getElementById('zone-sig-approve'),
    fileSigApprove: document.getElementById('file-sig-approve'),
    previewSigApproveBox: document.getElementById('preview-sig-approve-box'),
    imgSigApprove: document.getElementById('img-sig-approve'),
    promptSigApprove: document.getElementById('prompt-sig-approve'),
    btnCleanApprove: document.getElementById('btn-clean-approve'),
    btnRemoveApprove: document.getElementById('btn-remove-approve'),

    checkSigCustomer: document.getElementById('check-sig-customer'),
    blockSigCustomer: document.getElementById('block-sig-customer'),
    sigCustomerName: document.getElementById('sig_customer_name'),
    sigCustomerDate: document.getElementById('sig_customer_date'),
    btnCustomerToday: document.getElementById('btn-customer-today'),
    zoneSigCustomer: document.getElementById('zone-sig-customer'),
    fileSigCustomer: document.getElementById('file-sig-customer'),
    previewSigCustomerBox: document.getElementById('preview-sig-customer-box'),
    imgSigCustomer: document.getElementById('img-sig-customer'),
    promptSigCustomer: document.getElementById('prompt-sig-customer'),
    btnCleanCustomer: document.getElementById('btn-clean-customer'),
    btnRemoveCustomer: document.getElementById('btn-remove-customer'),

    // Paper Preview Elements
    previewPaperSpec: document.getElementById('preview-paper-spec'),
    pvLogoContainer: document.getElementById('pv-logo-container'),
    pvLogoImg: document.getElementById('pv-logo-img'),
    pvCompanyName: document.getElementById('pv-company-name'),
    pvCompanyTagline: document.getElementById('pv-company-tagline'),
    pvStatusBadge: document.getElementById('pv-status-badge'),
    pvInvNumber: document.getElementById('pv-inv-number'),
    pvIssueDate: document.getElementById('pv-issue-date'),
    pvDueDate: document.getElementById('pv-due-date'),
    pvPoRow: document.getElementById('pv-po-row'),
    pvPoNumber: document.getElementById('pv-po-number'),
    pvAccentBar: document.getElementById('pv-accent-bar'),

    pvFromName: document.getElementById('pv-from-name'),
    pvFromPerson: document.getElementById('pv-from-person'),
    pvFromAddress: document.getElementById('pv-from-address'),
    pvFromContact: document.getElementById('pv-from-contact'),

    pvClientCompany: document.getElementById('pv-client-company'),
    pvClientName: document.getElementById('pv-client-name'),
    pvClientAddress: document.getElementById('pv-client-address'),
    pvClientContact: document.getElementById('pv-client-contact'),
    pvClientTax: document.getElementById('pv-client-tax'),

    pvTableHead: document.getElementById('pv-table-head'),
    pvItemsBody: document.getElementById('pv-items-body'),

    pvPaymentBox: document.getElementById('pv-payment-box'),
    pvPayMethodRow: document.getElementById('pv-pay-method-row'),
    pvPayMethod: document.getElementById('pv-pay-method'),
    pvPayBankRow: document.getElementById('pv-pay-bank-row'),
    pvPayBank: document.getElementById('pv-pay-bank'),
    pvPayAccnameRow: document.getElementById('pv-pay-accname-row'),
    pvPayAccname: document.getElementById('pv-pay-accname'),
    pvPayAccnumRow: document.getElementById('pv-pay-accnum-row'),
    pvPayAccnum: document.getElementById('pv-pay-accnum'),
    pvPaySwiftRow: document.getElementById('pv-pay-swift-row'),
    pvPaySwift: document.getElementById('pv-pay-swift'),

    pvQrBox: document.getElementById('pv-qr-box'),
    pvQrCanvas: document.getElementById('pv-qr-canvas'),
    pvDefaultThanks: document.getElementById('pv-default-thanks'),

    pvSubtotal: document.getElementById('pv-subtotal'),
    pvDiscountRow: document.getElementById('pv-discount-row'),
    pvDiscountLabel: document.getElementById('pv-discount-label'),
    pvDiscount: document.getElementById('pv-discount'),
    pvTaxRow: document.getElementById('pv-tax-row'),
    pvTax: document.getElementById('pv-tax'),
    pvShippingRow: document.getElementById('pv-shipping-row'),
    pvShipping: document.getElementById('pv-shipping'),
    pvGrandTotal: document.getElementById('pv-grand-total'),
    pvPaidRow: document.getElementById('pv-paid-row'),
    pvPaid: document.getElementById('pv-paid'),
    pvBalanceBox: document.getElementById('pv-balance-box'),
    pvBalance: document.getElementById('pv-balance'),

    pvNotesBlock: document.getElementById('pv-notes-block'),
    pvNotesText: document.getElementById('pv-notes-text'),
    pvTermsBlock: document.getElementById('pv-terms-block'),
    pvTermsText: document.getElementById('pv-terms-text'),

    // Paper Preview Multi-party Signatures
    pvSignaturesSection: document.getElementById('pv-signatures-section'),
    pvColPrepare: document.getElementById('pv-col-prepare'),
    pvSigPrepareBox: document.getElementById('pv-sig-prepare-box'),
    pvSigPrepareImg: document.getElementById('pv-sig-prepare-img'),
    pvPrepareName: document.getElementById('pv-prepare-name'),
    pvPrepareDate: document.getElementById('pv-prepare-date'),

    pvColApprove: document.getElementById('pv-col-approve'),
    pvSigApproveBox: document.getElementById('pv-sig-approve-box'),
    pvSigApproveImg: document.getElementById('pv-sig-approve-img'),
    pvApproveName: document.getElementById('pv-approve-name'),
    pvApproveDate: document.getElementById('pv-approve-date'),

    pvColCustomer: document.getElementById('pv-col-customer'),
    pvSigCustomerBox: document.getElementById('pv-sig-customer-box'),
    pvSigCustomerImg: document.getElementById('pv-sig-customer-img'),
    pvCustomerName: document.getElementById('pv-customer-name'),
    pvCustomerDate: document.getElementById('pv-customer-date'),

    toastContainer: document.getElementById('toast-container')
  };

  // --- Toast Feedback ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `<i data-lucide="${iconName}"></i><span>${message}</span>`;
    els.toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Currency Formatter ---
  function formatMoney(amount, symbol = '$') {
    const val = Number(amount) || 0;
    return `${symbol} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // --- Status & Date Helpers ---
  function updateStatusDot(val) {
    if (!els.statusDot) return;
    const st = (val || '').trim().toUpperCase();
    if (st === 'PAID') {
      els.statusDot.style.backgroundColor = '#10B981';
      els.statusDot.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.55)';
    } else if (st === 'OVERDUE') {
      els.statusDot.style.backgroundColor = '#EF4444';
      els.statusDot.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.55)';
    } else if (st === 'DRAFT') {
      els.statusDot.style.backgroundColor = '#64748B';
      els.statusDot.style.boxShadow = 'none';
    } else {
      els.statusDot.style.backgroundColor = 'var(--text-muted)';
      els.statusDot.style.boxShadow = 'none';
    }
  }

  function updateDueDiffBadge() {
    if (!els.dueDiffText) return;
    const dueVal = els.dueDate ? els.dueDate.value : '';

    if (!dueVal) {
      els.dueDiffText.textContent = 'No due date';
      els.dueDiffText.className = 'due-rel-badge';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateObj = new Date(dueVal + 'T00:00:00');
    const diffDays = Math.round((dueDateObj - today) / (1000 * 60 * 60 * 24));

    els.dueDiffText.classList.remove('overdue', 'today');

    if (diffDays === 0) {
      els.dueDiffText.textContent = 'Due Today';
      els.dueDiffText.classList.add('today');
    } else if (diffDays < 0) {
      els.dueDiffText.textContent = `${Math.abs(diffDays)}d Overdue`;
      els.dueDiffText.classList.add('overdue');
    } else {
      els.dueDiffText.textContent = `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    }

    // Sync active state of quick preset chips
    const issueVal = els.issueDate ? els.issueDate.value : '';
    if (issueVal) {
      const issueDateObj = new Date(issueVal + 'T00:00:00');
      const offsetDays = Math.round((dueDateObj - issueDateObj) / (1000 * 60 * 60 * 24));
      document.querySelectorAll('.date-chip').forEach(chip => {
        const chipDays = parseInt(chip.dataset.days, 10);
        if (chipDays === offsetDays) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }
  }

  // --- Initialize App ---
  function init() {
    loadTheme();
    loadPersistedData();
    bindEvents();
    renderFormFromState();
    updateLivePreview();
    if (window.lucide) lucide.createIcons();
  }

  // --- LocalStorage Persistence (No Database Required!) ---
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeData));
      if (els.saveStatusText) {
        els.saveStatusText.textContent = 'Auto-saved to Browser';
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  let saveTimeout = null;
  function triggerAutoSave() {
    if (els.saveStatusText) {
      els.saveStatusText.textContent = 'Saving changes...';
    }
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      gatherFormData();
      saveToLocalStorage();
      updateLivePreview();
    }, 250);
  }

  function loadPersistedData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        activeData = JSON.parse(saved);
        // Clear previous defaults if cached
        if (activeData.status === 'PENDING') activeData.status = '';
        if (activeData.po_number === 'PO-88412') activeData.po_number = '';
      }
    } catch (e) {
      console.warn('Failed to parse saved invoice data:', e);
      activeData = { ...defaultInvoiceData };
    }
  }

  // --- Theme (Dark/Light) ---
  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'theme-light';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark');
    const newTheme = isDark ? 'theme-light' : 'theme-dark';
    document.body.className = newTheme;
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    if (!els.themeIcon) return;
    if (theme === 'theme-dark') {
      els.themeIcon.setAttribute('data-lucide', 'sun');
    } else {
      els.themeIcon.setAttribute('data-lucide', 'moon');
    }
    if (window.lucide) lucide.createIcons();
  }

  // --- Form Populating & Gathering ---
  function renderFormFromState() {
    els.paperSize.value = activeData.paper_size || 'A4';
    els.accentColor.value = activeData.accent_color || '#4F46E5';
    updateAccentColor(activeData.accent_color || '#4F46E5');

    els.currency.value = activeData.currency || '$';
    els.invoiceNumber.value = activeData.invoice_number || '';
    els.status.value = activeData.status || '';
    els.issueDate.value = activeData.issue_date || '';
    els.dueDate.value = activeData.due_date || '';
    if (els.poNumber) els.poNumber.value = activeData.po_number || '';

    // Metadata visual indicators
    updateStatusDot(activeData.status);
    updateDueDiffBadge();
    if (els.poDrawer) {
      els.poDrawer.style.display = activeData.po_number ? 'block' : 'none';
      if (els.btnTogglePo) {
        els.btnTogglePo.classList.toggle('active', !!activeData.po_number);
      }
    }

    // Company
    els.companyName.value = activeData.company_name || '';
    if (els.companyContact) els.companyContact.value = activeData.company_contact || '';
    els.companyTagline.value = activeData.company_tagline || '';
    els.companyEmail.value = activeData.company_email || '';
    els.companyPhone.value = activeData.company_phone || '';
    els.companyAddress.value = activeData.company_address || '';

    // Logo
    if (activeData.company_logo) {
      els.logoPreviewImg.src = activeData.company_logo;
      els.logoPreviewBox.style.display = 'inline-flex';
      els.logoUploadPrompt.style.display = 'none';
    } else {
      els.logoPreviewBox.style.display = 'none';
      els.logoUploadPrompt.style.display = 'flex';
    }

    // Client
    els.clientCompany.value = activeData.client_company || '';
    els.clientName.value = activeData.client_name || '';
    els.clientEmail.value = activeData.client_email || '';
    els.clientPhone.value = activeData.client_phone || '';
    els.clientTaxId.value = activeData.client_tax_id || '';
    els.clientAddress.value = activeData.client_address || '';

    // Adjustments
    els.discountType.value = activeData.discount_type || 'percentage';
    els.discountValue.value = activeData.discount_value || 0;
    els.overallTaxRate.value = activeData.overall_tax_rate || 0;
    els.shippingFee.value = activeData.shipping_fee || 0;
    els.amountPaid.value = activeData.amount_paid || 0;

    // Payment
    els.paymentMethod.value = activeData.payment_method || '';
    els.bankName.value = activeData.bank_name || '';
    els.accountName.value = activeData.account_name || '';
    els.accountNumber.value = activeData.account_number || '';
    els.routingSwift.value = activeData.routing_swift || '';
    els.qrData.value = activeData.qr_data || '';

    // Notes & Multi-party Signatures
    els.notes.value = activeData.notes || '';
    els.terms.value = activeData.terms || '';

    // Prepared By
    const isPrepareActive = activeData.show_sig_prepare !== false;
    if (els.checkSigPrepare) els.checkSigPrepare.checked = isPrepareActive;
    if (els.blockSigPrepare) els.blockSigPrepare.classList.toggle('is-disabled', !isPrepareActive);
    if (els.sigPrepareName) els.sigPrepareName.value = activeData.sig_prepare_name || '';
    if (els.sigPrepareDate) els.sigPrepareDate.value = activeData.sig_prepare_date || '';
    if (activeData.sig_prepare_image && els.imgSigPrepare) {
      els.imgSigPrepare.src = activeData.sig_prepare_image;
      els.previewSigPrepareBox.style.display = 'block';
      els.promptSigPrepare.style.display = 'none';
    } else if (els.previewSigPrepareBox) {
      els.previewSigPrepareBox.style.display = 'none';
      els.promptSigPrepare.style.display = 'flex';
    }

    // Approved By
    const isApproveActive = activeData.show_sig_approve !== false;
    if (els.checkSigApprove) els.checkSigApprove.checked = isApproveActive;
    if (els.blockSigApprove) els.blockSigApprove.classList.toggle('is-disabled', !isApproveActive);
    if (els.sigApproveName) els.sigApproveName.value = activeData.sig_approve_name || activeData.signature_name || '';
    if (els.sigApproveDate) els.sigApproveDate.value = activeData.sig_approve_date || '';
    if (activeData.sig_approve_image && els.imgSigApprove) {
      els.imgSigApprove.src = activeData.sig_approve_image;
      els.previewSigApproveBox.style.display = 'block';
      els.promptSigApprove.style.display = 'none';
    } else if (els.previewSigApproveBox) {
      els.previewSigApproveBox.style.display = 'none';
      els.promptSigApprove.style.display = 'flex';
    }

    // Customer Signature
    const isCustomerActive = activeData.show_sig_customer !== false;
    if (els.checkSigCustomer) els.checkSigCustomer.checked = isCustomerActive;
    if (els.blockSigCustomer) els.blockSigCustomer.classList.toggle('is-disabled', !isCustomerActive);
    if (els.sigCustomerName) els.sigCustomerName.value = activeData.sig_customer_name || '';
    if (els.sigCustomerDate) els.sigCustomerDate.value = activeData.sig_customer_date || '';
    if (activeData.sig_customer_image && els.imgSigCustomer) {
      els.imgSigCustomer.src = activeData.sig_customer_image;
      els.previewSigCustomerBox.style.display = 'block';
      els.promptSigCustomer.style.display = 'none';
    } else if (els.previewSigCustomerBox) {
      els.previewSigCustomerBox.style.display = 'none';
      els.promptSigCustomer.style.display = 'flex';
    }

    // Items
    renderItemsList();
  }

  function gatherFormData() {
    activeData.paper_size = els.paperSize.value;
    activeData.accent_color = els.accentColor.value;
    activeData.currency = els.currency.value;
    activeData.invoice_number = els.invoiceNumber.value.trim();
    activeData.status = els.status ? els.status.value : '';
    activeData.issue_date = els.issueDate.value;
    activeData.due_date = els.dueDate.value;
    activeData.po_number = els.poNumber ? els.poNumber.value.trim() : '';

    activeData.company_name = els.companyName.value.trim();
    activeData.company_contact = els.companyContact ? els.companyContact.value.trim() : '';
    activeData.company_tagline = els.companyTagline.value.trim();
    activeData.company_email = els.companyEmail.value.trim();
    activeData.company_phone = els.companyPhone.value.trim();
    activeData.company_address = els.companyAddress.value;

    activeData.client_company = els.clientCompany.value.trim();
    activeData.client_name = els.clientName.value.trim();
    activeData.client_email = els.clientEmail.value.trim();
    activeData.client_phone = els.clientPhone.value.trim();
    activeData.client_tax_id = els.clientTaxId.value.trim();
    activeData.client_address = els.clientAddress.value;

    activeData.discount_type = els.discountType.value;
    activeData.discount_value = parseFloat(els.discountValue.value) || 0;
    activeData.overall_tax_rate = parseFloat(els.overallTaxRate.value) || 0;
    activeData.shipping_fee = parseFloat(els.shippingFee.value) || 0;
    activeData.amount_paid = parseFloat(els.amountPaid.value) || 0;

    activeData.payment_method = els.paymentMethod.value.trim();
    activeData.bank_name = els.bankName.value.trim();
    activeData.account_name = els.accountName.value.trim();
    activeData.account_number = els.accountNumber.value.trim();
    activeData.routing_swift = els.routingSwift.value.trim();
    activeData.qr_data = els.qrData.value.trim();

    activeData.notes = els.notes.value.trim();
    activeData.terms = els.terms.value.trim();

    // Multi-party signatures & display flags
    activeData.show_sig_prepare = els.checkSigPrepare ? els.checkSigPrepare.checked : true;
    activeData.sig_prepare_name = els.sigPrepareName ? els.sigPrepareName.value.trim() : '';
    activeData.sig_prepare_date = els.sigPrepareDate ? els.sigPrepareDate.value : '';

    activeData.show_sig_approve = els.checkSigApprove ? els.checkSigApprove.checked : true;
    activeData.sig_approve_name = els.sigApproveName ? els.sigApproveName.value.trim() : '';
    activeData.sig_approve_date = els.sigApproveDate ? els.sigApproveDate.value : '';
    activeData.signature_name = activeData.sig_approve_name; // Maintain backward compatibility

    activeData.show_sig_customer = els.checkSigCustomer ? els.checkSigCustomer.checked : true;
    activeData.sig_customer_name = els.sigCustomerName ? els.sigCustomerName.value.trim() : '';
    activeData.sig_customer_date = els.sigCustomerDate ? els.sigCustomerDate.value : '';

    // Line items gathered from DOM
    const itemCards = els.itemsContainer.querySelectorAll('.item-row-card');
    const items = [];
    itemCards.forEach((card) => {
      const desc = card.querySelector('.item-input-desc').value;
      const subDesc = card.querySelector('.item-input-subdesc').value;
      const qty = parseFloat(card.querySelector('.item-input-qty').value) || 0;
      const rate = parseFloat(card.querySelector('.item-input-rate').value) || 0;
      const taxRate = parseFloat(card.querySelector('.item-input-tax').value) || 0;

      items.push({
        description: desc,
        sub_description: subDesc,
        quantity: qty,
        rate: rate,
        tax_rate: taxRate
      });
    });
    activeData.items = items;
  }

  // --- Line Items Dynamic Rendering ---
  function renderItemsList() {
    els.itemsContainer.innerHTML = '';
    const items = activeData.items || [];

    if (items.length === 0) {
      items.push({ description: '', sub_description: '', quantity: 1, rate: 0, tax_rate: 0 });
    }

    items.forEach((item, index) => {
      const card = createItemRowElement(item, index);
      els.itemsContainer.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function createItemRowElement(item, index) {
    const card = document.createElement('div');
    card.className = 'item-row-card';
    card.dataset.index = index;

    const qty = Number(item.quantity) || 1;
    const rate = Number(item.rate) || 0;
    const taxRate = Number(item.tax_rate) || 0;
    const lineTotal = (qty * rate) * (1 + taxRate / 100);

    card.innerHTML = `
      <div class="item-row-top">
        <div class="item-row-desc">
          <input type="text" class="form-control item-input-desc" placeholder="Item name / Service title" value="${escapeHtml(item.description || '')}">
          <input type="text" class="form-control item-input-subdesc" placeholder="Additional details or specifications (optional)" value="${escapeHtml(item.sub_description || '')}">
        </div>
        <div class="item-row-actions">
          <button type="button" class="btn-item-action duplicate-item" title="Duplicate item">
            <i data-lucide="copy"></i>
          </button>
          <button type="button" class="btn-item-action delete-item" title="Delete item">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
      <div class="item-row-bottom">
        <div class="form-group">
          <label>Qty</label>
          <input type="number" class="form-control item-input-qty" min="0" step="any" value="${qty}">
        </div>
        <div class="form-group">
          <label>Rate (${activeData.currency})</label>
          <input type="number" class="form-control item-input-rate" min="0" step="any" value="${rate}">
        </div>
        <div class="form-group">
          <label>Tax %</label>
          <input type="number" class="form-control item-input-tax" min="0" step="any" value="${taxRate}">
        </div>
        <div class="item-line-total-box">
          <span class="total-label">Total</span>
          <span class="total-amount item-row-total-display">${formatMoney(lineTotal, activeData.currency)}</span>
        </div>
      </div>
    `;

    // Bind item changes
    const inputs = card.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        updateItemRowTotal(card);
        triggerAutoSave();
      });
    });

    // Delete item
    card.querySelector('.delete-item').addEventListener('click', () => {
      const allCards = els.itemsContainer.querySelectorAll('.item-row-card');
      if (allCards.length <= 1) {
        showToast('Invoice must have at least one line item', 'info');
        return;
      }
      card.remove();
      triggerAutoSave();
    });

    // Duplicate item
    card.querySelector('.duplicate-item').addEventListener('click', () => {
      gatherFormData();
      const currentIdx = parseInt(card.dataset.index, 10);
      const duplicateData = { ...activeData.items[currentIdx] };
      activeData.items.splice(currentIdx + 1, 0, duplicateData);
      renderItemsList();
      triggerAutoSave();
    });

    return card;
  }

  function updateItemRowTotal(card) {
    const qty = parseFloat(card.querySelector('.item-input-qty').value) || 0;
    const rate = parseFloat(card.querySelector('.item-input-rate').value) || 0;
    const taxRate = parseFloat(card.querySelector('.item-input-tax').value) || 0;
    const lineTotal = (qty * rate) * (1 + taxRate / 100);
    card.querySelector('.item-row-total-display').textContent = formatMoney(lineTotal, activeData.currency);
  }

  function addNewLineItem() {
    gatherFormData();
    activeData.items.push({
      description: 'New Service or Product',
      sub_description: '',
      quantity: 1,
      rate: 100,
      tax_rate: 0
    });
    renderItemsList();
    triggerAutoSave();
    // Scroll to the newest item
    setTimeout(() => {
      const cards = els.itemsContainer.querySelectorAll('.item-row-card');
      if (cards.length) {
        cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }

  // --- Real-Time Live Preview Renderer ---
  function updateLivePreview() {
    const data = activeData;
    const curr = data.currency || '$';

    // Format spec
    els.previewPaperSpec.textContent = `${data.paper_size || 'A4'} • Vector PDF`;

    // Logo & Company Name (Remove company name under logo!)
    if (data.company_logo) {
      els.pvLogoImg.src = data.company_logo;
      els.pvLogoContainer.style.display = 'block';
      // Logo present: company name under logo removed
      els.pvCompanyName.style.display = 'none';
    } else {
      els.pvLogoContainer.style.display = 'none';
      if (data.company_name && data.company_name.trim()) {
        els.pvCompanyName.textContent = data.company_name.trim();
        els.pvCompanyName.style.display = 'block';
      } else {
        els.pvCompanyName.style.display = 'none';
      }
    }

    if (data.company_tagline && data.company_tagline.trim()) {
      els.pvCompanyTagline.textContent = data.company_tagline.trim();
      els.pvCompanyTagline.style.display = 'block';
    } else {
      els.pvCompanyTagline.style.display = 'none';
    }

    // Sender Details (Rendered in Brand Header under Company Name / Logo)
    if (els.pvFromPerson) {
      if (data.company_contact && data.company_contact.trim()) {
        const contactVal = data.company_contact.trim();
        const displayVal = contactVal.toLowerCase().startsWith('contact person:') ? contactVal : `Contact Person: ${contactVal}`;
        els.pvFromPerson.textContent = displayVal;
        els.pvFromPerson.style.display = 'block';
      } else {
        els.pvFromPerson.style.display = 'none';
      }
    }

    if (els.pvFromAddress) {
      els.pvFromAddress.textContent = data.company_address || '';
    }

    const compContacts = [];
    if (data.company_phone) compContacts.push(data.company_phone);
    if (data.company_email) compContacts.push(data.company_email);
    if (els.pvFromContact) {
      els.pvFromContact.textContent = compContacts.join(' • ');
    }

    // Invoice Meta
    els.pvInvNumber.textContent = data.invoice_number || 'INV-001';
    els.pvIssueDate.textContent = data.issue_date || '—';
    els.pvDueDate.textContent = data.due_date || '—';

    if (els.pvPoRow) {
      if (data.po_number) {
        els.pvPoRow.style.display = 'flex';
        els.pvPoNumber.textContent = data.po_number;
      } else {
        els.pvPoRow.style.display = 'none';
      }
    }

    // Status Badge
    const st = (data.status || '').trim().toUpperCase();
    if (st && st !== 'NONE') {
      els.pvStatusBadge.style.display = 'inline-block';
      els.pvStatusBadge.textContent = st;
      const statusBgMap = {
        PAID: '#10B981',
        OVERDUE: '#EF4444',
        DRAFT: '#64748B'
      };
      els.pvStatusBadge.style.backgroundColor = statusBgMap[st] || data.accent_color;
    } else {
      els.pvStatusBadge.style.display = 'none';
    }

    // Client Card
    if (data.client_company) {
      els.pvClientCompany.textContent = data.client_company;
      els.pvClientCompany.style.display = 'block';
      els.pvClientName.textContent = data.client_name ? `Attn: ${data.client_name}` : '';
    } else {
      els.pvClientCompany.style.display = 'none';
      els.pvClientName.textContent = data.client_name || 'Valued Client';
    }

    els.pvClientAddress.textContent = data.client_address || '';
    const clientContacts = [];
    if (data.client_email) clientContacts.push(data.client_email);
    if (data.client_phone) clientContacts.push(data.client_phone);
    els.pvClientContact.textContent = clientContacts.join(' • ');
    els.pvClientTax.textContent = data.client_tax_id ? `Tax / VAT: ${data.client_tax_id}` : '';

    // Render Items on Preview
    els.pvItemsBody.innerHTML = '';
    let subtotal = 0;
    let itemTaxTotal = 0;

    (data.items || []).forEach((item, idx) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const taxRate = parseFloat(item.tax_rate) || 0;

      const base = qty * rate;
      const tax = base * (taxRate / 100);
      const lineTot = base + tax;

      subtotal += base;
      itemTaxTotal += tax;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); color: #64748B;">${idx + 1}</td>
        <td>
          <div class="pv-item-desc">${escapeHtml(item.description || 'Item')}</div>
          ${item.sub_description ? `<div class="pv-item-subdesc">${escapeHtml(item.sub_description)}</div>` : ''}
        </td>
        <td style="text-align: right; font-family: var(--font-mono);">${qty}</td>
        <td style="text-align: right; font-family: var(--font-mono);">${formatMoney(rate, curr)}</td>
        <td style="text-align: right; font-family: var(--font-mono); color: #64748B;">${taxRate > 0 ? taxRate + '%' : '—'}</td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">${formatMoney(lineTot, curr)}</td>
      `;
      els.pvItemsBody.appendChild(tr);
    });

    // Totals Calculations
    let discountVal = 0;
    const discInput = parseFloat(data.discount_value) || 0;
    if (data.discount_type === 'percentage') {
      discountVal = subtotal * (discInput / 100);
      els.pvDiscountLabel.textContent = `Discount (${discInput}%):`;
    } else {
      discountVal = discInput;
      els.pvDiscountLabel.textContent = 'Discount:';
    }

    const overallTaxRate = parseFloat(data.overall_tax_rate) || 0;
    const overallTaxVal = Math.max(0, subtotal - discountVal) * (overallTaxRate / 100);
    const totalTax = itemTaxTotal + overallTaxVal;

    const shippingFee = parseFloat(data.shipping_fee) || 0;
    const grandTotal = Math.max(0, subtotal - discountVal + totalTax + shippingFee);

    const amountPaid = parseFloat(data.amount_paid) || 0;
    const balanceDue = Math.max(0, grandTotal - amountPaid);

    // Populate Totals Table
    els.pvSubtotal.textContent = formatMoney(subtotal, curr);

    if (discountVal > 0) {
      els.pvDiscountRow.style.display = 'flex';
      els.pvDiscount.textContent = `-${formatMoney(discountVal, curr)}`;
    } else {
      els.pvDiscountRow.style.display = 'none';
    }

    if (totalTax > 0) {
      els.pvTaxRow.style.display = 'flex';
      els.pvTax.textContent = formatMoney(totalTax, curr);
    } else {
      els.pvTaxRow.style.display = 'none';
    }

    if (shippingFee > 0) {
      els.pvShippingRow.style.display = 'flex';
      els.pvShipping.textContent = formatMoney(shippingFee, curr);
    } else {
      els.pvShippingRow.style.display = 'none';
    }

    els.pvGrandTotal.textContent = formatMoney(grandTotal, curr);

    if (amountPaid > 0) {
      els.pvPaidRow.style.display = 'flex';
      els.pvPaid.textContent = formatMoney(amountPaid, curr);
    } else {
      els.pvPaidRow.style.display = 'none';
    }

    els.pvBalance.textContent = formatMoney(balanceDue, curr);
    els.pvBalanceBox.style.backgroundColor = balanceDue > 0 ? data.accent_color : '#10B981';

    // Payment Info
    const hasPayInfo = !!(data.payment_method || data.bank_name || data.account_name || data.account_number || data.routing_swift);
    if (hasPayInfo) {
      els.pvPaymentBox.style.display = 'block';
      toggleRow(els.pvPayMethodRow, els.pvPayMethod, data.payment_method);
      toggleRow(els.pvPayBankRow, els.pvPayBank, data.bank_name);
      toggleRow(els.pvPayAccnameRow, els.pvPayAccname, data.account_name);
      toggleRow(els.pvPayAccnumRow, els.pvPayAccnum, data.account_number);
      toggleRow(els.pvPaySwiftRow, els.pvPaySwift, data.routing_swift);
    } else {
      els.pvPaymentBox.style.display = 'none';
    }

    // QR Code rendering
    if (data.qr_data && data.qr_data.trim() && window.QRious) {
      els.pvQrBox.style.display = 'flex';
      if (!qrInstance) {
        qrInstance = new QRious({
          element: els.pvQrCanvas,
          size: 100,
          value: data.qr_data.trim()
        });
      } else {
        qrInstance.value = data.qr_data.trim();
      }
    } else {
      els.pvQrBox.style.display = 'none';
    }

    // Default Thanks note
    if (!hasPayInfo && !data.qr_data) {
      els.pvDefaultThanks.style.display = 'block';
    } else {
      els.pvDefaultThanks.style.display = 'none';
    }

    // Notes & Terms
    if (data.notes) {
      els.pvNotesBlock.style.display = 'block';
      els.pvNotesText.textContent = data.notes;
    } else {
      els.pvNotesBlock.style.display = 'none';
    }

    if (data.terms) {
      els.pvTermsBlock.style.display = 'block';
      els.pvTermsText.textContent = data.terms;
    } else {
      els.pvTermsBlock.style.display = 'none';
    }

    // Multi-party Signatures Preview
    const showPrepare = data.show_sig_prepare !== false;
    const showApprove = data.show_sig_approve !== false;
    const showCustomer = data.show_sig_customer !== false;

    let activeColsCount = 0;
    if (showPrepare) activeColsCount++;
    if (showApprove) activeColsCount++;
    if (showCustomer) activeColsCount++;

    const hasAnySignature = activeColsCount > 0 && !!(
      (showPrepare && (data.sig_prepare_name || data.sig_prepare_date || data.sig_prepare_image)) ||
      (showApprove && (data.sig_approve_name || data.sig_approve_date || data.sig_approve_image || data.signature_name)) ||
      (showCustomer && (data.sig_customer_name || data.sig_customer_date || data.sig_customer_image)) ||
      activeColsCount > 0
    );

    if (els.pvSignaturesSection) {
      if (hasAnySignature && activeColsCount > 0) {
        els.pvSignaturesSection.style.display = 'grid';
        els.pvSignaturesSection.style.gridTemplateColumns = 'repeat(3, 1fr)';

        // 1. Prepared by
        if (els.pvColPrepare) {
          if (showPrepare) {
            els.pvColPrepare.style.display = 'flex';
            if (els.pvPrepareName) {
              const prepName = (data.sig_prepare_name || '').trim();
              els.pvPrepareName.textContent = prepName;
              els.pvPrepareName.style.display = prepName ? 'block' : 'none';
            }
            if (els.pvPrepareDate) {
              els.pvPrepareDate.textContent = data.sig_prepare_date ? `Date: ${data.sig_prepare_date}` : 'Date: ___________';
            }
            if (els.pvSigPrepareBox && els.pvSigPrepareImg) {
              els.pvSigPrepareBox.style.display = 'flex';
              if (data.sig_prepare_image) {
                els.pvSigPrepareImg.src = data.sig_prepare_image;
                els.pvSigPrepareImg.style.display = 'block';
              } else {
                els.pvSigPrepareImg.src = '';
                els.pvSigPrepareImg.style.display = 'none';
              }
            }
          } else {
            els.pvColPrepare.style.display = 'none';
          }
        }

        // 2. Approved by
        if (els.pvColApprove) {
          if (showApprove) {
            els.pvColApprove.style.display = 'flex';
            const approveName = (data.sig_approve_name || data.signature_name || '').trim();
            if (els.pvApproveName) {
              els.pvApproveName.textContent = approveName;
              els.pvApproveName.style.display = approveName ? 'block' : 'none';
            }
            if (els.pvApproveDate) {
              els.pvApproveDate.textContent = data.sig_approve_date ? `Date: ${data.sig_approve_date}` : 'Date: ___________';
            }
            if (els.pvSigApproveBox && els.pvSigApproveImg) {
              els.pvSigApproveBox.style.display = 'flex';
              if (data.sig_approve_image) {
                els.pvSigApproveImg.src = data.sig_approve_image;
                els.pvSigApproveImg.style.display = 'block';
              } else {
                els.pvSigApproveImg.src = '';
                els.pvSigApproveImg.style.display = 'none';
              }
            }
          } else {
            els.pvColApprove.style.display = 'none';
          }
        }

        // 3. Customer Signature
        if (els.pvColCustomer) {
          if (showCustomer) {
            els.pvColCustomer.style.display = 'flex';
            if (els.pvCustomerName) {
              const custName = (data.sig_customer_name || '').trim();
              els.pvCustomerName.textContent = custName;
              els.pvCustomerName.style.display = custName ? 'block' : 'none';
            }
            if (els.pvCustomerDate) {
              els.pvCustomerDate.textContent = data.sig_customer_date ? `Date: ${data.sig_customer_date}` : 'Date: ___________';
            }
            if (els.pvSigCustomerBox && els.pvSigCustomerImg) {
              els.pvSigCustomerBox.style.display = 'flex';
              if (data.sig_customer_image) {
                els.pvSigCustomerImg.src = data.sig_customer_image;
                els.pvSigCustomerImg.style.display = 'block';
              } else {
                els.pvSigCustomerImg.src = '';
                els.pvSigCustomerImg.style.display = 'none';
              }
            }
          } else {
            els.pvColCustomer.style.display = 'none';
          }
        }
      } else {
        els.pvSignaturesSection.style.display = 'none';
      }
    }
  }

  function toggleRow(rowEl, valEl, value) {
    if (value) {
      rowEl.style.display = 'flex';
      valEl.textContent = value;
    } else {
      rowEl.style.display = 'none';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // --- Accent Color Management ---
  function updateAccentColor(colorHex) {
    if (!colorHex) return;
    const cleanHex = colorHex.startsWith('#') ? colorHex : `#${colorHex}`;
    document.documentElement.style.setProperty('--accent-color', cleanHex);
    els.pvAccentBar.style.backgroundColor = cleanHex;
    els.pvTableHead.querySelector('tr').style.backgroundColor = cleanHex;
    els.pvBalanceBox.style.backgroundColor = cleanHex;

    if (els.accentHexBadge) els.accentHexBadge.textContent = cleanHex.toUpperCase();
    if (els.accentColorHex && els.accentColorHex.value.toUpperCase() !== cleanHex.toUpperCase()) {
      els.accentColorHex.value = cleanHex.toUpperCase();
    }
    if (els.colorPreviewRing) {
      els.colorPreviewRing.style.backgroundColor = cleanHex;
      els.colorPreviewRing.style.boxShadow = `0 0 0 2px ${cleanHex}, 0 2px 5px rgba(0, 0, 0, 0.2)`;
    }
    if (els.themeColorIndicator) {
      els.themeColorIndicator.style.backgroundColor = cleanHex;
      els.themeColorIndicator.style.boxShadow = `0 0 6px ${cleanHex}`;
    }

    // Update active color swatch in UI
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      if (swatch.dataset.color.toLowerCase() === cleanHex.toLowerCase()) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }

  // --- Zoom Controls ---
  function applyZoom(delta) {
    if (delta === 0) {
      currentZoom = 1.0;
    } else {
      currentZoom = Math.min(1.5, Math.max(0.4, currentZoom + delta));
    }
    els.invoiceSheet.style.transform = `scale(${currentZoom})`;
    els.zoomLevelText.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  function fitZoomToViewport() {
    const viewportWidth = els.previewViewport.clientWidth - 48;
    const sheetWidth = 794;
    const calcScale = Math.min(1.0, Math.max(0.45, viewportWidth / sheetWidth));
    currentZoom = calcScale;
    els.invoiceSheet.style.transform = `scale(${currentZoom})`;
    els.zoomLevelText.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  // --- Signature Background Cleaning & Transparency ("Pretty Signature") ---
  /**
   * Intelligently eliminates dirty, shadowed, or grayish paper backgrounds from signature photos,
   * isolating the pen ink strokes to produce a pristine transparent digital signature.
   */
  function cleanSignatureBackground(dataUrl, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;

      // Step 1: Sample borders to estimate average paper luminance / tone
      let borderLumSum = 0;
      let borderSamples = 0;
      for (let x = 0; x < w; x += 4) {
        // Top & bottom rows
        const idxTop = (0 * w + x) * 4;
        const idxBot = ((h - 1) * w + x) * 4;
        borderLumSum += 0.299 * d[idxTop] + 0.587 * d[idxTop + 1] + 0.114 * d[idxTop + 2];
        borderLumSum += 0.299 * d[idxBot] + 0.587 * d[idxBot + 1] + 0.114 * d[idxBot + 2];
        borderSamples += 2;
      }
      for (let y = 0; y < h; y += 4) {
        // Left & right cols
        const idxL = (y * w + 0) * 4;
        const idxR = (y * w + (w - 1)) * 4;
        borderLumSum += 0.299 * d[idxL] + 0.587 * d[idxL + 1] + 0.114 * d[idxL + 2];
        borderLumSum += 0.299 * d[idxR] + 0.587 * d[idxR + 1] + 0.114 * d[idxR + 2];
        borderSamples += 2;
      }

      const avgPaperLum = borderSamples > 0 ? (borderLumSum / borderSamples) : 220;
      // High threshold below which ink starts
      const paperCutoff = Math.max(160, Math.min(240, avgPaperLum - 18));
      const inkFullCutoff = Math.max(70, paperCutoff - 75);

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let hasInk = false;

      // Step 2: Pixel-by-pixel luminance thresholding + alpha shaping
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        if (lum >= paperCutoff) {
          // Pure paper -> Transparent
          d[i + 3] = 0;
        } else {
          // Signature ink detected
          const px = (i / 4) % w;
          const py = Math.floor((i / 4) / w);

          if (lum <= inkFullCutoff) {
            d[i + 3] = 255;
          } else {
            // Anti-aliased smooth transition
            const alphaRatio = (paperCutoff - lum) / (paperCutoff - inkFullCutoff);
            d[i + 3] = Math.round(Math.pow(alphaRatio, 1.2) * 255);
          }

          // Deepen ink to crisp executive navy / dark charcoal
          d[i] = Math.min(r, 18);
          d[i + 1] = Math.min(g, 28);
          d[i + 2] = Math.min(b, 55);

          if (d[i + 3] > 40) {
            hasInk = true;
            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
            if (py > maxY) maxY = py;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Step 3: Autocrop tight around the signature with subtle padding
      if (hasInk && maxX > minX && maxY > minY) {
        const pad = 12;
        const cropX = Math.max(0, minX - pad);
        const cropY = Math.max(0, minY - pad);
        const cropW = Math.min(w - cropX, (maxX - minX) + pad * 2);
        const cropH = Math.min(h - cropY, (maxY - minY) + pad * 2);

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = cropW;
        cropCanvas.height = cropH;
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        callback(cropCanvas.toDataURL('image/png'));
      } else {
        callback(canvas.toDataURL('image/png'));
      }
    };
    img.src = dataUrl;
  }

  // Raw original uploads stored in memory in case user toggles "Cleaned" off
  const rawSignatureBlobs = {
    prepare: '',
    approve: '',
    customer: ''
  };

  function handleSignatureUpload(roleKey, file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid PNG or JPEG image of your signature', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Signature file size must be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawBase64 = e.target.result;
      rawSignatureBlobs[roleKey] = rawBase64;

      // Automatically run intelligent background cleaner for "pretty signature"
      cleanSignatureBackground(rawBase64, (cleanedBase64) => {
        applySignatureImage(roleKey, cleanedBase64);
        showToast('Signature background cleaned & perfected!', 'success');
      });
    };
    reader.readAsDataURL(file);
  }

  function applySignatureImage(roleKey, base64Url) {
    if (roleKey === 'prepare') {
      activeData.sig_prepare_image = base64Url;
      if (els.imgSigPrepare) els.imgSigPrepare.src = base64Url;
      if (els.previewSigPrepareBox) els.previewSigPrepareBox.style.display = 'block';
      if (els.promptSigPrepare) els.promptSigPrepare.style.display = 'none';
      if (els.btnCleanPrepare) els.btnCleanPrepare.classList.add('active');
    } else if (roleKey === 'approve') {
      activeData.sig_approve_image = base64Url;
      if (els.imgSigApprove) els.imgSigApprove.src = base64Url;
      if (els.previewSigApproveBox) els.previewSigApproveBox.style.display = 'block';
      if (els.promptSigApprove) els.promptSigApprove.style.display = 'none';
      if (els.btnCleanApprove) els.btnCleanApprove.classList.add('active');
    } else if (roleKey === 'customer') {
      activeData.sig_customer_image = base64Url;
      if (els.imgSigCustomer) els.imgSigCustomer.src = base64Url;
      if (els.previewSigCustomerBox) els.previewSigCustomerBox.style.display = 'block';
      if (els.promptSigCustomer) els.promptSigCustomer.style.display = 'none';
      if (els.btnCleanCustomer) els.btnCleanCustomer.classList.add('active');
    }

    triggerAutoSave();
  }

  function removeSignature(roleKey) {
    rawSignatureBlobs[roleKey] = '';
    if (roleKey === 'prepare') {
      activeData.sig_prepare_image = '';
      if (els.previewSigPrepareBox) els.previewSigPrepareBox.style.display = 'none';
      if (els.promptSigPrepare) els.promptSigPrepare.style.display = 'flex';
      if (els.fileSigPrepare) els.fileSigPrepare.value = '';
    } else if (roleKey === 'approve') {
      activeData.sig_approve_image = '';
      if (els.previewSigApproveBox) els.previewSigApproveBox.style.display = 'none';
      if (els.promptSigApprove) els.promptSigApprove.style.display = 'flex';
      if (els.fileSigApprove) els.fileSigApprove.value = '';
    } else if (roleKey === 'customer') {
      activeData.sig_customer_image = '';
      if (els.previewSigCustomerBox) els.previewSigCustomerBox.style.display = 'none';
      if (els.promptSigCustomer) els.promptSigCustomer.style.display = 'flex';
      if (els.fileSigCustomer) els.fileSigCustomer.value = '';
    }
    triggerAutoSave();
    showToast('Signature removed', 'info');
  }

  // --- Logo Upload Handling ---
  function handleLogoFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid PNG or JPEG image file', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo file size must be less than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      activeData.company_logo = base64Data;
      els.logoPreviewImg.src = base64Data;
      els.logoPreviewBox.style.display = 'inline-flex';
      els.logoUploadPrompt.style.display = 'none';
      triggerAutoSave();
      showToast('Logo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  }

  // --- Client-Side & Server PDF Generation ---
  async function downloadPdf() {
    gatherFormData();

    const originalBtnHtml = els.btnPdfLabel.textContent;
    els.btnPdfLabel.textContent = 'Generating PDF...';
    els.btnDownloadPdf.disabled = true;

    const filename = `${activeData.invoice_number || 'invoice'}.pdf`;

    // 1. Try backend API first (if hosted on server with PHP/Python)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeData)
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        showToast(`Downloaded ${filename} successfully!`, 'success');
        els.btnPdfLabel.textContent = originalBtnHtml;
        els.btnDownloadPdf.disabled = false;
        return;
      }
    } catch (e) {
      // Backend not running (e.g. Cloudflare Pages static edge) -> Fallback to client-side
    }

    // 2. Client-side PDF generation via html2pdf (Works 100% on Cloudflare Pages!)
    try {
      const sheet = document.getElementById('invoice-sheet');
      const format = (activeData.paper_size || 'a4').toLowerCase() === 'letter' ? 'letter' : 'a4';

      if (window.html2pdf) {
        const opt = {
          margin: [8, 8, 8, 8],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: format, orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(sheet).save();
        showToast(`Downloaded ${filename} successfully!`, 'success');
      } else {
        window.print();
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      els.btnPdfLabel.textContent = originalBtnHtml;
      els.btnDownloadPdf.disabled = false;
    }
  }

  async function previewPdfInNewTab() {
    gatherFormData();
    try {
      const response = await fetch('/api/preview-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeData)
      });
      if (response.ok) {
        const blob = await response.blob();
        const pdfUrl = window.URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
        return;
      }
    } catch (e) {
      // Static edge
    }
    // High-DPI Print dialog fallback
    window.print();
  }

  // --- JSON Import & Export (Database-free data persistence) ---
  function exportJson() {
    gatherFormData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${activeData.invoice_number || 'invoice'}-data.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Invoice JSON exported successfully!', 'success');
  }

  function importJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        activeData = { ...defaultInvoiceData, ...parsed };
        renderFormFromState();
        triggerAutoSave();
        showToast('Invoice data imported successfully!', 'success');
      } catch (err) {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
  }

  // --- Sample Data Loader ---
  async function loadSampleData() {
    try {
      const res = await fetch('/api/sample');
      if (res.ok) {
        const sample = await res.json();
        activeData = { ...sample };
        renderFormFromState();
        triggerAutoSave();
        showToast('Loaded sample invoice data!', 'success');
      }
    } catch (e) {
      activeData = { ...defaultInvoiceData };
      renderFormFromState();
      triggerAutoSave();
      showToast('Loaded sample invoice data!', 'success');
    }
  }

  function resetAll() {
    if (!confirm('Are you sure you want to clear all invoice fields and start fresh?')) {
      return;
    }
    activeData = {
      ...defaultInvoiceData,
      invoice_number: 'INV-' + Math.floor(1000 + Math.random() * 9000),
      items: [{ description: '', sub_description: '', quantity: 1, rate: 0, tax_rate: 0 }],
      company_logo: '',
      discount_value: 0,
      overall_tax_rate: 0,
      shipping_fee: 0,
      amount_paid: 0,
      notes: '',
      terms: ''
    };
    renderFormFromState();
    triggerAutoSave();
    showToast('Invoice reset to blank template', 'info');
  }

  // --- Event Bindings ---
  function bindEvents() {
    // Top Bar actions
    els.btnDownloadPdf.addEventListener('click', downloadPdf);
    els.btnPreviewPdf.addEventListener('click', previewPdfInNewTab);
    els.btnThemeToggle.addEventListener('click', toggleTheme);
    els.btnPrint.addEventListener('click', () => window.print());
    els.btnSample.addEventListener('click', loadSampleData);
    els.btnResetForm.addEventListener('click', resetAll);
    els.btnAddItem.addEventListener('click', addNewLineItem);

    // JSON Import / Export
    els.btnExportJson.addEventListener('click', exportJson);
    els.jsonImporter.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importJson(e.target.files[0]);
        e.target.value = '';
      }
    });

    // Zoom buttons
    els.btnZoomIn.addEventListener('click', () => applyZoom(0.1));
    els.btnZoomOut.addEventListener('click', () => applyZoom(-0.1));
    els.btnZoomFit.addEventListener('click', fitZoomToViewport);

    // Accent Color Pickers
    if (els.accentColor) {
      els.accentColor.addEventListener('input', (e) => {
        updateAccentColor(e.target.value);
        triggerAutoSave();
      });
    }

    if (els.accentColorHex) {
      els.accentColorHex.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#') && val.length > 0) val = `#${val}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          if (els.accentColor) els.accentColor.value = val;
          updateAccentColor(val);
          triggerAutoSave();
        }
      });
      els.accentColorHex.addEventListener('blur', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#') && val.length > 0) val = `#${val}`;
        if (!/^#[0-9A-Fa-f]{6}$/.test(val)) {
          // Revert to current color if invalid
          e.target.value = (activeData.accent_color || '#4F46E5').toUpperCase();
        }
      });
    }

    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const hex = swatch.dataset.color;
        if (els.accentColor) els.accentColor.value = hex;
        updateAccentColor(hex);
        triggerAutoSave();
      });
    });

    // Logo Drag & Drop & Upload
    els.logoDropzone.addEventListener('click', (e) => {
      if (e.target.closest('#btn-remove-logo')) return;
      els.logoFileInput.click();
    });

    els.logoFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleLogoFile(e.target.files[0]);
      }
    });

    els.btnRemoveLogo.addEventListener('click', (e) => {
      e.stopPropagation();
      activeData.company_logo = '';
      els.logoPreviewBox.style.display = 'none';
      els.logoUploadPrompt.style.display = 'flex';
      els.logoFileInput.value = '';
      triggerAutoSave();
      showToast('Logo removed', 'info');
    });

    els.logoDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      els.logoDropzone.style.borderColor = 'var(--accent-color)';
    });

    els.logoDropzone.addEventListener('dragleave', () => {
      els.logoDropzone.style.borderColor = '';
    });

    els.logoDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      els.logoDropzone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleLogoFile(e.dataTransfer.files[0]);
      }
    });

    // Auto-update inputs on change
    const autoInputs = [
      els.paperSize, els.currency, els.invoiceNumber, els.status,
      els.issueDate, els.dueDate, els.poNumber,
      els.companyName, els.companyContact, els.companyTagline, els.companyEmail, els.companyPhone,
      els.companyAddress,
      els.clientCompany, els.clientName, els.clientEmail, els.clientPhone,
      els.clientTaxId, els.clientAddress,
      els.discountType, els.discountValue, els.overallTaxRate, els.shippingFee, els.amountPaid,
      els.paymentMethod, els.bankName, els.accountName, els.accountNumber, els.routingSwift, els.qrData,
      els.notes, els.terms, els.signatureName,
      els.sigPrepareName, els.sigPrepareDate,
      els.sigApproveName, els.sigApproveDate,
      els.sigCustomerName, els.sigCustomerDate,
      els.checkSigPrepare, els.checkSigApprove, els.checkSigCustomer
    ];

    autoInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', triggerAutoSave);
        input.addEventListener('change', triggerAutoSave);
      }
    });

    // Checkbox toggle animations
    if (els.checkSigPrepare && els.blockSigPrepare) {
      els.checkSigPrepare.addEventListener('change', (e) => {
        els.blockSigPrepare.classList.toggle('is-disabled', !e.target.checked);
        triggerAutoSave();
        showToast(e.target.checked ? 'Prepared By enabled' : 'Prepared By hidden from invoice', 'info');
      });
    }
    if (els.checkSigApprove && els.blockSigApprove) {
      els.checkSigApprove.addEventListener('change', (e) => {
        els.blockSigApprove.classList.toggle('is-disabled', !e.target.checked);
        triggerAutoSave();
        showToast(e.target.checked ? 'Approved By enabled' : 'Approved By hidden from invoice', 'info');
      });
    }
    if (els.checkSigCustomer && els.blockSigCustomer) {
      els.checkSigCustomer.addEventListener('change', (e) => {
        els.blockSigCustomer.classList.toggle('is-disabled', !e.target.checked);
        triggerAutoSave();
        showToast(e.target.checked ? 'Customer Signature enabled' : 'Customer Signature hidden from invoice', 'info');
      });
    }

    // --- Signatures Interactive Handlers (Prepared, Approved, Customer) ---
    // 1. Prepared by
    if (els.btnPrepareToday && els.sigPrepareDate) {
      els.btnPrepareToday.addEventListener('click', () => {
        els.sigPrepareDate.value = new Date().toISOString().split('T')[0];
        triggerAutoSave();
        showToast('Prepared Date set to Today', 'info');
      });
    }
    if (els.zoneSigPrepare && els.fileSigPrepare) {
      els.zoneSigPrepare.addEventListener('click', (e) => {
        if (e.target.closest('#btn-remove-prepare') || e.target.closest('#btn-clean-prepare')) return;
        els.fileSigPrepare.click();
      });
      els.fileSigPrepare.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleSignatureUpload('prepare', e.target.files[0]);
      });
      els.zoneSigPrepare.addEventListener('dragover', (e) => { e.preventDefault(); els.zoneSigPrepare.style.borderColor = 'var(--accent-color)'; });
      els.zoneSigPrepare.addEventListener('dragleave', () => { els.zoneSigPrepare.style.borderColor = ''; });
      els.zoneSigPrepare.addEventListener('drop', (e) => {
        e.preventDefault();
        els.zoneSigPrepare.style.borderColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleSignatureUpload('prepare', e.dataTransfer.files[0]);
      });
    }
    if (els.btnRemovePrepare) {
      els.btnRemovePrepare.addEventListener('click', (e) => {
        e.stopPropagation();
        removeSignature('prepare');
      });
    }
    if (els.btnCleanPrepare) {
      els.btnCleanPrepare.addEventListener('click', (e) => {
        e.stopPropagation();
        if (rawSignatureBlobs.prepare) {
          const isCleaned = els.btnCleanPrepare.classList.toggle('active');
          if (isCleaned) {
            cleanSignatureBackground(rawSignatureBlobs.prepare, (cleaned) => {
              applySignatureImage('prepare', cleaned);
              showToast('Signature background cleaned & perfected!', 'success');
            });
          } else {
            applySignatureImage('prepare', rawSignatureBlobs.prepare);
            showToast('Showing raw uploaded signature photo', 'info');
          }
        }
      });
    }

    // 2. Approved by
    if (els.btnApproveToday && els.sigApproveDate) {
      els.btnApproveToday.addEventListener('click', () => {
        els.sigApproveDate.value = new Date().toISOString().split('T')[0];
        triggerAutoSave();
        showToast('Approved Date set to Today', 'info');
      });
    }
    if (els.zoneSigApprove && els.fileSigApprove) {
      els.zoneSigApprove.addEventListener('click', (e) => {
        if (e.target.closest('#btn-remove-approve') || e.target.closest('#btn-clean-approve')) return;
        els.fileSigApprove.click();
      });
      els.fileSigApprove.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleSignatureUpload('approve', e.target.files[0]);
      });
      els.zoneSigApprove.addEventListener('dragover', (e) => { e.preventDefault(); els.zoneSigApprove.style.borderColor = 'var(--accent-color)'; });
      els.zoneSigApprove.addEventListener('dragleave', () => { els.zoneSigApprove.style.borderColor = ''; });
      els.zoneSigApprove.addEventListener('drop', (e) => {
        e.preventDefault();
        els.zoneSigApprove.style.borderColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleSignatureUpload('approve', e.dataTransfer.files[0]);
      });
    }
    if (els.btnRemoveApprove) {
      els.btnRemoveApprove.addEventListener('click', (e) => {
        e.stopPropagation();
        removeSignature('approve');
      });
    }
    if (els.btnCleanApprove) {
      els.btnCleanApprove.addEventListener('click', (e) => {
        e.stopPropagation();
        if (rawSignatureBlobs.approve) {
          const isCleaned = els.btnCleanApprove.classList.toggle('active');
          if (isCleaned) {
            cleanSignatureBackground(rawSignatureBlobs.approve, (cleaned) => {
              applySignatureImage('approve', cleaned);
              showToast('Signature background cleaned & perfected!', 'success');
            });
          } else {
            applySignatureImage('approve', rawSignatureBlobs.approve);
            showToast('Showing raw uploaded signature photo', 'info');
          }
        }
      });
    }

    // 3. Customer Signature
    if (els.btnCustomerToday && els.sigCustomerDate) {
      els.btnCustomerToday.addEventListener('click', () => {
        els.sigCustomerDate.value = new Date().toISOString().split('T')[0];
        triggerAutoSave();
        showToast('Customer Date set to Today', 'info');
      });
    }
    if (els.zoneSigCustomer && els.fileSigCustomer) {
      els.zoneSigCustomer.addEventListener('click', (e) => {
        if (e.target.closest('#btn-remove-customer') || e.target.closest('#btn-clean-customer')) return;
        els.fileSigCustomer.click();
      });
      els.fileSigCustomer.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleSignatureUpload('customer', e.target.files[0]);
      });
      els.zoneSigCustomer.addEventListener('dragover', (e) => { e.preventDefault(); els.zoneSigCustomer.style.borderColor = 'var(--accent-color)'; });
      els.zoneSigCustomer.addEventListener('dragleave', () => { els.zoneSigCustomer.style.borderColor = ''; });
      els.zoneSigCustomer.addEventListener('drop', (e) => {
        e.preventDefault();
        els.zoneSigCustomer.style.borderColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleSignatureUpload('customer', e.dataTransfer.files[0]);
      });
    }
    if (els.btnRemoveCustomer) {
      els.btnRemoveCustomer.addEventListener('click', (e) => {
        e.stopPropagation();
        removeSignature('customer');
      });
    }
    if (els.btnCleanCustomer) {
      els.btnCleanCustomer.addEventListener('click', (e) => {
        e.stopPropagation();
        if (rawSignatureBlobs.customer) {
          const isCleaned = els.btnCleanCustomer.classList.toggle('active');
          if (isCleaned) {
            cleanSignatureBackground(rawSignatureBlobs.customer, (cleaned) => {
              applySignatureImage('customer', cleaned);
              showToast('Signature background cleaned & perfected!', 'success');
            });
          } else {
            applySignatureImage('customer', rawSignatureBlobs.customer);
            showToast('Showing raw uploaded signature photo', 'info');
          }
        }
      });
    }

    // Invoice Metadata Interactive Actions
    if (els.btnRandomInv) {
      els.btnRandomInv.addEventListener('click', () => {
        const year = new Date().getFullYear();
        const randNum = String(Math.floor(1000 + Math.random() * 9000));
        els.invoiceNumber.value = `INV-${year}-${randNum}`;
        els.btnRandomInv.classList.add('spinning');
        setTimeout(() => els.btnRandomInv.classList.remove('spinning'), 400);
        triggerAutoSave();
        showToast(`Generated Invoice #${els.invoiceNumber.value}`, 'info');
      });
    }

    if (els.status) {
      els.status.addEventListener('change', () => {
        updateStatusDot(els.status.value);
      });
    }

    if (els.btnIssueToday) {
      els.btnIssueToday.addEventListener('click', () => {
        const todayStr = new Date().toISOString().split('T')[0];
        els.issueDate.value = todayStr;
        updateDueDiffBadge();
        triggerAutoSave();
        showToast('Issue Date set to Today', 'info');
      });
    }

    if (els.issueDate) {
      els.issueDate.addEventListener('change', updateDueDiffBadge);
      els.issueDate.addEventListener('input', updateDueDiffBadge);
    }

    if (els.dueDate) {
      els.dueDate.addEventListener('change', updateDueDiffBadge);
      els.dueDate.addEventListener('input', updateDueDiffBadge);
    }

    document.querySelectorAll('.date-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const days = parseInt(chip.dataset.days, 10);
        const baseDate = els.issueDate && els.issueDate.value ? new Date(els.issueDate.value + 'T00:00:00') : new Date();
        const targetDate = new Date(baseDate.getTime() + days * 86400000);
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        els.dueDate.value = `${yyyy}-${mm}-${dd}`;
        updateDueDiffBadge();
        triggerAutoSave();
      });
    });

    if (els.btnTogglePo && els.poDrawer) {
      els.btnTogglePo.addEventListener('click', () => {
        const isHidden = els.poDrawer.style.display === 'none' || !els.poDrawer.style.display;
        els.poDrawer.style.display = isHidden ? 'block' : 'none';
        els.btnTogglePo.classList.toggle('active', isHidden);
        if (isHidden && els.poNumber) {
          els.poNumber.focus();
        }
      });
    }

    // Window resize auto-fit preview if needed
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1200) {
        fitZoomToViewport();
      }
    });
  }

  // Boot on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
