from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

auth_bp = Blueprint('auth', __name__)

# Simple JSON file database (replace with real database in production)
USERS_FILE = 'data/users.json'

def load_users():
    os.makedirs('data', exist_ok=True)
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    os.makedirs('data', exist_ok=True)
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')

    if not email or not password or not name:
        return jsonify({'message': 'Missing required fields'}), 400

    users = load_users()

    if email in users:
        return jsonify({'message': 'User already exists'}), 400

    # Hash password
    hashed_password = generate_password_hash(password)

    # Save user
    users[email] = {
        'email': email,
        'password': hashed_password,
        'name': name,
        'phone': phone or ''
    }
    save_users(users)

    # Create JWT token
    token = create_access_token(identity=email)

    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {
            'email': email,
            'name': name,
            'phone': phone or ''
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    users = load_users()

    if email not in users:
        return jsonify({'message': 'Invalid credentials'}), 401

    user = users[email]

    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Create JWT token
    token = create_access_token(identity=email)

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'email': user['email'],
            'name': user['name'],
            'phone': user.get('phone', '')
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_email = get_jwt_identity()
    users = load_users()
    
    if current_user_email not in users:
        return jsonify({'message': 'User not found'}), 404
    
    user = users[current_user_email]
    return jsonify({
        'email': user['email'],
        'name': user['name'],
        'phone': user.get('phone', '')
    }), 200
