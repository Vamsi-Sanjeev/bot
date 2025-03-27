import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, FileText, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadProps {
  onFileProcessed?: (text: string) => void;
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const { setIsProcessing } = useChatStore();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const cleanText = (text: string) => {
    return text
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      .replace(/%[0-9A-F]{2}/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[\r\n]+/g, '\n')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim();
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
      setUploadProgress((i / pdf.numPages) * 100);
    }
    
    return cleanText(fullText);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    let text = '';

    try {
      if (file.type.startsWith('image/')) {
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 500);

        const { data: { text: extractedText } } = await worker.recognize(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        await worker.terminate();
        text = extractedText;
      } else if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        const reader = new FileReader();
        
        await new Promise<void>((resolve) => {
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              setUploadProgress((event.loaded / event.total) * 100);
            }
          };
          
          reader.onload = (e) => {
            text = e.target?.result as string;
            resolve();
          };
          
          reader.readAsText(file);
        });
      }

      const cleanedText = cleanText(text);
      if (cleanedText.trim()) {
        onFileProcessed?.(cleanedText);
      }
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(processFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: false,
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type === 'application/pdf') return FileText;
    return File;
  };

  return (
    <div className="h-full">
      <div
        {...getRootProps()}
        className={`
          h-full dropzone-animation relative p-8 border-3 border-dashed rounded-xl cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-gray-600 h-full justify-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}
            transition-colors duration-300
          `}>
            <Upload className={`
              w-8 h-8
              ${isDragActive ? 'text-blue-600' : 'text-gray-600'}
              transition-colors duration-300
            `} />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              {isDragActive
                ? 'Drop your file here'
                : 'Drag & drop your study material'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse your files
            </p>
          </div>
          <div className="flex gap-6 mt-4">
            {['image/*', 'application/pdf', 'text/plain'].map((type) => {
              const Icon = getFileIcon(type);
              return (
                <div key={type} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-500">
                    {type === 'image/*' ? 'Images' : type.split('/')[1].toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {uploadProgress > 0 && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <div className="text-sm font-medium text-gray-700">
                Processing file... {Math.round(uploadProgress)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}