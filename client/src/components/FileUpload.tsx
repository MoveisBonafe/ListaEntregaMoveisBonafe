import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpIcon, XIcon, AlertCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/utils/helpers";
import { processExcelFile } from "@/lib/excelProcessor";
import { ExcelData } from "@/types";

interface FileUploadProps {
  onFileProcessed: (data: ExcelData) => void;
  onProcessingStart: () => void;
  onProcessingComplete: () => void;
  updateProgress: (progress: number) => void;
}

export default function FileUpload({
  onFileProcessed,
  onProcessingStart,
  onProcessingComplete,
  updateProgress,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.xlsx')) {
      setError('Apenas arquivos Excel (.xlsx) são permitidos.');
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Apenas arquivos Excel (.xlsx) são permitidos.",
      });
      return;
    }

    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);
    onProcessingStart();
    
    try {
      // Simulate progress for visual feedback
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress > 90) clearInterval(interval);
        setProgress(currentProgress);
        updateProgress(currentProgress);
      }, 100);

      // Process the Excel file
      const data = await processExcelFile(file);
      
      clearInterval(interval);
      setProgress(100);
      updateProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        onProcessingComplete();
        onFileProcessed(data);
      }, 500);
      
      toast({
        title: "Arquivo processado com sucesso",
        description: "Os dados foram extraídos e estão prontos para visualização.",
      });
    } catch (err) {
      setIsProcessing(false);
      setProgress(0);
      updateProgress(0);
      setError(err instanceof Error ? err.message : 'Erro ao processar o arquivo.');
      toast({
        variant: "destructive",
        title: "Erro de processamento",
        description: err instanceof Error ? err.message : 'Erro ao processar o arquivo.',
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setIsProcessing(false);
    setProgress(0);
    updateProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload de Arquivo</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition duration-200 ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <FileUpIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">Arraste e solte sua planilha Excel aqui</p>
          <p className="text-sm text-gray-500 mb-4">ou clique para selecionar o arquivo</p>
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".xlsx" 
            className="sr-only"
            onChange={handleFileSelect} 
          />
          <Button className="mx-auto flex items-center">
            <FileUpIcon className="h-4 w-4 mr-2" />
            Selecionar arquivo
          </Button>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={removeFile} 
                className="text-gray-500 hover:text-red-500"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-4">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-sm text-gray-600 mt-2">Processando arquivo...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
