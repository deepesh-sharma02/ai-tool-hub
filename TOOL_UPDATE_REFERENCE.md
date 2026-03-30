# Quick Reference: Update Tools to Connect with Backend

## Pattern for Each Tool

All tools follow this pattern. Use AI Translation as the reference example.

### 1. Add API Base URL

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 2. Add State for Loading and Error

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

### 3. Create API Call Function

```typescript
const handleSubmit = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`${API_BASE_URL}/endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add for auth-required endpoints:
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      setResult(result.data);
    } else {
      setError(result.error || 'Operation failed');
    }
  } catch (error) {
    setError('Connection error. Make sure backend is running.');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

## Tool-Specific Updates

### SpellCheckTool.tsx

```typescript
const handleCheck = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/ai/spell-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
    });
    const data = await response.json();
    if (response.ok) {
      setResult(data.corrected);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### ImageOCRTool.tsx

```typescript
const handleExtract = async () => {
  if (!selectedImage) return;
  
  setLoading(true);
  const formData = new FormData();
  formData.append('file', fileInputRef.current?.files[0]);
  formData.append('lang', imageLang);

  try {
    const response = await fetch(`${API_BASE_URL}/documents/ocr`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      setResult(data.text);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### PDFChatTool.tsx

```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/ai/pdf-chat`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setPdfUploaded(true);
    setPdfText(data.pdf_length);
  } catch (error) {
    console.error(error);
  }
};

const handleAsk = async () => {
  const formData = new FormData();
  formData.append('question', question);
  
  try {
    const response = await fetch(`${API_BASE_URL}/ai/pdf-chat`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setMessages([...messages, 
      { type: 'user', text: question },
      { type: 'ai', text: data.answer }
    ]);
  } catch (error) {
    console.error(error);
  }
};
```

### AskQuestionTool.tsx

```typescript
const handleAsk = async () => {
  if (!question.trim()) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/ai/ask-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setMessages([...messages, 
      { type: 'user', text: question },
      { type: 'ai', text: data.answer }
    ]);
    setQuestion('');
  } catch (error) {
    console.error(error);
  }
};
```

### SummarizeTool.tsx

```typescript
const handleSummarize = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
    });
    const data = await response.json();
    if (response.ok) {
      setResult(data.summary);
    }
  } catch (error) {
    console.error(error);
  }
};
```

### SpeechToTextTool.tsx

For Text-to-Speech (already works via /api/ai/text-to-speech):
```typescript
const handleConvertToSpeech = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textInput, lang: 'en' }),
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      setAudioGenerated(true);
    }
  } catch (error) {
    console.error(error);
  }
};
```

For Speech-to-Text, use browser's Web Speech API:
```typescript
const handleRecord = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
    };
    
    recognition.start();
  } else {
    alert('Speech recognition not supported in this browser');
  }
};
```

### PDFConverterTool.tsx

```typescript
const handleConvert = async () => {
  if (!selectedFile) return;
  
  const formData = new FormData();
  formData.append('file', selectedFile);
  
  let endpoint = '';
  switch (convertTo) {
    case 'word': endpoint = '/documents/pdf-to-word'; break;
    case 'jpg': endpoint = '/documents/image-to-pdf'; break;
    // etc.
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${convertTo}`;
      a.click();
      setConverted(true);
    }
  } catch (error) {
    console.error(error);
  }
};
```

### InvoiceTool.tsx

```typescript
const handleGenerate = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/business/create-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        business_name: businessName,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items,
        gst_rate: 18
      }),
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      a.click();
      setBillGenerated(true);
    }
  } catch (error) {
    console.error(error);
  }
};
```

### CareerWizard.tsx

```typescript
const handleFinish = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/career/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: age,
        interest: interest,
        education: education
      }),
    });
    
    const data = await response.json();
    if (response.ok) {
      setCareerData(data);
      setShowResult(true);
    }
  } catch (error) {
    console.error(error);
  }
};
```

## File Upload Pattern

When uploading files, use FormData:

```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('additional_param', 'value');

  try {
    const response = await fetch(`${API_BASE_URL}/endpoint`, {
      method: 'POST',
      body: formData,  // Don't set Content-Type header, browser will set it
    });
    
    const data = await response.json();
    // Handle response
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

## Downloading Files from API

```typescript
const handleDownload = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'filename.pdf';
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Download error:', error);
  }
};
```

## Error Handling Best Practices

```typescript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    // Handle HTTP errors
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  
  // Success
  return data;
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
    alert('Connection error. Check if backend is running.');
  } else {
    // Other errors
    alert(error.message);
  }
  console.error('API Error:', error);
}
```

## Testing the Connection

Add this test function to any component:

```typescript
const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('Backend status:', data);
    alert('Backend connected!');
  } catch (error) {
    console.error('Connection failed:', error);
    alert('Backend not reachable. Is it running on port 5000?');
  }
};
```

## TypeScript Declarations

Add to your component or a types file:

```typescript
// For Web Speech API
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

// API Response types
interface TranslationResponse {
  original: string;
  translated: string;
  source_lang: string;
  target_lang: string;
}

interface OCRResponse {
  text: string;
  language: string;
  confidence: string;
  character_count: number;
  word_count: number;
}

interface CareerResponse {
  field: string;
  education_level: string;
  age: number;
  current_step: string;
  next_steps: string[];
  required_skills: string[];
  free_resources: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  timeline: string;
  personalized_advice: string[];
}
```

## Complete Example: ImageOCRTool with All Features

```typescript
import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Upload, Camera, Copy, Download } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export function ImageOCRTool({ onBack, language }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLang, setImageLang] = useState('auto');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('lang', imageLang);

    try {
      const response = await fetch(`${API_BASE_URL}/documents/ocr`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.text);
      } else {
        setError(data.error || 'OCR failed');
      }
    } catch (error) {
      setError('Connection error. Make sure backend is running on port 5000.');
      console.error('OCR error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Copied!');
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    // ... JSX remains the same
  );
}
```

## Quick Test Checklist

For each tool you update:

- [ ] API_BASE_URL is defined
- [ ] Loading state is shown during API call
- [ ] Error messages are displayed
- [ ] Success results are shown
- [ ] File downloads work (if applicable)
- [ ] Copy functionality works
- [ ] Console.log errors for debugging
- [ ] Test with backend running
- [ ] Test with backend stopped (should show connection error)
- [ ] Test with invalid inputs

## Common Mistakes to Avoid

1. ❌ Forgetting to set `Content-Type` header for JSON
2. ❌ Setting `Content-Type` for FormData (browser sets it automatically)
3. ❌ Not handling loading state
4. ❌ Not catching network errors
5. ❌ Hardcoding localhost in production
6. ❌ Not cleaning up URLs created with `createObjectURL`
7. ❌ Forgetting JWT token for protected routes
8. ❌ Not validating file types before upload

## Environment Setup

Create `.env` in frontend root:
```
VITE_API_URL=http://localhost:5000/api
```

Then use:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

## Done!

After updating all tools, your application will be fully functional with real AI and document processing capabilities!
