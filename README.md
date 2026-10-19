# 🧾 Invogenz

A sleek, modern Python web application to generate professional vector PDF invoices with **zero database required**.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)
![ReportLab](https://img.shields.io/badge/ReportLab-4.2+-orange.svg)
![Database](https://img.shields.io/badge/Database-None%20(100%25%20File%2FMemory)-brightgreen.svg)

---

## ✨ Features

- **No Database Required**:
  - Automatically persists in browser `localStorage`.
  - Full **Import / Export as JSON** support — save and load unlimited invoice templates directly as files.
- **High-Definition Vector PDF Export**:
  - Built with **Python ReportLab** for crisp, print-ready vector PDF rendering.
  - Automatic page numbering (`Page 1 of 1`), header rules, and customizable paper formats (**A4** or **US Letter**).
- **Real-Time Interactive Live Preview**:
  - Live side-by-side editing: watch changes instantly update on a realistic paper sheet preview as you type.
  - Zoom controls (`Zoom In`, `Zoom Out`, `Fit to Viewport`).
- **Dynamic Line Items**:
  - Add, duplicate, delete, and adjust items on the fly.
  - Itemized quantity, rate, tax rate, and computed subtotals.
- **Smart Automatic Calculations**:
  - Subtotal, discounts (% or fixed), overall tax/VAT, shipping & handling fees, amount paid, and highlighted **Balance Due**.
- **Branding & Theming**:
  - Instant drag-and-drop company logo upload (PNG, JPG).
  - Custom brand accent color picker (Indigo, Sky Blue, Emerald, Crimson, Amber, Obsidian).
  - Multi-currency support (`$`, `€`, `£`, `¥`, `₹`, `៛`, `CHF`, `SGD`, `AED`, etc.).
  - Dark Mode & Light Mode UI toggle with smooth glassmorphic interface.
- **Dynamic Payment QR Code**:
  - Live QR code generation (using Python `qrcode` & client-side QRious) for instant mobile payment scanning or invoice verification.
- **Bank Instructions & Signature Line**:
  - Bank name, IBAN, account holder, SWIFT/BIC, and authorized signatory field.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Application
You can simply double-click `run.bat` or run:
```bash
python app.py
```

### 3. Open in Browser
Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

---

## 📁 Project Structure

```
Invoice Generateor/
├── app.py                # Flask application & API routes (/api/generate-pdf, /api/preview-pdf)
├── pdf_generator.py      # Core ReportLab vector PDF builder with tables, fonts, and QR codes
├── run.bat               # Windows 1-click launcher
├── requirements.txt      # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css     # Modern responsive design system, dark/light theme, print CSS
│   └── js/
│       └── app.js        # Dynamic form logic, live preview, auto-save, and PDF export
└── templates/
    └── index.html        # Single-page web application UI
```

---

## 💡 How It Works Without a Database

1. **In-Browser Auto-Save**: All form changes are continuously synced to `localStorage`, so refreshing or closing the browser won't lose your work.
2. **JSON Export & Import**: Click **Export** to save the invoice as a `.json` backup file. Click **Import** anytime to load previous invoices or templates.
3. **Python PDF Engine**: When you click **Download PDF**, the current invoice state is posted to Python's `/api/generate-pdf` endpoint, which renders the vector PDF using `ReportLab` and streams the `.pdf` file directly to your downloads folder.
---

## 🌐 Production Deployment
- **Live URL**: [https://inv.bkh.it.com/](https://inv.bkh.it.com/)
- **Repository**: [https://github.com/bunthaitha/inv.bkh.it.com](https://github.com/bunthaitha/inv.bkh.it.com)

