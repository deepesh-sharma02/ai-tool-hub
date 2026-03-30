from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os
import pytesseract
from PIL import Image
import PyPDF2
from pdf2docx import Converter
from docx2pdf import convert
import img2pdf
import tempfile
import io

document_tools_bp = Blueprint('document_tools', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx', 'pptx', 'txt'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# OCR - Image to Text
@document_tools_bp.route('/ocr', methods=['POST'])
def image_ocr():
    """
    Extract text from images using Tesseract OCR
    Supports: JPG, PNG
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    lang = request.form.get('lang', 'eng')  # Default to English
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Language mapping for Tesseract
        lang_map = {
            'english': 'eng',
            'hindi': 'hin',
            'gujarati': 'guj',
            'marathi': 'mar',
            'tamil': 'tam',
            'telugu': 'tel',
            'bengali': 'ben',
            'auto': 'eng+hin+guj'  # Multiple languages
        }
        
        tesseract_lang = lang_map.get(lang.lower(), 'eng')
        
        # Open image
        image = Image.open(file.stream)
        
        # Perform OCR
        text = pytesseract.image_to_string(image, lang=tesseract_lang)
        
        # Get confidence score
        data = pytesseract.image_to_data(image, lang=tesseract_lang, output_type=pytesseract.Output.DICT)
        confidences = [int(conf) for conf in data['conf'] if conf != '-1']
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        return jsonify({
            'text': text,
            'language': lang,
            'confidence': f"{avg_confidence:.2f}%",
            'character_count': len(text),
            'word_count': len(text.split())
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# PDF to Word
@document_tools_bp.route('/pdf-to-word', methods=['POST'])
def pdf_to_word():
    """
    Convert PDF to Word document
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Save uploaded PDF temporarily
        pdf_path = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        file.save(pdf_path.name)
        
        # Output docx path
        docx_path = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')
        
        # Convert PDF to DOCX
        cv = Converter(pdf_path.name)
        cv.convert(docx_path.name)
        cv.close()
        
        # Clean up input file
        os.unlink(pdf_path.name)
        
        return send_file(
            docx_path.name,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name='converted.docx'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Word to PDF
@document_tools_bp.route('/word-to-pdf', methods=['POST'])
def word_to_pdf():
    """
    Convert Word document to PDF
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Save uploaded Word file
        docx_path = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')
        file.save(docx_path.name)
        
        # Output PDF path
        pdf_path = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        
        # Convert DOCX to PDF
        convert(docx_path.name, pdf_path.name)
        
        # Clean up input file
        os.unlink(docx_path.name)
        
        return send_file(
            pdf_path.name,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='converted.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Image to PDF
@document_tools_bp.route('/image-to-pdf', methods=['POST'])
def image_to_pdf():
    """
    Convert images to PDF
    """
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    
    if not files:
        return jsonify({'error': 'No files selected'}), 400
    
    try:
        image_paths = []
        
        # Save all images temporarily
        for file in files:
            if file and allowed_file(file.filename):
                img_path = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
                file.save(img_path.name)
                image_paths.append(img_path.name)
        
        # Convert images to PDF
        pdf_path = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        
        with open(pdf_path.name, 'wb') as f:
            f.write(img2pdf.convert(image_paths))
        
        # Clean up image files
        for img_path in image_paths:
            os.unlink(img_path)
        
        return send_file(
            pdf_path.name,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='images.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Compress PDF
@document_tools_bp.route('/compress-pdf', methods=['POST'])
def compress_pdf():
    """
    Compress PDF file to reduce size
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read PDF
        pdf_reader = PyPDF2.PdfReader(file)
        pdf_writer = PyPDF2.PdfWriter()
        
        # Copy all pages
        for page in pdf_reader.pages:
            pdf_writer.add_page(page)
        
        # Compress
        for page in pdf_writer.pages:
            page.compress_content_streams()
        
        # Save compressed PDF
        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='compressed.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotate PDF
@document_tools_bp.route('/rotate-pdf', methods=['POST'])
def rotate_pdf():
    """
    Rotate PDF pages
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    rotation = int(request.form.get('rotation', 90))  # Default 90 degrees
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read PDF
        pdf_reader = PyPDF2.PdfReader(file)
        pdf_writer = PyPDF2.PdfWriter()
        
        # Rotate all pages
        for page in pdf_reader.pages:
            page.rotate(rotation)
            pdf_writer.add_page(page)
        
        # Save rotated PDF
        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='rotated.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Protect PDF with password
@document_tools_bp.route('/protect-pdf', methods=['POST'])
def protect_pdf():
    """
    Add password protection to PDF
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    password = request.form.get('password', 'password123')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read PDF
        pdf_reader = PyPDF2.PdfReader(file)
        pdf_writer = PyPDF2.PdfWriter()
        
        # Copy all pages
        for page in pdf_reader.pages:
            pdf_writer.add_page(page)
        
        # Add password
        pdf_writer.encrypt(password)
        
        # Save protected PDF
        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='protected.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add Watermark to PDF
@document_tools_bp.route('/watermark-pdf', methods=['POST'])
def watermark_pdf():
    """
    Add watermark to PDF
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    watermark_text = request.form.get('text', 'CONFIDENTIAL')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # This is a simplified version
        # In production, use ReportLab or similar to create watermark
        
        return jsonify({
            'message': 'Watermark feature requires additional setup',
            'note': 'Install ReportLab and implement custom watermarking',
            'watermark_text': watermark_text
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Table Extraction from Image
@document_tools_bp.route('/extract-table', methods=['POST'])
def extract_table():
    """
    Extract tables from images
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    try:
        # This requires specialized libraries like camelot or tabula
        # For now, return OCR text
        image = Image.open(file.stream)
        text = pytesseract.image_to_string(image)
        
        return jsonify({
            'text': text,
            'note': 'Advanced table extraction requires camelot-py or tabula-py',
            'recommendation': 'Parse the OCR text to identify table structure'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
