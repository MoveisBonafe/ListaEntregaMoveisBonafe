import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { ProcessingError } from '@/types';

interface ErrorScreenProps {
  error: ProcessingError;
  onTryAgain: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onTryAgain }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white border border-red-200 rounded-xl shadow-sm p-6 mb-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Ocorreu um erro no processamento</h3>
        <p className="text-slate-600">{error.message}</p>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-red-800 mb-2">Detalhes do erro</h4>
        <p className="text-sm text-red-700 mb-2">{error.details}</p>
        
        <div className="mt-3">
          <h5 className="text-xs font-medium text-red-800 mb-1">Dicas para resolver:</h5>
          <ul className="list-disc list-inside text-xs text-red-700">
            <li>Verifique se o arquivo está no formato correto (.xlsx)</li>
            <li>Confirme se as abas necessárias estão presentes</li>
            <li>Certifique-se de que os cabeçalhos das colunas estão corretos</li>
            <li>Tente novamente com o arquivo de modelo fornecido</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={onTryAgain}
        >
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};

export default ErrorScreen;
