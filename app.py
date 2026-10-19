import io
import os
import re
from datetime import datetime
from flask import Flask, render_template, request, send_file, jsonify
from pdf_generator import generate_invoice_pdf

app = Flask(__name__)

# Sample invoice data for quick loading
SAMPLE_INVOICE = {
    "paper_size": "A4",
    "accent_color": "#4F46E5",
    "currency": "$",
    "invoice_number": "INV-2026-0042",
    "status": "",
    "issue_date": datetime.now().strftime("%Y-%m-%d"),
    "due_date": datetime.now().strftime("%Y-%m-%d"),
    "po_number": "",
    "company_name": "Vertex Digital Solutions Inc.",
    "company_contact": "Marcus Vance",
    "company_tagline": "Enterprise Cloud Architecture & Digital Products",
    "company_address": "742 Evergreen Terrace, Suite 500\nSan Francisco, CA 94107\nUnited States",
    "company_email": "billing@vertexdigital.com",
    "company_phone": "+1 (415) 555-0199",
    "company_logo": "",
    "client_name": "Sarah Connor",
    "client_company": "Cyberdyne Systems Corp.",
    "client_address": "18144 El Camino Real, Building 4\nSunnyvale, CA 94087\nUnited States",
    "client_email": "sconnor@cyberdyne.io",
    "client_phone": "+1 (408) 555-0811",
    "client_tax_id": "US-10294857",
    "items": [
        {
            "description": "Cloud Architecture & Security Audit",
            "sub_description": "Multi-region AWS Kubernetes architecture design and migration roadmap",
            "quantity": 30,
            "rate": 150,
            "tax_rate": 0
        },
        {
            "description": "API Gateway & Microservices Engineering",
            "sub_description": "High-throughput asynchronous event streaming with Kafka & FastAPI",
            "quantity": 45,
            "rate": 125,
            "tax_rate": 0
        },
        {
            "description": "Automated CI/CD Pipeline & IaC Setup",
            "sub_description": "GitHub Actions, Terraform automated infrastructure, container registry security scanning",
            "quantity": 1,
            "rate": 2200,
            "tax_rate": 0
        }
    ],
    "discount_type": "percentage",
    "discount_value": 5,
    "overall_tax_rate": 8.5,
    "shipping_fee": 0,
    "amount_paid": 2500,
    "payment_method": "Wire Transfer / ACH",
    "bank_name": "Silicon Valley Commercial Bank",
    "account_name": "Vertex Digital Solutions Inc.",
    "account_number": "987654321098",
    "routing_swift": "SVCBUS6S",
    "qr_data": "https://pay.vertexdigital.com/inv/INV-2026-0042",
    "notes": "Thank you for your business! All deliverables are backed by our 30-day warranty and SLA guarantee.",
    "terms": "Payment is due within 14 calendar days from invoice issue date. A late fee of 1.5% per month applies to overdue balances.",
    "sig_prepare_name": "Marcus Vance",
    "sig_prepare_date": "2026-10-19",
    "sig_prepare_image": "",
    "sig_approve_name": "Elena Rostova",
    "sig_approve_date": "2026-10-19",
    "sig_approve_image": "",
    "sig_customer_name": "Sarah Connor",
    "sig_customer_date": "",
    "sig_customer_image": "",
    "signature_name": "Marcus Vance"
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/sample", methods=["GET"])
def get_sample():
    return jsonify(SAMPLE_INVOICE)


@app.route("/api/generate-pdf", methods=["POST"])
def generate_pdf():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No data provided"}), 400

        pdf_bytes = generate_invoice_pdf(data)

        # Sanitize invoice number for filename
        raw_num = data.get("invoice_number", "invoice")
        safe_num = re.sub(r"[^\w\-_\.]", "_", raw_num) or "invoice"
        filename = f"{safe_num}.pdf"

        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        app.logger.error(f"PDF Generation error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route("/api/preview-pdf", methods=["POST"])
def preview_pdf():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No data provided"}), 400

        pdf_bytes = generate_invoice_pdf(data)

        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=False
        )
    except Exception as e:
        app.logger.error(f"PDF Preview error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5000))
    print("\n" + "=" * 55)
    print("  Invogenz is running!")
    print(f"  Production URL: http://inv.bkh.it.com/")
    print(f"  Local / Server address: http://{host}:{port}")
    print("=" * 55 + "\n")
    app.run(host=host, port=port, debug=False)

