import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, FileText, Download } from 'lucide-react';
import { ProcessingResult } from '@/types';

interface ResultScreenProps {
  result: ProcessingResult;
  onNewProcess: () => void;
  onDownload: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onNewProcess, onDownload }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Documento gerado com sucesso!</h3>
        <p className="text-slate-600">Seu arquivo Word está pronto para download</p>
      </div>
      
      <div className="border border-slate-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-800 mb-1">{result.filename}</p>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                Documento Word
              </span>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                {result.pageCount} {result.pageCount === 1 ? 'página' : 'páginas'}
              </span>
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-400"></span>
                50 linhas/página
              </span>
            </div>
            
            <p className="text-xs text-slate-500">Gerado em {result.timestamp}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-800 mb-2">Resumo do processamento</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Clientes</p>
            <p className="text-lg font-semibold text-slate-800">{result.stats.customers}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Produtos</p>
            <p className="text-lg font-semibold text-slate-800">{result.stats.products}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Colunas TB</p>
            <p className="text-lg font-semibold text-slate-800">{result.stats.tbColumns}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Colunas IM</p>
            <p className="text-lg font-semibold text-slate-800">{result.stats.imColumns}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button 
          variant="outline"
          onClick={onNewProcess}
        >
          Novo Processamento
        </Button>
        <Button 
          onClick={onDownload}
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Baixar Documento
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
