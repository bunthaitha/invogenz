import io
import os
import base64
from datetime import datetime
from PIL import Image as PILImage
import qrcode

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

# Register TrueType fonts if available on Windows, else fallback to standard fonts
FONT_REGULAR = "Helvetica"
FONT_BOLD = "Helvetica-Bold"

try:
    fonts_dir = "C:/Windows/Fonts"
    arial_path = os.path.join(fonts_dir, "arial.ttf")
    arial_bold_path = os.path.join(fonts_dir, "arialbd.ttf")
    if os.path.exists(arial_path) and os.path.exists(arial_bold_path):
        pdfmetrics.registerFont(TTFont("AppArial", arial_path))
        pdfmetrics.registerFont(TTFont("AppArial-Bold", arial_bold_path))
        FONT_REGULAR = "AppArial"
        FONT_BOLD = "AppArial-Bold"
except Exception:
    FONT_REGULAR = "Helvetica"
    FONT_BOLD = "Helvetica-Bold"


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print total page count 'Page X of Y'.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont(FONT_REGULAR, 8)
        self.setFillColor(colors.HexColor("#64748B"))

        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(self._pagesize[0] - 36, 25, page_text)

        # Thin rule above footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 38, self._pagesize[0] - 36, 38)

        self.restoreState()


def hex_to_color(hex_str, default="#4F46E5"):
    try:
        if not hex_str or not hex_str.startswith("#"):
            return colors.HexColor(default)
        return colors.HexColor(hex_str)
    except Exception:
        return colors.HexColor(default)


def lighten_hex(hex_str, factor=0.9):
    """Generate a soft pastel background tint of the accent color"""
    try:
        h = hex_str.lstrip("#")
        r, g, b = tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))
        r = int(r + (255 - r) * factor)
        g = int(g + (255 - g) * factor)
        b = int(b + (255 - b) * factor)
        return colors.Color(r / 255.0, g / 255.0, b / 255.0)
    except Exception:
        return colors.HexColor("#F8FAFC")


def format_currency(amount, currency_symbol="$"):
    try:
        val = float(amount)
        # Avoid double spaces if symbol is code
        return f"{currency_symbol} {val:,.2f}".strip()
    except Exception:
        return f"{currency_symbol} 0.00"


def generate_qr_image(data_text):
    """Creates a memory-based ReportLab Image for QR code"""
    if not data_text or not data_text.strip():
        return None
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=5,
            border=1,
        )
        qr.add_data(data_text.strip())
        qr.make(fit=True)
        img = qr.make_image(fill_color="#1E293B", back_color="white")

        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        return Image(buf, width=1.1 * inch, height=1.1 * inch)
    except Exception as e:
        print(f"Error generating QR code: {e}")
        return None


def decode_base64_logo(logo_data):
    """Decodes data:image/...;base64,... into a ReportLab Image"""
    if not logo_data or not isinstance(logo_data, str) or not logo_data.startswith("data:image"):
        return None
    try:
        header, encoded = logo_data.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        pil_img = PILImage.open(io.BytesIO(image_bytes))

        # Constrain width and height while preserving aspect ratio
        max_w = 1.8 * inch
        max_h = 0.9 * inch
        orig_w, orig_h = pil_img.size
        aspect = orig_h / orig_w

        calc_w = max_w
        calc_h = calc_w * aspect
        if calc_h > max_h:
            calc_h = max_h
            calc_w = calc_h / aspect

        buf = io.BytesIO(image_bytes)
        return Image(buf, width=calc_w, height=calc_h)
    except Exception as e:
        print(f"Error decoding logo: {e}")
        return None


def decode_base64_signature(sig_data, max_width=None, max_height=None):
    """Decodes data:image/...;base64,... into a clean, transparent ReportLab Image"""
    if not sig_data or not isinstance(sig_data, str) or not sig_data.startswith("data:image"):
        return None
    try:
        header, encoded = sig_data.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        pil_img = PILImage.open(io.BytesIO(image_bytes))

        # Ensure RGBA for transparency
        if pil_img.mode != "RGBA":
            pil_img = pil_img.convert("RGBA")

        # Auto-clean any remaining paper background pixels
        datas = pil_img.getdata()
        cleaned_datas = []
        for item in datas:
            if item[3] == 0:
                cleaned_datas.append(item)
            else:
                lum = 0.299 * item[0] + 0.587 * item[1] + 0.114 * item[2]
                if lum > 195:
                    cleaned_datas.append((255, 255, 255, 0))
                else:
                    alpha = min(255, int(item[3] * (1.0 - lum / 205) * 1.35))
                    cleaned_datas.append((15, 23, 42, alpha))
        pil_img.putdata(cleaned_datas)

        # Autocrop to ink bounding box
        bbox = pil_img.getbbox()
        if bbox:
            pil_img = pil_img.crop(bbox)

        max_w = (max_width if max_width is not None else 1.4 * inch)
        max_h = (max_height if max_height is not None else 0.42 * inch)
        orig_w, orig_h = pil_img.size
        aspect = orig_h / max(1, orig_w)
        calc_w = max_w
        calc_h = calc_w * aspect
        if calc_h > max_h:
            calc_h = max_h
            calc_w = calc_h / aspect

        buf = io.BytesIO()
        pil_img.save(buf, format="PNG")
        buf.seek(0)
        return Image(buf, width=calc_w, height=calc_h)
    except Exception as e:
        print(f"Error decoding signature: {e}")
        return None


def generate_invoice_pdf(data):
    """
    Generates a professional PDF invoice from a JSON/dictionary data structure.
    Returns bytes of the generated PDF.
    """
    # 1. Config & Theme
    page_size_name = data.get("paper_size", "A4").upper()
    page_size = A4 if page_size_name == "A4" else letter

    accent_hex = data.get("accent_color", "#4F46E5")
    primary_color = hex_to_color(accent_hex, "#4F46E5")
    accent_light = lighten_hex(accent_hex, 0.92)
    accent_soft = lighten_hex(accent_hex, 0.75)
    text_dark = colors.HexColor("#0F172A")
    text_muted = colors.HexColor("#64748B")
    border_color = colors.HexColor("#E2E8F0")

    currency_sym = data.get("currency", "$")

    # Document setup with 36pt (0.5 inch) margins for modern wide layout
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=page_size,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=46,
    )

    story = []
    printable_width = page_size[0] - 72

    # Typography styles
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "InvTitle",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=24,
        leading=28,
        textColor=primary_color,
        alignment=2,  # Right align
    )

    badge_style = ParagraphStyle(
        "InvBadge",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1,  # Center
    )

    meta_label_style = ParagraphStyle(
        "MetaLabel",
        parent=styles["Normal"],
        fontName=FONT_REGULAR,
        fontSize=8,
        leading=11,
        textColor=text_muted,
        alignment=2,
    )

    meta_val_style = ParagraphStyle(
        "MetaVal",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=9,
        leading=12,
        textColor=text_dark,
        alignment=2,
    )

    comp_name_style = ParagraphStyle(
        "CompName",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=15,
        leading=18,
        textColor=text_dark,
    )

    comp_tagline_style = ParagraphStyle(
        "CompTagline",
        parent=styles["Normal"],
        fontName=FONT_REGULAR,
        fontSize=9,
        leading=12,
        textColor=primary_color,
    )

    body_style = ParagraphStyle(
        "InvBody",
        parent=styles["Normal"],
        fontName=FONT_REGULAR,
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
    )

    body_bold = ParagraphStyle(
        "InvBodyBold",
        parent=body_style,
        fontName=FONT_BOLD,
        textColor=text_dark,
    )

    card_header_style = ParagraphStyle(
        "CardHead",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=9,
        leading=12,
        textColor=primary_color,
    )

    th_style = ParagraphStyle(
        "TableHead",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
    )

    th_style_right = ParagraphStyle(
        "TableHeadRight",
        parent=th_style,
        alignment=2,
    )

    td_style = ParagraphStyle(
        "TableBody",
        parent=styles["Normal"],
        fontName=FONT_REGULAR,
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B"),
    )

    td_style_bold = ParagraphStyle(
        "TableBodyBold",
        parent=td_style,
        fontName=FONT_BOLD,
    )

    td_style_right = ParagraphStyle(
        "TableBodyRight",
        parent=td_style,
        alignment=2,
    )

    # ----------------------------------------------------
    # HEADER SECTION: Company Identity (Left) vs Invoice Details (Right)
    # ----------------------------------------------------
    logo_flowable = decode_base64_logo(data.get("company_logo"))

    left_header_elements = []
    company_name = data.get("company_name", "").strip()

    if logo_flowable:
        left_header_elements.append(logo_flowable)
        left_header_elements.append(Spacer(1, 4))
        # Removed company name under logo when logo is present
    elif company_name:
        left_header_elements.append(Paragraph(company_name, comp_name_style))

    company_tagline = data.get("company_tagline", "").strip()
    if company_tagline:
        left_header_elements.append(Paragraph(company_tagline, comp_tagline_style))
        left_header_elements.append(Spacer(1, 3))

    # Contact Person
    comp_contact = data.get("company_contact", "").strip()
    if comp_contact:
        contact_display = comp_contact if comp_contact.lower().startswith("contact person:") else f"Contact Person: {comp_contact}"
        left_header_elements.append(Paragraph(contact_display, body_bold))

    # Company address & contact
    comp_addr = data.get("company_address", "").strip()
    if comp_addr:
        for line in comp_addr.split("\n"):
            if line.strip():
                left_header_elements.append(Paragraph(line.strip(), body_style))
    comp_phone = data.get("company_phone", "").strip()
    comp_email = data.get("company_email", "").strip()
    comp_contact_parts = []
    if comp_phone:
        comp_contact_parts.append(comp_phone)
    if comp_email:
        comp_contact_parts.append(comp_email)
    if comp_contact_parts:
        left_header_elements.append(Paragraph(" • ".join(comp_contact_parts), body_style))

    # Right side: Title, Invoice #, Issue Date, Due Date
    inv_number = data.get("invoice_number", "INV-2026-0042")
    inv_status = (data.get("status") or "").strip().upper()
    inv_date = data.get("issue_date") or datetime.now().strftime("%Y-%m-%d")
    due_date = data.get("due_date") or inv_date
    po_number = data.get("po_number", "").strip()

    right_header_elements = [
        Paragraph("INVOICE", title_style),
        Spacer(1, 3),
    ]

    # Meta table on the right
    meta_rows = [
        [
            Paragraph("Invoice Number:", meta_label_style),
            Paragraph(inv_number, meta_val_style),
        ],
        [
            Paragraph("Issue Date:", meta_label_style),
            Paragraph(inv_date, meta_val_style),
        ],
        [
            Paragraph("Due Date:", meta_label_style),
            Paragraph(due_date, meta_val_style),
        ],
    ]

    right_meta_table = Table(
        meta_rows,
        colWidths=[80, 110],
        hAlign="RIGHT",
    )
    right_meta_table.setStyle(
        TableStyle([
            ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
        ])
    )

    right_header_elements.append(right_meta_table)

    # Only render status badge if status is explicitly set (e.g. PAID, OVERDUE, DRAFT)
    if inv_status and inv_status != "NONE":
        status_color_map = {
            "PAID": colors.HexColor("#10B981"),
            "OVERDUE": colors.HexColor("#EF4444"),
            "DRAFT": colors.HexColor("#64748B"),
        }
        badge_bg = status_color_map.get(inv_status, primary_color)
        status_table = Table(
            [[Paragraph(f"STATUS: {inv_status}", badge_style)]],
            colWidths=[100],
            rowHeights=[18],
        )
        status_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), badge_bg),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("ROUNDEDCORNERS", [3, 3, 3, 3]),
            ])
        )
        right_header_elements.append(Spacer(1, 4))
        right_header_elements.append(status_table)

    header_table = Table(
        [[left_header_elements, right_header_elements]],
        colWidths=[printable_width * 0.58, printable_width * 0.42],
    )
    header_table.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
        ])
    )
    story.append(header_table)

    story.append(Spacer(1, 12))
    story.append(
        HRFlowable(
            width="100%",
            thickness=2,
            color=primary_color,
            spaceBefore=0,
            spaceAfter=12,
        )
    )

    # ----------------------------------------------------
    # BILLING CARD: BILLED TO (Client)
    # ----------------------------------------------------
    client_lines = []
    client_name = data.get("client_name", "Valued Client").strip()
    client_company = data.get("client_company", "").strip()
    if client_company:
        client_lines.append(Paragraph(client_company, body_bold))
    client_lines.append(Paragraph(client_name, body_bold if not client_company else body_style))

    client_addr = data.get("client_address", "").strip()
    if client_addr:
        for line in client_addr.split("\n"):
            if line.strip():
                client_lines.append(Paragraph(line.strip(), body_style))

    client_contacts = []
    client_phone = data.get("client_phone", "").strip()
    client_email = data.get("client_email", "").strip()
    if client_phone:
        client_contacts.append(client_phone)
    if client_email:
        client_contacts.append(client_email)
    if client_contacts:
        client_lines.append(Paragraph(" • ".join(client_contacts), body_style))

    client_tax_id = data.get("client_tax_id", "").strip()
    if client_tax_id:
        client_lines.append(Paragraph(f"Tax / VAT ID: {client_tax_id}", body_style))

    client_box = [
        Paragraph("BILLED TO / CLIENT", card_header_style),
        Spacer(1, 4),
        *client_lines,
    ]

    billing_table = Table(
        [[client_box]],
        colWidths=[printable_width * 0.55],
        spaceBefore=0,
        spaceAfter=14,
        hAlign="LEFT",
    )
    billing_table.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#F8FAFC")),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("ROUNDEDCORNERS", [4, 4, 4, 4]),
            ("BOX", (0, 0), (0, 0), 0.5, border_color),
        ])
    )
    story.append(billing_table)

    # ----------------------------------------------------
    # LINE ITEMS TABLE
    # ----------------------------------------------------
    items = data.get("items", [])
    if not items:
        items = [{"description": "Standard Service", "quantity": 1, "rate": 0, "tax_rate": 0}]

    # Table columns: #, Description, Qty, Rate, Tax, Total
    col_w_idx = 24
    col_w_qty = 46
    col_w_rate = 74
    col_w_tax = 48
    col_w_tot = 86
    col_w_desc = printable_width - (col_w_idx + col_w_qty + col_w_rate + col_w_tax + col_w_tot)

    items_header = [
        Paragraph("#", th_style),
        Paragraph("Item / Description", th_style),
        Paragraph("Qty", th_style_right),
        Paragraph("Rate", th_style_right),
        Paragraph("Tax", th_style_right),
        Paragraph("Line Total", th_style_right),
    ]

    table_data = [items_header]

    computed_subtotal = 0.0
    computed_tax_total = 0.0

    for i, itm in enumerate(items, start=1):
        desc = itm.get("description", "Item").strip()
        sub_desc = itm.get("sub_description", "").strip()

        try:
            qty = float(itm.get("quantity", 1))
        except (ValueError, TypeError):
            qty = 1.0

        try:
            rate = float(itm.get("rate", 0))
        except (ValueError, TypeError):
            rate = 0.0

        try:
            item_tax = float(itm.get("tax_rate", 0))
        except (ValueError, TypeError):
            item_tax = 0.0

        line_base = qty * rate
        line_tax = line_base * (item_tax / 100.0)
        line_total = line_base + line_tax

        computed_subtotal += line_base
        computed_tax_total += line_tax

        desc_flowables = [Paragraph(desc, td_style_bold)]
        if sub_desc:
            desc_flowables.append(
                Paragraph(
                    sub_desc,
                    ParagraphStyle(
                        "SubDesc",
                        parent=body_style,
                        fontSize=7.5,
                        textColor=text_muted,
                    ),
                )
            )

        tax_text = f"{item_tax:.0f}%" if item_tax > 0 else "—"

        row = [
            Paragraph(str(i), td_style),
            desc_flowables,
            Paragraph(f"{qty:g}", td_style_right),
            Paragraph(format_currency(rate, currency_sym), td_style_right),
            Paragraph(tax_text, td_style_right),
            Paragraph(format_currency(line_total, currency_sym), td_style_right),
        ]
        table_data.append(row)

    items_table = Table(
        table_data,
        colWidths=[col_w_idx, col_w_desc, col_w_qty, col_w_rate, col_w_tax, col_w_tot],
        repeatRows=1,
    )

    t_style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), primary_color),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
    ]

    # Alternating row background for luxury feel
    for r in range(1, len(table_data)):
        if r % 2 == 0:
            t_style_cmds.append(("BACKGROUND", (0, r), (-1, r), colors.HexColor("#F8FAFC")))

    items_table.setStyle(TableStyle(t_style_cmds))
    story.append(items_table)
    story.append(Spacer(1, 14))

    # ----------------------------------------------------
    # TOTALS & PAYMENT DETAILS (Side-by-side)
    # ----------------------------------------------------
    # Calculate discounts, extra tax, shipping, amount paid
    discount_val = 0.0
    discount_raw = float(data.get("discount_value", 0) or 0)
    discount_type = data.get("discount_type", "fixed")
    if discount_type == "percentage":
        discount_val = computed_subtotal * (discount_raw / 100.0)
    else:
        discount_val = discount_raw

    extra_tax_rate = float(data.get("overall_tax_rate", 0) or 0)
    extra_tax_val = (computed_subtotal - discount_val) * (extra_tax_rate / 100.0)
    total_tax = computed_tax_total + extra_tax_val

    shipping_val = float(data.get("shipping_fee", 0) or 0)
    grand_total = max(0.0, computed_subtotal - discount_val + total_tax + shipping_val)

    amount_paid = float(data.get("amount_paid", 0) or 0)
    balance_due = max(0.0, grand_total - amount_paid)

    # Right side: Summary Rows
    summary_rows = [
        [
            Paragraph("Subtotal", meta_label_style),
            Paragraph(format_currency(computed_subtotal, currency_sym), meta_val_style),
        ],
    ]

    if discount_val > 0:
        disc_label = f"Discount ({discount_raw:.0f}%)" if discount_type == "percentage" else "Discount"
        summary_rows.append([
            Paragraph(disc_label, meta_label_style),
            Paragraph(f"-{format_currency(discount_val, currency_sym)}", meta_val_style),
        ])

    if total_tax > 0:
        summary_rows.append([
            Paragraph("Tax / VAT", meta_label_style),
            Paragraph(format_currency(total_tax, currency_sym), meta_val_style),
        ])

    if shipping_val > 0:
        summary_rows.append([
            Paragraph("Shipping & Handling", meta_label_style),
            Paragraph(format_currency(shipping_val, currency_sym), meta_val_style),
        ])

    # Grand Total row
    summary_rows.append([
        Paragraph("Grand Total", ParagraphStyle("GTLabel", parent=meta_val_style, fontSize=11, fontName=FONT_BOLD)),
        Paragraph(
            format_currency(grand_total, currency_sym),
            ParagraphStyle("GTVal", parent=meta_val_style, fontSize=12, fontName=FONT_BOLD, textColor=primary_color),
        ),
    ])

    if amount_paid > 0:
        summary_rows.append([
            Paragraph("Amount Paid", meta_label_style),
            Paragraph(format_currency(amount_paid, currency_sym), meta_val_style),
        ])

    # Balance Due prominent row
    balance_bg = primary_color if balance_due > 0 else colors.HexColor("#10B981")
    summary_rows.append([
        Paragraph(
            "<b>Balance Due</b>",
            ParagraphStyle("BDLabel", parent=badge_style, alignment=0, fontSize=9),
        ),
        Paragraph(
            f"<b>{format_currency(balance_due, currency_sym)}</b>",
            ParagraphStyle("BDVal", parent=badge_style, alignment=2, fontSize=11),
        ),
    ])

    summary_table = Table(
        summary_rows,
        colWidths=[110, 130],
        hAlign="RIGHT",
    )

    sum_style = [
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, colors.HexColor("#F1F5F9")),
        # Style the Balance Due row (last row)
        ("BACKGROUND", (0, -1), (-1, -1), balance_bg),
        ("TOPPADDING", (0, -1), (-1, -1), 6),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 6),
        ("ROUNDEDCORNERS", [3, 3, 3, 3]),
    ]
    summary_table.setStyle(TableStyle(sum_style))

    # Left side: Payment Info & Optional QR Code
    payment_elements = []
    payment_method = data.get("payment_method", "").strip()
    bank_name = data.get("bank_name", "").strip()
    account_name = data.get("account_name", "").strip()
    account_number = data.get("account_number", "").strip()
    routing_swift = data.get("routing_swift", "").strip()
    qr_data = data.get("qr_data", "").strip()

    has_payment_info = any([payment_method, bank_name, account_name, account_number, routing_swift])

    if has_payment_info:
        payment_elements.append(Paragraph("PAYMENT INSTRUCTIONS", card_header_style))
        payment_elements.append(Spacer(1, 4))
        if payment_method:
            payment_elements.append(Paragraph(f"<b>Method:</b> {payment_method}", body_style))
        if bank_name:
            payment_elements.append(Paragraph(f"<b>Bank:</b> {bank_name}", body_style))
        if account_name:
            payment_elements.append(Paragraph(f"<b>Account Name:</b> {account_name}", body_style))
        if account_number:
            payment_elements.append(Paragraph(f"<b>Account / IBAN:</b> {account_number}", body_style))
        if routing_swift:
            payment_elements.append(Paragraph(f"<b>SWIFT / Routing:</b> {routing_swift}", body_style))

    qr_flowable = generate_qr_image(qr_data) if qr_data else None

    # Pack payment info and QR code side-by-side inside left pane
    if qr_flowable and has_payment_info:
        pay_qr_table = Table(
            [[payment_elements, qr_flowable]],
            colWidths=[printable_width * 0.32, printable_width * 0.18],
        )
        pay_qr_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (1, 0), (1, 0), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ])
        )
        left_summary_content = pay_qr_table
    elif qr_flowable:
        left_summary_content = [
            Paragraph("SCAN TO PAY / VERIFY", card_header_style),
            Spacer(1, 4),
            qr_flowable,
        ]
    elif has_payment_info:
        left_summary_content = payment_elements
    else:
        left_summary_content = [
            Paragraph("Thank you for choosing our services!", body_bold),
            Spacer(1, 3),
            Paragraph("Please reach out if you have any questions regarding this invoice.", body_style),
        ]

    bottom_split_table = Table(
        [[left_summary_content, summary_table]],
        colWidths=[printable_width * 0.52, printable_width * 0.48],
    )
    bottom_split_table.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ])
    )

    story.append(KeepTogether([bottom_split_table]))

    # ----------------------------------------------------
    # NOTES & TERMS & SIGNATURE
    # ----------------------------------------------------
    notes = data.get("notes", "").strip()
    terms = data.get("terms", "").strip()
    signature_name = data.get("signature_name", "").strip()

    if notes or terms:
        story.append(Spacer(1, 12))
        notes_elements = []
        if notes:
            notes_elements.append(Paragraph("<b>Notes:</b>", card_header_style))
            notes_elements.append(Paragraph(notes.replace("\n", "<br/>"), body_style))
            notes_elements.append(Spacer(1, 4))
        if terms:
            notes_elements.append(Paragraph("<b>Terms & Conditions:</b>", card_header_style))
            notes_elements.append(Paragraph(terms.replace("\n", "<br/>"), body_style))
        story.append(KeepTogether(notes_elements))

    # ----------------------------------------------------
    # MULTI-PARTY SIGNATURES & APPROVALS
    # Prepared by, Approved by, Customer Signature
    # ----------------------------------------------------
    sig_prepare_name = data.get("sig_prepare_name", "").strip()
    sig_prepare_date = data.get("sig_prepare_date", "").strip()
    sig_prepare_img_raw = data.get("sig_prepare_image", "")

    sig_approve_name = data.get("sig_approve_name", "").strip()
    sig_approve_date = data.get("sig_approve_date", "").strip()
    sig_approve_img_raw = data.get("sig_approve_image", "")

    sig_customer_name = data.get("sig_customer_name", "").strip()
    sig_customer_date = data.get("sig_customer_date", "").strip()
    sig_customer_img_raw = data.get("sig_customer_image", "")

    has_signatures = any([
        sig_prepare_name, sig_prepare_date, sig_prepare_img_raw,
        sig_approve_name, sig_approve_date, sig_approve_img_raw,
        sig_customer_name, sig_customer_date, sig_customer_img_raw,
        data.get("signature_name", "").strip()
    ])

    # Backward compatibility with single signature_name
    if not sig_approve_name and data.get("signature_name"):
        sig_approve_name = data.get("signature_name").strip()

    # Signature display flags (checked/unchecked)
    show_prepare = data.get("show_sig_prepare", True)
    show_approve = data.get("show_sig_approve", True)
    show_customer = data.get("show_sig_customer", True)

    active_cols = []
    if show_prepare and (sig_prepare_name or sig_prepare_date or sig_prepare_img_raw):
        active_cols.append(("Prepare by", sig_prepare_name, sig_prepare_date, sig_prepare_img_raw))
    elif show_prepare:
        active_cols.append(("Prepare by", sig_prepare_name, sig_prepare_date, sig_prepare_img_raw))

    if show_approve and (sig_approve_name or sig_approve_date or sig_approve_img_raw):
        active_cols.append(("Approved by", sig_approve_name, sig_approve_date, sig_approve_img_raw))
    elif show_approve:
        active_cols.append(("Approved by", sig_approve_name, sig_approve_date, sig_approve_img_raw))

    if show_customer and (sig_customer_name or sig_customer_date or sig_customer_img_raw):
        active_cols.append(("Customer Signature", sig_customer_name, sig_customer_date, sig_customer_img_raw))
    elif show_customer:
        active_cols.append(("Customer Signature", sig_customer_name, sig_customer_date, sig_customer_img_raw))

    if active_cols and has_signatures:
        story.append(Spacer(1, 16))

        def build_sig_col(title_label, name_val, date_val, img_b64, max_col_w):
            col_items = []
            col_items.append(Paragraph(f"<b>{title_label.upper()}</b>", ParagraphStyle(
                "SigTitle",
                parent=body_bold,
                fontSize=8.5,
                leading=10,
                textColor=primary_color,
                alignment=1
            )))
            col_items.append(Spacer(1, 4))

            # Image slot (fixed height box)
            sig_flowable = decode_base64_signature(img_b64, max_width=min(140, max_col_w - 20), max_height=42)
            if sig_flowable:
                col_items.append(sig_flowable)
                col_items.append(Spacer(1, 3))
            else:
                col_items.append(Spacer(1, 35))

            # Signature Line Rule
            col_items.append(HRFlowable(width="85%", thickness=1, color=border_color, hAlign="CENTER"))
            col_items.append(Spacer(1, 4))

            # Signer Name
            display_name = name_val if name_val else "( Name )"
            name_style = ParagraphStyle(
                "SigNameText",
                parent=body_bold,
                fontSize=9,
                leading=11,
                textColor=text_dark if name_val else text_muted,
                alignment=1
            )
            col_items.append(Paragraph(display_name, name_style))

            # Signer Date
            display_date = f"Date: {date_val}" if date_val else "Date: ___________"
            date_style = ParagraphStyle(
                "SigDateText",
                parent=body_style,
                fontSize=8,
                leading=10,
                textColor=text_muted,
                alignment=1
            )
            col_items.append(Spacer(1, 2))
            col_items.append(Paragraph(display_date, date_style))

            return col_items

        num_cols = len(active_cols)
        col_w = printable_width / float(num_cols)
        rendered_cols = [build_sig_col(c[0], c[1], c[2], c[3], col_w) for c in active_cols]

        sig_matrix = Table([rendered_cols], colWidths=[col_w] * num_cols)
        sig_matrix.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ])
        )
        story.append(KeepTogether([sig_matrix]))

    # Build the PDF using NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    buffer.seek(0)
    return buffer.getvalue()
