import { Card, CardContent } from "@/components/ui/card";

export default function Instructions() {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Instruções</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Requisitos da Planilha:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Formato Excel (.xlsx)</li>
              <li>Dados na aba "LISTA POR PEDIDO"</li>
              <li>Coluna A (linha 2+): NOMES</li>
              <li>Coluna B (linha 2+): PRODUTOS</li>
              <li>Colunas C-F: Valores para preenchimento</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Formatação do Documento:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Fonte: Times New Roman, 12pt</li>
              <li>Altura de linha: 0,5cm</li>
              <li>Largura das colunas numéricas: 1,0cm</li>
              <li>Destaque amarelo nas colunas 4 e 9</li>
              <li>Destaque verde nas colunas 5 e 10</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
