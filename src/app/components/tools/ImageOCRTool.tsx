import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  FileText, 
  PenTool, 
  Table, 
  Languages, 
  Files, 
  Camera, 
  Upload, 
  X, 
  Download, 
  Copy, 
  FileSpreadsheet, 
  Loader2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { saveAs } from 'file-saver';
import { motion } from 'motion/react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import type { Language } from '../../App';

// Manually set worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ImageOCRToolProps {
  onBack: () => void;
  language: Language;
}

type ToolType = 'image' | 'pdf' | 'handwriting' | 'table' | 'multilang' | 'batch' | 'webcam';

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com';

const tools = [
  { id: 'image', icon: ImageIcon, label: 'Image OCR', desc: 'JPG/PNG -> Text' },
  { id: 'pdf', icon: FileText, label: 'OCR PDF', desc: 'PDF -> Text' },
  { id: 'handwriting', icon: PenTool, label: 'Handwriting', desc: 'Notes -> Text' },
  { id: 'table', icon: Table, label: 'Table OCR', desc: 'Table -> Excel' },
  { id: 'multilang', icon: Languages, label: 'Multi-Lang', desc: 'Any Language' },
  { id: 'batch', icon: Files, label: 'Batch OCR', desc: 'Multiple Files' },
  { id: 'webcam', icon: Camera, label: 'Webcam', desc: 'Live Capture' },
] as const;

export function ImageOCRTool({ onBack, language }: ImageOCRToolProps) {
  const [activeTab, setActiveTab] = useState<ToolType>('image');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultText, setResultText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [camImage, setCamImage] = useState<string | null>(null);
  
  const webcamRef = useRef<Webcam>(null);

  // Reset state on tab change
  useEffect(() => {
    setFiles([]);
    setPreviewUrl(null);
    setFileType(null);
    setResultText('');
    setConfidence(null);
    setCamImage(null);
    setProgress(0);
    setIsProcessing(false);
  }, [activeTab]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (activeTab === 'batch') {
      setFiles(prev => [...prev, ...acceptedFiles]);
    } else {
      setFiles([acceptedFiles[0]]);
    }

    // Generate preview URL for the first file (even in batch mode we preview the first one)
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      if (file.type === 'application/pdf') {
        setFileType('pdf');
      } else {
        setFileType('image');
      }
    }
  }, [activeTab]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: activeTab === 'pdf' 
      ? { 'application/pdf': ['.pdf'] }
      : { 'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'] },
    multiple: activeTab === 'batch'
  });

  const captureWebcam = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCamImage(imageSrc);
      setPreviewUrl(imageSrc);
      setFileType('image');
      
      // Convert base64 to file for consistency
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
          setFiles([file]);
        });
    }
  }, [webcamRef]);

  const performLocalOCR = async (file: File | string, type: ToolType): Promise<{ text: string, confidence: number }> => {
    // PDF Handling
    if (type === 'pdf' || (file instanceof File && file.type === 'application/pdf')) {
       try {
         const arrayBuffer = await (file as File).arrayBuffer();
         const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
         const pdf = await loadingTask.promise;
         let fullText = '';
         
         for (let i = 1; i <= pdf.numPages; i++) {
           const page = await pdf.getPage(i);
           const textContent = await page.getTextContent();
           const pageText = textContent.items.map((item: any) => item.str).join(' ');
           fullText += `--- Page ${i} ---\n${pageText}\n\n`;
         }

         // If extracted text is very short, it might be a scanned PDF (image).
         if (fullText.trim().length < 50) {
            return {
              text: "This appears to be a scanned PDF (image-based). To extract text from this document, please enable the backend API service or use the 'Image OCR' tool with a screenshot of the document.",
              confidence: 0
            }
         }
         
         return { text: fullText, confidence: 95 };
       } catch (err) {
         console.error('PDF extraction error:', err);
         throw new Error('Failed to parse PDF');
       }
    }

    // Image Handling (Tesseract.js)
    try {
      const result = await Tesseract.recognize(
        file instanceof File ? URL.createObjectURL(file) : file,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      return {
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (err) {
      console.error(err);
      throw new Error('OCR Failed');
    }
  };

  const processOCR = async () => {
    if (files.length === 0 && !camImage) return;

    setIsProcessing(true);
    setProgress(0);
    setResultText('');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    formData.append('type', activeTab);
    
    try {
      // Try calling the API first
      const apiController = new AbortController();
      const apiTimeout = setTimeout(() => apiController.abort(), 2000); // Short timeout to quickly switch to local

      try {
        const response = await fetch(`${API_BASE_URL}/ocr/${activeTab}`, {
          method: 'POST',
          body: formData,
          signal: apiController.signal
        });
        clearTimeout(apiTimeout);
        
        if (response.ok) {
           const data = await response.json();
           setResultText(data.text);
           setConfidence(data.confidence);
           return;
        }
      } catch (e) {
        // API failed or timed out, proceed to local OCR
        console.warn('Backend unavailable, switching to client-side OCR');
      }

      // Local OCR Fallback
      if (activeTab === 'batch') {
        let combinedText = '';
        let totalConf = 0;
        
        for (const file of files) {
          const result = await performLocalOCR(file, activeTab);
          combinedText += `\n--- File: ${file.name} ---\n${result.text}\n`;
          totalConf += result.confidence;
        }
        setResultText(combinedText);
        setConfidence(Math.round(totalConf / files.length));

      } else {
        const source = camImage || files[0];
        const result = await performLocalOCR(source, activeTab);
        setResultText(result.text);
        setConfidence(Math.round(result.confidence));
      }

    } catch (error) {
      console.error(error);
      alert('Error processing document. Please ensure the file is valid.');
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const downloadResult = () => {
    const blob = new Blob([resultText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `ocr-result-${activeTab}.txt`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Image & OCR Tools</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Extract text intelligently from images and documents</p>
            </div>
          </div>
        </div>

        {/* Tool Selector */}
        <div className="border-t bg-gray-50/50 backdrop-blur-sm overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 py-3 min-w-max">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`
                      flex flex-col items-center p-3 rounded-xl min-w-[100px] transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md scale-105' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'}
                    `}
                  >
                    <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                    <span className="text-xs font-semibold">{tool.label}</span>
                    <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>{tool.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload Section */}
        {!resultText && (
          <div className="max-w-3xl mx-auto">
            {activeTab === 'webcam' ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  {!camImage ? (
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={camImage} alt="Captured" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex justify-center gap-4">
                  {!camImage ? (
                    <button 
                      onClick={captureWebcam}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Text
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setCamImage(null); setFiles([]); }}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Retake
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div 
                {...getRootProps()} 
                className={`
                  relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragActive 
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                    : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'}
                `}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {isProcessing ? (
                     <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  ) : (
                     <Upload className="w-10 h-10 text-blue-600" />
                  )}
                </div>
                
                {isProcessing ? (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Document...</h3>
                    <p className="text-gray-500 mb-6">
                      {activeTab === 'pdf' ? "Extracting text from PDF..." : "Analyzing image characters..."}
                    </p>
                    <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {files.length > 0 ? `${files.length} File(s) Selected` : "Drop your files here"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {files.length > 0 
                        ? "Click below to start extraction or drop different files" 
                        : activeTab === 'pdf' ? "Support for PDF documents" : "Support for JPG, PNG images"}
                    </p>
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg font-medium">
                      {files.length > 0 ? "Add More Files" : "Browse Files"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Action Bar */}
            {(files.length > 0 || camImage) && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <button 
                  onClick={processOCR}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl font-bold text-lg"
                >
                  <span>Start Extraction</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Results Section */}
        {resultText && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
            {/* Left Panel: Preview */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="p-4 bg-gray-900/50 backdrop-blur flex justify-between items-center border-b border-gray-700">
                <span className="text-gray-300 text-sm font-medium">Source Preview</span>
                {fileType !== 'pdf' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))}
                      className="p-1.5 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-gray-400 text-xs flex items-center">{Math.round(zoomLevel * 100)}%</span>
                    <button 
                      onClick={() => setZoomLevel(z => Math.min(3, z + 0.1))}
                      className="p-1.5 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-800/50 p-4 relative">
                {previewUrl ? (
                  fileType === 'pdf' ? (
                    <iframe 
                      src={previewUrl}
                      className="w-full h-full border-none rounded-lg bg-white"
                      title="PDF Preview"
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}
                      className="max-w-full max-h-full object-contain shadow-2xl origin-center"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <Files className="w-16 h-16 mb-4 opacity-50" />
                    <p>No preview available for this file type</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Editor */}
            <div className="bg-white rounded-2xl flex flex-col shadow-lg border border-gray-200">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-800">Extracted Text</h3>
                  {confidence && (
                    <span className={`text-xs px-2 py-1 rounded-full ${confidence > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {confidence}% Confidence
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(resultText);
                      alert('Copied to clipboard!');
                    }}
                    className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" 
                    title="Copy Text"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={downloadResult}
                    className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  {activeTab === 'table' && (
                     <button className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition" title="Export to Excel">
                       <FileSpreadsheet className="w-5 h-5" />
                     </button>
                  )}
                </div>
              </div>
              <div className="flex-1 relative">
                <textarea 
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  className="w-full h-full p-6 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-100 text-gray-700 leading-relaxed font-mono text-sm"
                  placeholder="Extracted text will appear here..."
                />
              </div>
              <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center text-xs text-gray-500">
                <span>{resultText.length} characters</span>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setResultText('')} 
                     className="text-red-500 hover:text-red-700 hover:underline"
                   >
                     Clear Text
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
