# AI Seva Backend API

Complete Python Flask backend for AI Seva platform with real AI and document processing capabilities.

## Features

### 1. Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing

### 2. AI Tools
- **AI Translation**: Real-time translation using Google Translate API
- **Spell Check**: Grammar and spelling correction using TextBlob
- **Text-to-Speech**: Convert text to audio using gTTS
- **PDF Chat**: Extract and search PDF content
- **Q&A System**: General question answering
- **Document Summarization**: Extract key points from documents

### 3. Document Tools
- **OCR**: Extract text from images using Tesseract
- **PDF to Word**: Convert PDF to DOCX format
- **Word to PDF**: Convert DOCX to PDF
- **Image to PDF**: Combine images into PDF
- **Compress PDF**: Reduce PDF file size
- **Rotate PDF**: Rotate PDF pages
- **Protect PDF**: Add password protection
- **Table Extraction**: Extract tables from images

### 4. Business Tools
- **Invoice Generation**: Create professional invoices with GST
- **GST Calculator**: Calculate GST amounts
- **Sales Reports**: Track daily/monthly sales
- **PDF Export**: Download invoices as PDF

### 5. Career Guidance
- **Personalized Recommendations**: Based on age, education, interests
- **Career Roadmaps**: Detailed pathways for each field
- **Free Resources**: Curated list of learning resources
- **Skills Development**: Required skills for each career

## Installation

### Prerequisites
- Python 3.8 or higher
- Tesseract OCR (for image text extraction)

### Install Tesseract OCR

#### On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
sudo apt-get install tesseract-ocr-hin tesseract-ocr-guj  # For Hindi and Gujarati
```

#### On Windows:
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install and add to PATH
3. Download language packs for Hindi, Gujarati, etc.

#### On macOS:
```bash
brew install tesseract
brew install tesseract-lang  # For additional languages
```

### Setup Backend

1. Create virtual environment:
```bash
cd backend
python -m venv venv
```

2. Activate virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download TextBlob corpora:
```bash
python -m textblob.download_corpora
```

## Running the Server

```bash
python app.py
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)

### AI Tools
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/text-to-speech` - Convert text to speech
- `POST /api/ai/spell-check` - Check spelling
- `POST /api/ai/pdf-chat` - Chat with PDF
- `POST /api/ai/ask-question` - Ask general questions
- `POST /api/ai/summarize` - Summarize document

### Document Tools
- `POST /api/documents/ocr` - Image to text OCR
- `POST /api/documents/pdf-to-word` - Convert PDF to Word
- `POST /api/documents/word-to-pdf` - Convert Word to PDF
- `POST /api/documents/image-to-pdf` - Convert images to PDF
- `POST /api/documents/compress-pdf` - Compress PDF
- `POST /api/documents/rotate-pdf` - Rotate PDF
- `POST /api/documents/protect-pdf` - Password protect PDF

### Business Tools
- `POST /api/business/create-invoice` - Create invoice PDF
- `POST /api/business/calculate-gst` - Calculate GST
- `GET /api/business/todays-sales` - Get today's sales
- `GET /api/business/sales-report` - Get sales report

### Career Guidance
- `POST /api/career/recommend` - Get career recommendation
- `GET /api/career/explore/<field>` - Explore career field
- `GET /api/career/resources` - Get all free resources

## Request Examples

### Translation
```bash
curl -X POST http://localhost:5000/api/ai/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "target_lang": "hindi"
  }'
```

### OCR
```bash
curl -X POST http://localhost:5000/api/documents/ocr \
  -F "file=@image.jpg" \
  -F "lang=english"
```

### Create Invoice
```bash
curl -X POST http://localhost:5000/api/business/create-invoice \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "business_name": "My Shop",
    "customer_name": "John Doe",
    "items": [
      {"name": "Product 1", "qty": 2, "price": 100},
      {"name": "Product 2", "qty": 1, "price": 250}
    ],
    "gst_rate": 18
  }'
```

## Environment Variables (Optional)

Create a `.env` file for production:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
FLASK_ENV=production
```

## Production Deployment

1. Use PostgreSQL or MySQL instead of JSON files
2. Add Redis for caching
3. Use Gunicorn as WSGI server:
```bash
pip install gunicorn
gunicorn -w 4 app:app
```

4. Use Nginx as reverse proxy
5. Enable HTTPS
6. Set up proper logging

## Advanced Features (Optional)

### Add OpenAI Integration
1. Install: `pip install openai`
2. Set API key in environment
3. Replace mock Q&A with GPT-4

### Add Image Generation
1. Use DALL-E API or Stability AI
2. Requires paid API key

### Add Video Generation
1. Complex feature
2. Consider using Runway ML or similar services

## Troubleshooting

### Tesseract not found
- Ensure Tesseract is installed and in PATH
- On Windows, set `pytesseract.pytesseract.tesseract_cmd` to installation path

### PDF conversion errors
- Install LibreOffice for better compatibility
- Or use unoconv

### Memory issues
- Limit file upload size
- Use streaming for large files
- Add pagination for large datasets

## Security Notes

1. Change default SECRET_KEY and JWT_SECRET_KEY
2. Use HTTPS in production
3. Implement rate limiting
4. Add input validation
5. Sanitize file uploads
6. Use proper CORS settings

## License

MIT License
