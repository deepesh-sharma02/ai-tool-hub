from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os
from gtts import gTTS
from deep_translator import GoogleTranslator
from textblob import TextBlob
import PyPDF2
import io
import tempfile
from datetime import datetime

ai_tools_bp = Blueprint('ai_tools', __name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# AI Translation Tool
@ai_tools_bp.route('/translate', methods=['POST'])
def translate_text():
    """
    Real-time translation using Google Translate API
    Supports all major languages
    """
    data = request.json
    text = data.get('text')
    target_lang = data.get('target_lang', 'hi')  # Default to Hindi
    source_lang = data.get('source_lang', 'auto')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        # Language code mapping
        lang_map = {
            'hindi': 'hi',
            'gujarati': 'gu',
            'english': 'en',
            'marathi': 'mr',
            'tamil': 'ta',
            'telugu': 'te',
            'bengali': 'bn',
            'kannada': 'kn'
        }
        
        target = lang_map.get(target_lang.lower(), target_lang)
        
        # Translate using deep_translator
        translator = GoogleTranslator(source='auto', target=target)
        translated = translator.translate(text)
        
        return jsonify({
            'original': text,
            'translated': translated,
            'source_lang': source_lang,
            'target_lang': target
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Text to Speech
@ai_tools_bp.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    """
    Convert text to speech audio file
    """
    data = request.json
    text = data.get('text')
    lang = data.get('lang', 'en')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        # Language mapping
        lang_map = {
            'hindi': 'hi',
            'gujarati': 'gu',
            'english': 'en',
            'marathi': 'mr'
        }
        tts_lang = lang_map.get(lang.lower(), lang)
        
        # Create speech
        tts = gTTS(text=text, lang=tts_lang, slow=False)
        
        # Save to temporary file
        audio_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        tts.save(audio_file.name)
        
        return send_file(
            audio_file.name,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='speech.mp3'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Spell Check
@ai_tools_bp.route('/spell-check', methods=['POST'])
def spell_check():
    """
    Check and correct spelling using TextBlob
    """
    data = request.json
    text = data.get('text')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        blob = TextBlob(text)
        corrected = str(blob.correct())
        
        # Find differences
        original_words = text.split()
        corrected_words = corrected.split()
        
        corrections = []
        for i, (orig, corr) in enumerate(zip(original_words, corrected_words)):
            if orig != corr:
                corrections.append({
                    'original': orig,
                    'corrected': corr,
                    'position': i
                })
        
        return jsonify({
            'original': text,
            'corrected': corrected,
            'corrections': corrections,
            'has_errors': len(corrections) > 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Chat with PDF
@ai_tools_bp.route('/pdf-chat', methods=['POST'])
def pdf_chat():
    """
    Extract text from PDF and answer questions
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    question = request.form.get('question', '')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read PDF
        pdf_reader = PyPDF2.PdfReader(file)
        text = ''
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        # Store PDF text in session or database (simplified here)
        # In production, use a proper storage mechanism
        
        # Simple question answering (can be enhanced with AI models)
        # For now, search for relevant text containing question keywords
        keywords = question.lower().split()
        relevant_sentences = []
        
        sentences = text.split('.')
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in keywords):
                relevant_sentences.append(sentence.strip())
        
        answer = '. '.join(relevant_sentences[:3]) if relevant_sentences else "I couldn't find relevant information in the PDF."
        
        return jsonify({
            'question': question,
            'answer': answer,
            'pdf_length': len(text),
            'pages': len(pdf_reader.pages)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ask a Question (General Q&A)
@ai_tools_bp.route('/ask-question', methods=['POST'])
def ask_question():
    """
    Answer general questions
    Note: This is a simplified version. In production, integrate with OpenAI API or similar
    """
    data = request.json
    question = data.get('question')
    
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    try:
        # Simplified Q&A responses
        # In production, use OpenAI API, Google Gemini, or similar
        
        # Mock responses based on keywords
        question_lower = question.lower()
        
        if 'capital' in question_lower and 'india' in question_lower:
            answer = "The capital of India is New Delhi."
        elif 'who' in question_lower and 'prime minister' in question_lower:
            answer = "The current Prime Minister of India is Narendra Modi."
        elif 'what' in question_lower and 'time' in question_lower:
            answer = f"The current time is {datetime.now().strftime('%I:%M %p')}."
        else:
            answer = f"Thank you for your question: '{question}'. In a production environment, this would be answered by an AI model like GPT-4 or Google Gemini."
        
        return jsonify({
            'question': question,
            'answer': answer,
            'timestamp': str(datetime.now())
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Summarize Document
@ai_tools_bp.route('/summarize', methods=['POST'])
def summarize_document():
    """
    Summarize text or document
    """
    data = request.json if request.is_json else request.form
    text = data.get('text', '')
    
    # Handle file upload
    if 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(file)
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text()
        elif file.filename.endswith('.txt'):
            text = file.read().decode('utf-8')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        # Simple extractive summarization
        # In production, use transformers or OpenAI API
        sentences = text.split('.')
        
        # Take first few and last few sentences as summary
        num_sentences = min(5, len(sentences))
        summary = '. '.join(sentences[:num_sentences]) + '.'
        
        word_count_original = len(text.split())
        word_count_summary = len(summary.split())
        
        return jsonify({
            'original_length': word_count_original,
            'summary_length': word_count_summary,
            'summary': summary,
            'compression_ratio': f"{(word_count_summary/word_count_original)*100:.1f}%"
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Image Generation (Placeholder - requires external API)
@ai_tools_bp.route('/generate-image', methods=['POST'])
def generate_image():
    """
    Generate image from text prompt
    Note: Requires API key for services like OpenAI DALL-E, Stability AI, etc.
    """
    data = request.json
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    try:
        # This is a placeholder
        # In production, integrate with:
        # - OpenAI DALL-E API
        # - Stability AI
        # - Midjourney API
        
        return jsonify({
            'message': 'Image generation requires API integration',
            'prompt': prompt,
            'note': 'Please add your DALL-E or Stability AI API key to enable this feature',
            'placeholder_url': 'https://via.placeholder.com/512x512?text=Generated+Image'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Video Generation (Placeholder - complex feature)
@ai_tools_bp.route('/generate-video', methods=['POST'])
def generate_video():
    """
    Generate video from text prompt
    Note: This is a complex feature requiring specialized APIs
    """
    data = request.json
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    return jsonify({
        'message': 'Video generation requires complex AI integration',
        'prompt': prompt,
        'note': 'This feature requires APIs like Runway ML, Synthesia, or similar services',
        'estimated_cost': 'High',
        'recommendation': 'Consider using simpler slideshow/presentation tools for MVP'
    }), 200