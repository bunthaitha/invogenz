# 🧾 Invogenz • Laravel Invoice Studio (Zero-Database)

A modern, high-performance invoice generation application built with **Laravel 10**, **Blade**, and **Dompdf**. Designed specifically for shared hosting environments (cPanel, LiteSpeed, Apache) with **zero database requirement**.

---

## 🌟 Key Features

* **Zero-Database Architecture**: Runs without MySQL, SQLite files, or PostgreSQL. In-browser state persists via `localStorage`, JSON exports, and stateless PDF rendering.
* **PHP & LiteSpeed Native**: Works directly on any cPanel hosting server with PHP 8.1+ out of the box. No Phusion Passenger or Python virtual environment setup required.
* **Vector PDF Generation**: High-fidelity PDF rendering powered by `barryvdh/laravel-dompdf` (Dompdf).
* **Multi-Party Signatures**: Support for Prepared By, Approved By, and Customer Signatures with integrated photo upload, signature background cleaning, and auto-dating.
* **Live Interactive Preview**: Split-screen live preview with real-time tax calculation, discounts, shipping, balance tracking, and QR code integration.

---

## 🚀 Running Locally

1. Start the server with `run.bat` or artisan:
   ```bash
   php artisan serve --port=5000
   ```
2. Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

---

## 🌐 cPanel / Production Deployment

### Option A: Upload Pre-Built Deployment Zip (Fastest)
1. Upload the generated `invogenz-laravel-deploy.zip` to your cPanel folder (`invogenz.bkh.it.com`).
2. Extract the zip file in File Manager.
3. Access `https://invogenz.bkh.it.com/`!

### Option B: Deploy from GitHub
1. Pull the repository onto your server:
   ```bash
   git pull origin main
   ```
2. Install Composer dependencies:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

---

## 🏗️ Microservices Architecture (Serverless & Edge)

Invogenz is architected as a lightweight, distributed microservice system:

```
[ User Browser / Client App ]
              │
              ▼
    [ Cloudflare Worker ] ── (Edge Gateway / Router: worker.js)
        ├── GET /api/health       (Gateway health, edge node metadata)
        ├── GET /api/qr?text=...  (Edge QR Code Generation Microservice)
        └── POST /api/*           (Reverse proxy with CORS & load routing)
              │
              ▼
    [ PDF Engine Microservice ] (Laravel 10 DomPDF Engine)
        ├── GET  /api/health       (Microservice liveness check)
        ├── POST /api/generate-pdf (Binary vector PDF download)
        └── POST /api/preview-pdf  (Streamed PDF render)
```

### Microservice Endpoints

| Service | Route | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Edge Gateway** | `/api/health` | `GET` | Edge gateway liveness & upstream connectivity status |
| **Edge QR Engine** | `/api/qr?text={str}&size={px}` | `GET` | Ultra-fast SVG QR code generator at the CDN edge |
| **PDF Microservice** | `/api/generate-pdf` | `POST` | Stateless invoice JSON to downloadable vector PDF |
| **PDF Microservice** | `/api/preview-pdf` | `POST` | Stateless invoice JSON to inline preview stream |

---

## 📄 License
MIT License.

