from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import timedelta
import json

# Import route blueprints
from routes.auth import auth_bp
from routes.ai_tools import ai_tools_bp
from routes.document_tools import document_tools_bp
from routes.business import business_bp
from routes.career import career_bp

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize JWT
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(ai_tools_bp, url_prefix='/api/ai')
app.register_blueprint(document_tools_bp, url_prefix='/api/documents')
app.register_blueprint(business_bp, url_prefix='/api/business')
app.register_blueprint(career_bp, url_prefix='/api/career')

@app.route('/')
def index():
    return jsonify({
        'message': 'AI Seva Backend API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth',
            'ai_tools': '/api/ai',
            'documents': '/api/documents',
            'business': '/api/business',
            'career': '/api/career'
        }
    })

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
