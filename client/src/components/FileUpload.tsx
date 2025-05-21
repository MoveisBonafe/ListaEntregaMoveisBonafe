import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Config } from '@/types';

interface FileUploadProps {
  onFileSelected: (file: File, config: Config) => void;
  onReset: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, onReset }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [config, setConfig] = useState<Config>({
    limitRowsPerPage: true,
    highlightColumns: 'all'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.xlsx')) {
      toast({
        title: "Formato de arquivo inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx)",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    handleFileSelect(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = () => {
    if (file) {
      onFileSelected(file, config);
    }
  };

  const handleReset = () => {
    handleRemoveFile();
    onReset();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Selecionar Arquivo Excel</h3>
      
      {/* Drop zone for file upload */}
      <div 
        className={`drop-zone rounded-lg p-8 mb-4 flex flex-col items-center justify-center text-center cursor-pointer ${isDragging ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 text-primary mb-4" />
        
        <p className="text-slate-800 font-medium mb-1">Arraste seu arquivo Excel aqui ou clique para selecionar</p>
        <p className="text-sm text-slate-500 mb-3">Suporta arquivos .xlsx</p>
        <p className="text-xs text-slate-400">O arquivo deve conter as abas "LISTA POR PEDIDO" e "CARGA"</p>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".xlsx" 
          onChange={handleFileInputChange}
        />
      </div>
      
      {/* File info area - shown when file is selected */}
      {file && (
        <div className="border border-slate-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                <FileIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            
            <button 
              className="text-slate-400 hover:text-slate-600"
              onClick={handleRemoveFile}
              aria-label="Remover arquivo"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Configuration options */}
      <div className="border border-slate-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-800 mb-3">Configurações</h4>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="limitRows" 
              checked={config.limitRowsPerPage}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, limitRowsPerPage: checked as boolean }))
              }
            />
            <Label htmlFor="limitRows" className="text-sm text-slate-700 cursor-pointer">
              Limitar 50 linhas por página
            </Label>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-6">Cada página gerada terá exatamente 50 linhas, incluindo a primeira página</p>
        </div>
        
        <div>
          <Label htmlFor="highlightOption" className="block text-sm font-medium text-slate-700 mb-1">
            Destaque de colunas
          </Label>
          <Select 
            value={config.highlightColumns}
            onValueChange={(value) => 
              setConfig(prev => ({ ...prev, highlightColumns: value as 'all' | 'tb' | 'im' | 'none' }))
            }
          >
            <SelectTrigger id="highlightOption" className="max-w-xs">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">TB (amarelo) e IM (verde)</SelectItem>
              <SelectItem value="tb">Somente TB (amarelo)</SelectItem>
              <SelectItem value="im">Somente IM (verde)</SelectItem>
              <SelectItem value="none">Sem destaques</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button 
          variant="outline"
          onClick={handleReset}
        >
          Limpar
        </Button>
        <Button 
          disabled={!file}
          onClick={handleProcess}
        >
          Processar
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
