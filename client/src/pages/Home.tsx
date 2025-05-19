import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProcessSteps from "@/components/ProcessSteps";
import FileUpload from "@/components/FileUpload";
import DocumentPreview from "@/components/DocumentPreview";
import Instructions from "@/components/Instructions";
import { Card, CardContent } from "@/components/ui/card";
import { ExcelData } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [formatOptions, setFormatOptions] = useState({
    formatMode: "strict",
    truncateText: true,
    formatNumbers: true
  });

  const handleFileProcessed = (data: ExcelData) => {
    setExcelData(data);
    setIsPreviewReady(true);
    setCurrentStep(3);
  };

  const handleProcessingStart = () => {
    setCurrentStep(2);
    setIsPreviewReady(false);
  };

  const handleProcessingComplete = () => {
    setCurrentStep(3);
  };

  const updateProgress = (progressValue: number) => {
    setProgress(progressValue);
  };

  const handleFormatModeChange = (value: string) => {
    setFormatOptions(prev => ({ ...prev, formatMode: value }));
  };

  const handleTruncateTextChange = (checked: boolean) => {
    setFormatOptions(prev => ({ ...prev, truncateText: checked }));
  };

  const handleFormatNumbersChange = (checked: boolean) => {
    setFormatOptions(prev => ({ ...prev, formatNumbers: checked }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <ProcessSteps currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <FileUpload 
              onFileProcessed={handleFileProcessed}
              onProcessingStart={handleProcessingStart}
              onProcessingComplete={handleProcessingComplete}
              updateProgress={updateProgress}
            />
          </div>
          
          <div className="lg:col-span-7">
            <DocumentPreview 
              data={excelData}
              isReady={isPreviewReady}
            />
            
            {isPreviewReady && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Configurações Adicionais</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="format-mode" className="text-sm font-medium text-gray-700 mb-1 block">
                        Modo de Formatação
                      </Label>
                      <Select 
                        value={formatOptions.formatMode} 
                        onValueChange={handleFormatModeChange}
                      >
                        <SelectTrigger id="format-mode" className="w-full">
                          <SelectValue placeholder="Selecione o modo de formatação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Exato (0,5cm por linha)</SelectItem>
                          <SelectItem value="flexible">Flexível (ajustar automaticamente)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="truncate-text" 
                        checked={formatOptions.truncateText} 
                        onCheckedChange={handleTruncateTextChange} 
                      />
                      <Label htmlFor="truncate-text" className="text-sm text-gray-700">
                        Truncar texto que não cabe na linha
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="format-numbers" 
                        checked={formatOptions.formatNumbers} 
                        onCheckedChange={handleFormatNumbersChange}
                      />
                      <Label htmlFor="format-numbers" className="text-sm text-gray-700">
                        Formatar números com 2 dígitos (01, 02, 03...)
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
