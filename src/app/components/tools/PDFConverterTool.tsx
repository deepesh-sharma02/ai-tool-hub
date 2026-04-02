import { useState, useRef } from 'react';
import { ArrowLeft, FileText, Upload, Download } from 'lucide-react';
import type { Language } from '../../App';

interface PDFConverterToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: { 
    title: 'PDF Converter', 
    uploadBtn: 'Upload File', 
    convertTo: 'Convert to:', 
    convertBtn: 'Convert', 
    converting: 'Converting...', 
    download: 'Download',
    selectOperation: 'Select Operation'
  },
  hi: { 
    title: 'PDF कनवर्टर', 
    uploadBtn: 'फाइल अपलोड करें', 
    convertTo: 'इसमें परिवर्तित करें:', 
    convertBtn: 'परिवर्तित करें', 
    converting: 'परिवर्तित हो रहा है...', 
    download: 'डाउनलोड करें',
    selectOperation: 'ऑपरेशन चुनें'
  },
  gu: { 
    title: 'PDF કન્વર્ટર', 
    uploadBtn: 'ફાઇલ અપલોડ કરો', 
    convertTo: 'આમાં કન્વર્ટ કરો:', 
    convertBtn: 'કન્વર્ટ કરો', 
    converting: 'કન્વર્ટ થઈ રહ્યું છે...', 
    download: 'ડાઉનલોડ કરો',
    selectOperation: 'ઓપરેશન પસંદ કરો'
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com/api';

export function PDFConverterTool({ onBack, language }: PDFConverterToolProps) {
  const t = translations[language];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [operation, setOperation] = useState('pdf-to-word');
  const [converted, setConverted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setConverted(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    if (operation === 'rotate-pdf') {
      formData.append('rotation', '90');
    } else if (operation === 'protect-pdf') {
      formData.append('password', 'password123');
    }

    let endpoint = '';
    let downloadName = '';

    switch (operation) {
      case 'pdf-to-word':
        endpoint = '/documents/pdf-to-word';
        downloadName = 'converted.docx';
        break;
      case 'word-to-pdf':
        endpoint = '/documents/word-to-pdf';
        downloadName = 'converted.pdf';
        break;
      case 'image-to-pdf':
        endpoint = '/documents/image-to-pdf';
        downloadName = 'images.pdf';
        break;
      case 'compress-pdf':
        endpoint = '/documents/compress-pdf';
        downloadName = 'compressed.pdf';
        break;
      case 'rotate-pdf':
        endpoint = '/documents/rotate-pdf';
        downloadName = 'rotated.pdf';
        break;
      case 'protect-pdf':
        endpoint = '/documents/protect-pdf';
        downloadName = 'protected.pdf';
        break;
      default:
        endpoint = '/documents/pdf-to-word';
        downloadName = 'converted.docx';
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setConvertedFileUrl(url);
        setConverted(true);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        a.click();
      } else {
        alert('Conversion failed');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <FileText className="w-6 h-6 text-green-600" />
          <h1 className="text-xl">{t.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <input 
            ref={fileInputRef} 
            type="file" 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
            className="hidden" 
          />
          
          {!selectedFile ? (
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full flex items-center justify-center gap-3 p-12 border-4 border-dashed border-green-300 rounded-2xl hover:bg-green-50 transition"
            >
              <Upload className="w-16 h-16 text-green-600" />
              <div className="text-2xl">{t.uploadBtn}</div>
            </button>
          ) : (
            <div>
              <div className="p-4 bg-green-50 rounded-xl mb-4">
                <p className="text-lg">{selectedFile.name}</p>
              </div>

              <label className="block mb-2">{t.selectOperation}</label>
              <select 
                value={operation} 
                onChange={(e) => setOperation(e.target.value)} 
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none mb-6"
              >
                <optgroup label="Convert">
                  <option value="pdf-to-word">PDF to Word</option>
                  <option value="word-to-pdf">Word to PDF</option>
                  <option value="image-to-pdf">Image to PDF</option>
                </optgroup>
                <optgroup label="Modify PDF">
                  <option value="compress-pdf">Compress PDF</option>
                  <option value="rotate-pdf">Rotate PDF</option>
                  <option value="protect-pdf">Protect PDF (Add Password)</option>
                </optgroup>
              </select>

              <button 
                onClick={handleConvert}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition disabled:bg-gray-300"
              >
                {loading ? t.converting : t.convertBtn}
              </button>

              {converted && (
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                  <p className="text-green-700 mb-2">✓ Conversion successful!</p>
                  {convertedFileUrl && (
                    <a
                      href={convertedFileUrl}
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      <Download className="w-5 h-5" />
                      {t.download}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
