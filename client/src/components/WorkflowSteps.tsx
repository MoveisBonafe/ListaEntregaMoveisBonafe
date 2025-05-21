import React from 'react';

interface WorkflowStepsProps {
  currentStep: number;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: 'Upload do Excel',
      description: 'Faça upload do arquivo Excel',
    },
    {
      number: 2,
      title: 'Processamento',
      description: 'Ordenação e formatação dos dados',
    },
    {
      number: 3,
      title: 'Download',
      description: 'Documento Word pronto para uso',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-10">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Gerador de Lista de Entrega</h2>
        <p className="text-slate-600 mb-6">Transforme planilhas Excel em documentos Word formatados para listas de entrega.</p>
        
        <ol className="flex gap-2 md:gap-0 mb-8 flex-wrap md:flex-nowrap">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <li className="flex-1 flex flex-col items-center text-center">
                <div 
                  className={`w-10 h-10 flex items-center justify-center ${
                    step.number <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-200 text-slate-500'
                  } rounded-full font-semibold mb-2`}
                >
                  {step.number}
                </div>
                <div className="text-xs sm:text-sm w-full">
                  <h3 className={`font-medium ${
                    step.number <= currentStep 
                      ? 'text-slate-800' 
                      : 'text-slate-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-slate-500 hidden sm:block">{step.description}</p>
                </div>
              </li>
              {index < steps.length - 1 && (
                <div className="flex-none hidden md:block w-12 relative">
                  <div className="h-0.5 bg-slate-200 absolute top-5 w-full"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default WorkflowSteps;
