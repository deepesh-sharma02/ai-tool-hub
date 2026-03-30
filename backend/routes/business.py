from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import io
import json
import os

business_bp = Blueprint('business', __name__)

# Simple JSON storage for invoices
INVOICES_FILE = 'data/invoices.json'

def load_invoices():
    os.makedirs('data', exist_ok=True)
    if os.path.exists(INVOICES_FILE):
        with open(INVOICES_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_invoices(invoices):
    os.makedirs('data', exist_ok=True)
    with open(INVOICES_FILE, 'w') as f:
        json.dump(invoices, f, indent=2)

# Create Invoice/Bill
@business_bp.route('/create-invoice', methods=['POST'])
@jwt_required()
def create_invoice():
    """
    Create professional invoice with GST calculation
    """
    data = request.json
    current_user = get_jwt_identity()
    
    # Extract invoice data
    business_name = data.get('business_name')
    business_address = data.get('business_address', '')
    business_phone = data.get('business_phone', '')
    business_gstin = data.get('business_gstin', '')
    
    customer_name = data.get('customer_name')
    customer_phone = data.get('customer_phone', '')
    customer_address = data.get('customer_address', '')
    
    items = data.get('items', [])
    gst_rate = float(data.get('gst_rate', 18))  # Default 18% GST
    
    if not business_name or not customer_name or not items:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # Calculate totals
        subtotal = sum(item['qty'] * item['price'] for item in items)
        gst_amount = subtotal * (gst_rate / 100)
        total = subtotal + gst_amount
        
        # Generate invoice number
        invoice_number = f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Create PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title = Paragraph(f"<b>INVOICE</b>", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Invoice details
        invoice_info = [
            ['Invoice Number:', invoice_number],
            ['Date:', datetime.now().strftime('%d/%m/%Y')],
            ['GSTIN:', business_gstin or 'N/A']
        ]
        invoice_table = Table(invoice_info, colWidths=[150, 300])
        elements.append(invoice_table)
        elements.append(Spacer(1, 20))
        
        # Business details
        business_info = Paragraph(f"<b>From:</b><br/>{business_name}<br/>{business_address}<br/>Phone: {business_phone}", styles['Normal'])
        elements.append(business_info)
        elements.append(Spacer(1, 20))
        
        # Customer details
        customer_info = Paragraph(f"<b>To:</b><br/>{customer_name}<br/>{customer_address}<br/>Phone: {customer_phone}", styles['Normal'])
        elements.append(customer_info)
        elements.append(Spacer(1, 20))
        
        # Items table
        item_data = [['Item', 'Qty', 'Price', 'Amount']]
        for item in items:
            item_data.append([
                item['name'],
                str(item['qty']),
                f"₹{item['price']:.2f}",
                f"₹{item['qty'] * item['price']:.2f}"
            ])
        
        items_table = Table(item_data, colWidths=[250, 80, 100, 100])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(items_table)
        elements.append(Spacer(1, 20))
        
        # Summary
        summary_data = [
            ['Subtotal:', f"₹{subtotal:.2f}"],
            [f'GST ({gst_rate}%):', f"₹{gst_amount:.2f}"],
            ['Total:', f"₹{total:.2f}"]
        ]
        summary_table = Table(summary_data, colWidths=[400, 130])
        summary_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -1), (-1, -1), 14),
            ('LINEABOVE', (0, -1), (-1, -1), 1, colors.black)
        ]))
        elements.append(summary_table)
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        
        # Save invoice record
        invoices = load_invoices()
        if current_user not in invoices:
            invoices[current_user] = []
        
        invoices[current_user].append({
            'invoice_number': invoice_number,
            'date': datetime.now().isoformat(),
            'customer_name': customer_name,
            'total': total,
            'items_count': len(items)
        })
        save_invoices(invoices)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'{invoice_number}.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Calculate GST
@business_bp.route('/calculate-gst', methods=['POST'])
def calculate_gst():
    """
    Calculate GST amounts
    """
    data = request.json
    amount = float(data.get('amount', 0))
    gst_rate = float(data.get('gst_rate', 18))
    include_gst = data.get('include_gst', False)  # Is GST included in amount?
    
    try:
        if include_gst:
            # Amount includes GST, extract it
            base_amount = amount / (1 + gst_rate/100)
            gst_amount = amount - base_amount
        else:
            # Add GST to amount
            base_amount = amount
            gst_amount = amount * (gst_rate / 100)
        
        total = base_amount + gst_amount
        
        # CGST and SGST (for intra-state)
        cgst = gst_amount / 2
        sgst = gst_amount / 2
        
        return jsonify({
            'base_amount': round(base_amount, 2),
            'gst_amount': round(gst_amount, 2),
            'cgst': round(cgst, 2),
            'sgst': round(sgst, 2),
            'total': round(total, 2),
            'gst_rate': gst_rate
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get Today's Sales
@business_bp.route('/todays-sales', methods=['GET'])
@jwt_required()
def todays_sales():
    """
    Get today's sales summary
    """
    current_user = get_jwt_identity()
    
    try:
        invoices = load_invoices()
        user_invoices = invoices.get(current_user, [])
        
        today = datetime.now().date()
        todays_invoices = [
            inv for inv in user_invoices
            if datetime.fromisoformat(inv['date']).date() == today
        ]
        
        total_sales = sum(inv['total'] for inv in todays_invoices)
        total_invoices = len(todays_invoices)
        
        return jsonify({
            'date': today.isoformat(),
            'total_sales': round(total_sales, 2),
            'total_invoices': total_invoices,
            'invoices': todays_invoices
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get Sales Report
@business_bp.route('/sales-report', methods=['GET'])
@jwt_required()
def sales_report():
    """
    Get sales report for a date range
    """
    current_user = get_jwt_identity()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    try:
        invoices = load_invoices()
        user_invoices = invoices.get(current_user, [])
        
        if start_date and end_date:
            start = datetime.fromisoformat(start_date).date()
            end = datetime.fromisoformat(end_date).date()
            
            filtered_invoices = [
                inv for inv in user_invoices
                if start <= datetime.fromisoformat(inv['date']).date() <= end
            ]
        else:
            filtered_invoices = user_invoices
        
        total_sales = sum(inv['total'] for inv in filtered_invoices)
        
        return jsonify({
            'start_date': start_date,
            'end_date': end_date,
            'total_sales': round(total_sales, 2),
            'total_invoices': len(filtered_invoices),
            'invoices': filtered_invoices
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
