@echo off
echo 🚀 Starting AI Seva Platform...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found!
    pause
    exit /b 1
)

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if not installed
if not exist "venv\installed" (
    echo 📥 Installing Python dependencies...
    pip install -r requirements.txt
    python -m textblob.download_corpora
    echo installed > venv\installed
    echo ✅ Dependencies installed
)

echo 🌟 Starting Flask backend on port 5000...
echo.
start "AI Seva Backend" python app.py

echo ✅ Backend started in new window
echo.
echo 🎨 Frontend is managed by Figma Make platform
echo.
echo ✅ AI Seva Platform is running!
echo.
echo 📝 Notes:
echo    - Backend API: http://localhost:5000
echo    - Frontend: Already running in Figma Make
echo    - Close the backend window to stop the server
echo.
echo 🔗 API Endpoints:
echo    - Health Check: http://localhost:5000/api/health
echo    - Authentication: http://localhost:5000/api/auth/*
echo    - AI Tools: http://localhost:5000/api/ai/*
echo    - Documents: http://localhost:5000/api/documents/*
echo    - Business: http://localhost:5000/api/business/*
echo    - Career: http://localhost:5000/api/career/*
echo.
pause
