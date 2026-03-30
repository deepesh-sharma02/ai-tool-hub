#!/bin/bash

echo "🚀 Starting AI Seva Platform..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "🔧 Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

# Install dependencies if not installed
if [ ! -f "venv/installed" ]; then
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt
    python -m textblob.download_corpora
    touch venv/installed
    echo "✅ Dependencies installed"
fi

echo "🌟 Starting Flask backend on port 5000..."
python app.py &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""
echo "🎨 Frontend is managed by Figma Make platform"
echo ""
echo "✅ AI Seva Platform is running!"
echo ""
echo "📝 Notes:"
echo "   - Backend API: http://localhost:5000"
echo "   - Frontend: Already running in Figma Make"
echo "   - Press Ctrl+C to stop the backend"
echo ""
echo "🔗 API Endpoints:"
echo "   - Health Check: http://localhost:5000/api/health"
echo "   - Authentication: http://localhost:5000/api/auth/*"
echo "   - AI Tools: http://localhost:5000/api/ai/*"
echo "   - Documents: http://localhost:5000/api/documents/*"
echo "   - Business: http://localhost:5000/api/business/*"
echo "   - Career: http://localhost:5000/api/career/*"
echo ""

# Wait for backend process
wait $BACKEND_PID
