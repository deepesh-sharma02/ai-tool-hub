# AI Seva - Complete Implementation Guide

## ✅ What's Already Implemented

### Frontend (React + TypeScript)
- ✅ Complete authentication system with login/signup
- ✅ 12 AI and document tool interfaces
- ✅ Multi-language support (English, Hindi, Gujarati)
- ✅ Responsive mobile-first design
- ✅ JWT token management
- ✅ Updated AI Translation tool with real backend integration

### Backend (Python Flask)
- ✅ Complete authentication API with JWT
- ✅ Real AI translation using deep-translator
- ✅ Text-to-speech using gTTS
- ✅ Spell checking using TextBlob
- ✅ OCR using Tesseract
- ✅ PDF processing (convert, compress, protect, rotate)
- ✅ Invoice generation with GST calculation
- ✅ Career recommendation system with real data
- ✅ Document summarization
- ✅ PDF chat functionality

## 🚀 Quick Start

### Backend Setup

1. **Install Python 3.8+**
   ```bash
   python --version
   ```

2. **Install Tesseract OCR**
   
   Ubuntu/Debian:
   ```bash
   sudo apt-get update
   sudo apt-get install tesseract-ocr
   sudo apt-get install tesseract-ocr-hin tesseract-ocr-guj
   ```

   Windows:
   - Download from: https://github.com/UB-Mannheim/tesseract/wiki
   - Add to PATH

   macOS:
   ```bash
   brew install tesseract
   brew install tesseract-lang
   ```

3. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   
   # Activate
   # Windows: venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   
   pip install -r requirements.txt
   python -m textblob.download_corpora
   ```

4. **Run Backend**
   ```bash
   python app.py
   ```
   Backend runs on http://localhost:5000

### Frontend Setup

Frontend is already configured. Just ensure the backend is running on port 5000.

## 📝 Updating Remaining Tools

The AI Translation tool has been updated as an example. Follow this pattern for other tools:

### Pattern for API Integration:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // If auth required
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      // Handle success
    } else {
      // Handle error
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

### Tools to Update:

1. **Spell Check Tool** (`/src/app/components/tools/SpellCheckTool.tsx`)
   - Endpoint: `POST /api/ai/spell-check`
   - Body: `{ text: string }`

2. **PDF Chat Tool** (`/src/app/components/tools/PDFChatTool.tsx`)
   - Upload: `POST /api/ai/pdf-chat` (multipart/form-data)
   - Body: `file` + `question`

3. **Ask Question Tool** (`/src/app/components/tools/AskQuestionTool.tsx`)
   - Endpoint: `POST /api/ai/ask-question`
   - Body: `{ question: string }`

4. **Image Generator Tool** (`/src/app/components/tools/ImageGeneratorTool.tsx`)
   - Endpoint: `POST /api/ai/generate-image`
   - Note: Requires external API (OpenAI DALL-E or Stability AI)
   - For now, shows placeholder

5. **Summarize Tool** (`/src/app/components/tools/SummarizeTool.tsx`)
   - Endpoint: `POST /api/ai/summarize`
   - Body: `{ text: string }` or file upload

6. **Speech-to-Text Tool** (`/src/app/components/tools/SpeechToTextTool.tsx`)
   - TTS: `POST /api/ai/text-to-speech`
   - STT: Use browser's Web Speech API

7. **Image OCR Tool** (`/src/app/components/tools/ImageOCRTool.tsx`)
   - Endpoint: `POST /api/documents/ocr`
   - Body: multipart/form-data with `file` and `lang`

8. **PDF Converter Tool** (`/src/app/components/tools/PDFConverterTool.tsx`)
   - Endpoints:
     - `POST /api/documents/pdf-to-word`
     - `POST /api/documents/word-to-pdf`
     - `POST /api/documents/image-to-pdf`
     - `POST /api/documents/compress-pdf`
     - `POST /api/documents/rotate-pdf`
     - `POST /api/documents/protect-pdf`

9. **Invoice Tool** (`/src/app/components/tools/InvoiceTool.tsx`)
   - Endpoint: `POST /api/business/create-invoice`
   - Requires JWT auth
   - Returns PDF file

10. **Career Wizard** (`/src/app/components/tools/CareerWizard.tsx`)
    - Endpoint: `POST /api/career/recommend`
    - Body: `{ age: number, interest: string, education: string }`

## 📄 Static Pages to Create

### About Page
```typescript
// /src/app/components/About.tsx
export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-6">About AI Seva</h1>
      <p>AI Seva is a comprehensive platform that brings AI-powered tools to everyone...</p>
      
      <h2 className="text-2xl mt-8 mb-4">Our Mission</h2>
      <p>To make AI technology accessible to every Indian, regardless of their technical background...</p>
      
      <h2 className="text-2xl mt-8 mb-4">Features</h2>
      <ul>
        <li>Free AI-powered tools</li>
        <li>Multi-language support</li>
        <li>No data storage - complete privacy</li>
        <li>Easy to use interface</li>
      </ul>
    </div>
  );
}
```

### Contact Page
```typescript
// /src/app/components/Contact.tsx
export function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-6">Contact Us</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="mb-4">Email: support@aiseva.in</p>
        <p className="mb-4">Phone: +91 XXXXXXXXXX</p>
        <p>Address: [Your Address]</p>
        
        <form className="mt-8 space-y-4">
          <input type="text" placeholder="Name" className="w-full p-4 border-2 rounded-xl" />
          <input type="email" placeholder="Email" className="w-full p-4 border-2 rounded-xl" />
          <textarea placeholder="Message" className="w-full p-4 border-2 rounded-xl h-32" />
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl">Send Message</button>
        </form>
      </div>
    </div>
  );
}
```

### Privacy Policy
```typescript
// /src/app/components/PrivacyPolicy.tsx
export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <h2>Data Collection</h2>
        <p>We collect minimal personal information only for authentication purposes...</p>
        
        <h2>File Processing</h2>
        <p>All files are processed securely and deleted immediately after processing...</p>
        
        <h2>Your Rights</h2>
        <p>You have the right to access, modify, or delete your data at any time...</p>
        
        <h2>Contact</h2>
        <p>For privacy concerns, contact: privacy@aiseva.in</p>
      </div>
    </div>
  );
}
```

## 🔧 Configuration

### Update API Base URL for Production

In each tool file, replace:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

With:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Then create `.env` file:
```
VITE_API_URL=https://your-backend-url.com/api
```

## 🎨 Enhanced Business Tools

### Invoice Tool - Complete Fields

Update `InvoiceTool.tsx` to include:
```typescript
interface InvoiceData {
  // Business Details
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_gstin: string;
  
  // Customer Details
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_gstin: string;
  
  // Invoice Details
  invoice_date: string;
  due_date: string;
  items: Array<{
    name: string;
    description: string;
    hsn_code: string;
    qty: number;
    unit: string;
    price: number;
    discount: number;
  }>;
  
  // Tax Details
  gst_rate: number;
  shipping_charges: number;
  discount: number;
  notes: string;
}
```

### GST Calculator - Enhanced

Add these fields:
- CGST/SGST split for intra-state
- IGST for inter-state
- Reverse charge mechanism
- TCS/TDS calculations

## 🎓 Enhanced Career Quiz

Expand to 15-20 questions:

```typescript
const careerQuestions = [
  { id: 1, question: 'What is your age?', type: 'number' },
  { id: 2, question: 'What is your education level?', type: 'select' },
  { id: 3, question: 'What are your interests?', type: 'multi-select' },
  { id: 4, question: 'What is your budget for education?', type: 'range' },
  { id: 5, question: 'Preferred location?', type: 'select' },
  { id: 6, question: 'Are you open to online courses?', type: 'yes/no' },
  { id: 7, question: 'Do you prefer hands-on or theoretical learning?', type: 'select' },
  { id: 8, question: 'Willingness to relocate?', type: 'yes/no' },
  { id: 9, question: 'Family business?', type: 'yes/no' },
  { id: 10, question: 'Strengths (select all)?', type: 'multi-select' },
  // ... add more
];
```

## 🔐 Security Enhancements

### Add Rate Limiting

Backend (`app.py`):
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/ai/translate')
@limiter.limit("10 per minute")
def translate():
    # ...
```

### Add Input Validation

```python
from flask import request
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
```

## 📊 Database Migration

Replace JSON files with SQLite/PostgreSQL:

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aiseva.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
```

## 🚀 Deployment

### Backend (Python Flask)

1. **Use Gunicorn**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Use Docker**:
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
   ```

### Frontend (React)

1. **Build**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**:
   - Connect GitHub repo
   - Auto-deploy on push

## 🧪 Testing

### Backend Tests

```python
# tests/test_translation.py
import pytest
from app import app

def test_translation():
    client = app.test_client()
    response = client.post('/api/ai/translate', json={
        'text': 'Hello',
        'target_lang': 'hindi'
    })
    assert response.status_code == 200
    assert 'translated' in response.json
```

### Frontend Tests

```typescript
// tests/Login.test.tsx
import { render, screen } from '@testing-library/react';
import { Login } from './Login';

test('renders login form', () => {
  render(<Login onBack={() => {}} onLogin={() => {}} language="en" />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
```

## 📚 Additional Resources

- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://react.dev/
- Tesseract OCR: https://github.com/tesseract-ocr/tesseract
- PyPDF2: https://pypdf2.readthedocs.io/

## 🐛 Common Issues

### Issue: Tesseract not found
**Solution**: Ensure Tesseract is installed and in PATH

### Issue: PDF conversion fails
**Solution**: Install LibreOffice for better compatibility

### Issue: CORS errors
**Solution**: Ensure Flask-CORS is configured correctly

### Issue: File upload fails
**Solution**: Check MAX_CONTENT_LENGTH in Flask config

## 📞 Support

For implementation help:
- Check backend logs: `tail -f backend.log`
- Check frontend console: F12 in browser
- Verify API is running: `curl http://localhost:5000/api/health`

## ✅ Checklist

- [ ] Backend running on port 5000
- [ ] Tesseract OCR installed
- [ ] All Python dependencies installed
- [ ] Frontend connecting to backend
- [ ] Authentication working
- [ ] At least one AI tool working end-to-end
- [ ] File uploads working
- [ ] PDF generation working
- [ ] Career recommendations working

## 🎉 Next Steps

1. Update all remaining tools to connect to backend
2. Add static pages (About, Contact, Privacy)
3. Enhance career quiz to 15-20 questions
4. Add database instead of JSON files
5. Deploy to production
6. Add analytics
7. Add payment gateway (if needed)
8. Add WhatsApp integration for invoices
9. Add email notifications
10. Add admin dashboard

