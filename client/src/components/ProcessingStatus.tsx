import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ProcessingStep } from '@/types';

interface ProcessingStatusProps {
  steps: ProcessingStep[];
  progress: number;
  onCancel: () => void;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ steps, progress, onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Processando Arquivo</h3>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progresso</span>
          <span className="text-sm text-slate-700">{progress}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full">
          <div 
            className="h-2.5 bg-primary rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6 border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-3">Status de processamento</h4>
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                {step.complete ? (
                  <div className="absolute h-full w-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  step.active ? (
                    <div className="h-5 w-5 bg-slate-200 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    </div>
                  ) : (
                    <div className="h-5 w-5 bg-slate-200 rounded-full"></div>
                  )
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${step.complete || step.active ? 'text-slate-800' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                {step.detail && (
                  <p className="text-xs text-slate-500">{step.detail}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default ProcessingStatus;
