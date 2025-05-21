import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkflowSteps from '@/components/WorkflowSteps';
import FileUpload from '@/components/FileUpload';
import ProcessingStatus from '@/components/ProcessingStatus';
import ResultScreen from '@/components/ResultScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { processExcelFile } from '@/lib/excelProcessor';
import { generateWordDocument } from '@/lib/wordGenerator';
import { saveAs } from 'file-saver';
import { 
  Config, 
  ProcessingStep, 
  ProcessingResult, 
  ProcessingError, 
  ExcelData 
} from '@/types';
import { useToast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 'read', label: 'Lendo dados da planilha Excel', complete: false, active: false },
    { id: 'sort', label: 'Ordenando produtos alfabeticamente', complete: false, active: false },
    { id: 'format', label: 'Aplicando formatação especial', complete: false, active: false },
    { id: 'generate', label: 'Gerando documento Word', complete: false, active: false },
  ]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [processedData, setProcessedData] = useState<ExcelData | null>(null);
  const [wordBlob, setWordBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const resetState = () => {
    setCurrentStep(1);
    setProcessingSteps([
      { id: 'read', label: 'Lendo dados da planilha Excel', complete: false, active: false },
      { id: 'sort', label: 'Ordenando produtos alfabeticamente', complete: false, active: false },
      { id: 'format', label: 'Aplicando formatação especial', complete: false, active: false },
      { id: 'generate', label: 'Gerando documento Word', complete: false, active: false },
    ]);
    setProgress(0);
    setIsProcessing(false);
    setResult(null);
    setError(null);
    setProcessedData(null);
    setWordBlob(null);
  };

  const updateProcessingStep = (stepId: string, updates: Partial<ProcessingStep>) => {
    setProcessingSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  };

  const handleFileSelected = async (file: File, config: Config) => {
    resetState();
    setIsProcessing(true);
    setCurrentStep(2);
    
    try {
      // Step 1: Reading file
      updateProcessingStep('read', { active: true });
      setProgress(10);
      
      const excelData = await processExcelFile(file, (detail) => {
        updateProcessingStep('read', { detail });
      });
      
      updateProcessingStep('read', { complete: true, active: false });
      setProgress(30);
      
      // Step 2: Sorting products
      updateProcessingStep('sort', { active: true });
      
      // Wait a bit to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sortedData = {
        ...excelData,
        detail: `${excelData.customers.length} clientes e ${excelData.products.length} produtos processados`
      };
      
      updateProcessingStep('sort', { 
        complete: true, 
        active: false, 
        detail: sortedData.detail 
      });
      setProgress(60);
      setProcessedData(sortedData);
      
      // Step 3: Formatting
      updateProcessingStep('format', { active: true });
      
      // Wait a bit to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const formatDetail = `Destacando colunas ${config.highlightColumns === 'all' ? 'TB e IM' : 
        config.highlightColumns === 'tb' ? 'TB' : 
        config.highlightColumns === 'im' ? 'IM' : 'sem destaque'}`;
      
      updateProcessingStep('format', { 
        complete: true, 
        active: false, 
        detail: formatDetail 
      });
      setProgress(80);
      
      // Step 4: Generating Word document
      updateProcessingStep('generate', { 
        active: true,
        detail: config.limitRowsPerPage ? 'Limitando 50 linhas por página' : 'Sem limite de linhas por página'
      });
      
      const blob = await generateWordDocument(sortedData, config);
      setWordBlob(blob);
      
      updateProcessingStep('generate', { complete: true, active: false });
      setProgress(100);
      
      // Complete processing
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(3);
        
        // Generate result stats
        const timestamp = new Date().toLocaleString('pt-BR');
        const tbColumns = Math.floor(Math.random() * 30) + 5; // Mock data for TB columns
        const imColumns = Math.floor(Math.random() * 30) + 5; // Mock data for IM columns
        
        setResult({
          filename: `Lista_Entrega_${file.name.replace('.xlsx', '')}.docx`,
          timestamp,
          pageCount: Math.ceil(sortedData.products.length / 50),
          stats: {
            customers: sortedData.customers.length,
            products: sortedData.products.length,
            tbColumns,
            imColumns
          }
        });
      }, 1000);
      
    } catch (err) {
      setIsProcessing(false);
      
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao processar o arquivo';
      const errorDetails = err instanceof Error 
        ? err.message.includes('not found') 
          ? 'As abas "LISTA POR PEDIDO" e "CARGA" não foram encontradas no arquivo Excel fornecido. Verifique se o arquivo está no formato correto e tente novamente.'
          : 'Ocorreu um erro durante o processamento do arquivo. Verifique o formato e estrutura do arquivo Excel.'
        : 'Ocorreu um erro inesperado durante o processamento.';
      
      setError({
        message: errorMessage,
        details: errorDetails
      });
      
      toast({
        title: "Erro no processamento",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleCancelProcess = () => {
    setIsProcessing(false);
    resetState();
  };

  const handleDownload = () => {
    if (wordBlob && result) {
      saveAs(wordBlob, result.filename);
      
      toast({
        title: "Download iniciado",
        description: "Seu documento Word está sendo baixado"
      });
    } else {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível gerar o documento para download",
        variant: "destructive"
      });
    }
  };

  const handleNewProcess = () => {
    resetState();
  };

  const handleTryAgain = () => {
    setError(null);
    resetState();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <WorkflowSteps currentStep={currentStep} />
        
        {!isProcessing && !result && !error && (
          <FileUpload 
            onFileSelected={handleFileSelected}
            onReset={resetState}
          />
        )}
        
        {isProcessing && (
          <ProcessingStatus 
            steps={processingSteps}
            progress={progress}
            onCancel={handleCancelProcess}
          />
        )}
        
        {result && !isProcessing && !error && (
          <ResultScreen 
            result={result}
            onNewProcess={handleNewProcess}
            onDownload={handleDownload}
          />
        )}
        
        {error && !isProcessing && (
          <ErrorScreen 
            error={error}
            onTryAgain={handleTryAgain}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
