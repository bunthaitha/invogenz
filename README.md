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
1. Upload the generated `invogenz-laravel-deploy.zip` to your cPanel folder (`inv.bkh.it.com`).
2. Extract the zip file in File Manager.
3. Access `https://inv.bkh.it.com/`!

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

## 📄 License
MIT License.
