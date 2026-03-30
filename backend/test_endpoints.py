#!/usr/bin/env python3
"""
Test script to verify all AI Seva backend endpoints are working
"""

import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_endpoint(name, method, url, data=None, files=None):
    """Test a single endpoint"""
    try:
        if method == 'GET':
            response = requests.get(url)
        else:
            if files:
                response = requests.post(url, data=data, files=files)
            else:
                response = requests.post(url, json=data)
        
        if response.status_code < 400:
            print(f"✅ {name}: PASS (Status {response.status_code})")
            return True
        else:
            print(f"❌ {name}: FAIL (Status {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ {name}: ERROR ({str(e)})")
        return False

def main():
    print("🧪 Testing AI Seva Backend Endpoints\n")
    print("=" * 60)
    
    results = []
    
    # Health Check
    print("\n📊 System Health:")
    results.append(test_endpoint("Health Check", "GET", f"{BASE_URL}/health"))
    
    # Authentication
    print("\n🔐 Authentication:")
    results.append(test_endpoint(
        "Register", "POST", f"{BASE_URL}/auth/register",
        data={"email": "test@example.com", "password": "test123", "name": "Test User"}
    ))
    
    results.append(test_endpoint(
        "Login", "POST", f"{BASE_URL}/auth/login",
        data={"email": "test@example.com", "password": "test123"}
    ))
    
    # AI Tools
    print("\n🧠 AI Tools:")
    results.append(test_endpoint(
        "Translation", "POST", f"{BASE_URL}/ai/translate",
        data={"text": "Hello World", "target_lang": "hindi"}
    ))
    
    results.append(test_endpoint(
        "Spell Check", "POST", f"{BASE_URL}/ai/spell-check",
        data={"text": "Helo wurld"}
    ))
    
    results.append(test_endpoint(
        "Ask Question", "POST", f"{BASE_URL}/ai/ask-question",
        data={"question": "What is the capital of India?"}
    ))
    
    results.append(test_endpoint(
        "Summarize", "POST", f"{BASE_URL}/ai/summarize",
        data={"text": "This is a test text that needs to be summarized. " * 10}
    ))
    
    results.append(test_endpoint(
        "Image Generation", "POST", f"{BASE_URL}/ai/generate-image",
        data={"prompt": "A beautiful sunset"}
    ))
    
    results.append(test_endpoint(
        "Video Generation", "POST", f"{BASE_URL}/ai/generate-video",
        data={"prompt": "A timelapse video"}
    ))
    
    # Business Tools
    print("\n💼 Business Tools:")
    results.append(test_endpoint(
        "Calculate GST", "POST", f"{BASE_URL}/business/calculate-gst",
        data={"amount": 1000, "gst_rate": 18}
    ))
    
    # Career Tools
    print("\n🎓 Career Tools:")
    results.append(test_endpoint(
        "Career Recommendation", "POST", f"{BASE_URL}/career/recommend",
        data={"age": 18, "interest": "tech", "education": "12th"}
    ))
    
    results.append(test_endpoint(
        "Get Resources", "GET", f"{BASE_URL}/career/resources"
    ))
    
    # Summary
    print("\n" + "=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"\n📊 Test Results: {passed}/{total} passed ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("\n✅ All tests passed! Backend is fully operational.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the errors above.")
    
    print("\n💡 Note: Some tests may fail if:")
    print("   - Backend server is not running")
    print("   - Required packages are not installed")
    print("   - Tesseract OCR is not installed (for OCR tests)")
    print("   - LibreOffice is not installed (for document conversion)")

if __name__ == '__main__':
    main()
