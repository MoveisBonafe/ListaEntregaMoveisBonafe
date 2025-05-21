import { HelpCircleIcon } from "lucide-react";

interface ProcessStepsProps {
  currentStep: number;
}

export default function ProcessSteps({ currentStep }: ProcessStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700 mb-2 md:mb-0">Conversor de Planilha para Modelo de Lista</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <HelpCircleIcon className="h-4 w-4 text-secondary" />
          <span>Siga os passos abaixo para converter sua planilha</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row w-full mb-6">
        <div className="flex items-center mb-2 md:mb-0 md:flex-1">
          <div className={`flex items-center justify-center ${currentStep >= 1 ? 'bg-primary' : 'bg-gray-300'} text-white rounded-full w-8 h-8 mr-3 flex-shrink-0`}>
            1
          </div>
          <div>
            <p className="font-medium">Faça upload da planilha Excel</p>
            <p className="text-sm text-gray-500">Formato .xlsx com dados na aba "LISTA POR PEDIDO"</p>
          </div>
        </div>
        <div className="hidden md:block w-8 mt-4 border-t border-gray-300 mx-2"></div>
        <div className="flex items-center mb-2 md:mb-0 md:flex-1">
          <div className={`flex items-center justify-center ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-300'} text-white rounded-full w-8 h-8 mr-3 flex-shrink-0`}>
            2
          </div>
          <div>
            <p className="font-medium">Verifique a visualização</p>
            <p className="text-sm text-gray-500">Confirme se os dados estão corretos</p>
          </div>
        </div>
        <div className="hidden md:block w-8 mt-4 border-t border-gray-300 mx-2"></div>
        <div className="flex items-center md:flex-1">
          <div className={`flex items-center justify-center ${currentStep >= 3 ? 'bg-secondary-500' : 'bg-gray-300'} text-white rounded-full w-8 h-8 mr-3 flex-shrink-0`}>
            3
          </div>
          <div>
            <p className="font-medium">Baixe o documento Word</p>
            <p className="text-sm text-gray-500">Formatado conforme o modelo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
