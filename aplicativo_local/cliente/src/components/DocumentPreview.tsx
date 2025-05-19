import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon, FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateWordDocument } from "@/lib/wordGenerator";
import { ExcelData, WordPreviewRow } from "@/types";

interface DocumentPreviewProps {
  data: ExcelData | null;
  isReady: boolean;
}

export default function DocumentPreview({ data, isReady }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  // Generate preview rows from data
  const previewRows: WordPreviewRow[] = [];
  
  // Process data for preview
  if (data?.processedData) {
    let leftSideRows: WordPreviewRow[] = [];
    let rightSideRows: WordPreviewRow[] = [];
    
    // Process each block
    data.processedData.forEach((block, blockIndex) => {
      const blockRows: WordPreviewRow[] = [];
      
      // First row contains the name
      blockRows.push({
        id: `name-${blockIndex}`,
        leftSide: {
          name: block.name,
          ce: "",
          mg: "",
          tb: "",
          im: ""
        },
        rightSide: {
          name: "",
          ce: "",
          mg: "",
          tb: "",
          im: ""
        }
      });
      
      // Add product rows that have values in columns C-F
      block.products.forEach((product, productIndex) => {
        if (product.values.some(value => value !== null && value !== 0)) {
          blockRows.push({
            id: `product-${blockIndex}-${productIndex}`,
            leftSide: {
              name: product.name,
              ce: product.values[0] ? String(product.values[0]).padStart(2, '0') : "--",
              mg: product.values[1] ? String(product.values[1]).padStart(2, '0') : "--",
              tb: product.values[2] ? String(product.values[2]).padStart(2, '0') : "--",
              im: product.values[3] ? String(product.values[3]).padStart(2, '0') : "--"
            },
            rightSide: {
              name: "",
              ce: "",
              mg: "",
              tb: "",
              im: ""
            }
          });
        }
      });
      
      // Determine if this block goes on left or right side
      // Based on current row count and block size
      if (leftSideRows.length <= rightSideRows.length && leftSideRows.length + blockRows.length <= 25) {
        // Add to left side
        leftSideRows = [...leftSideRows, ...blockRows];
      } else {
        // Add to right side
        rightSideRows = [...rightSideRows, ...blockRows];
      }
    });
    
    // Combine left and right sides into final preview rows
    const maxRows = Math.max(leftSideRows.length, rightSideRows.length);
    
    for (let i = 0; i < maxRows; i++) {
      const leftRow = leftSideRows[i] || {
        id: `empty-left-${i}`,
        leftSide: { name: "", ce: "", mg: "", tb: "", im: "" },
        rightSide: { name: "", ce: "", mg: "", tb: "", im: "" }
      };
      
      const rightRow = rightSideRows[i] || {
        id: `empty-right-${i}`,
        leftSide: { name: "", ce: "", mg: "", tb: "", im: "" },
        rightSide: { name: "", ce: "", mg: "", tb: "", im: "" }
      };
      
      previewRows.push({
        id: `row-${i}`,
        leftSide: leftRow.leftSide,
        rightSide: rightRow.leftSide  // We're using leftSide from rightRow here
      });
    }
  }

  const handleDownload = async () => {
    if (!data) {
      toast({
        variant: "destructive",
        title: "Nenhum dado para exportar",
        description: "Faça o upload de uma planilha para gerar o documento.",
      });
      return;
    }

    try {
      await generateWordDocument(data);
      toast({
        title: "Documento gerado com sucesso!",
        description: "O download deve começar automaticamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar documento",
        description: error instanceof Error ? error.message : "Erro desconhecido ao gerar o documento.",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Visualização do Resultado</h3>
          <div className="text-sm text-gray-500">
            <span>{isReady ? "Pronto para download" : "Aguardando upload da planilha"}</span>
          </div>
        </div>
        
        {!isReady || !data ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
              <FileIcon className="h-16 w-16 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center max-w-md">
              Faça upload de uma planilha Excel para visualizar como os dados serão aplicados ao modelo de documento Word.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center mr-2"
              >
                <FileIcon className="h-4 w-4 mr-1" />
                <span>Página {currentPage}</span>
              </Button>
              <Button 
                className="flex items-center ml-auto"
                onClick={handleDownload}
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                <span>Baixar Documento Word</span>
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "12pt" }}>
                <thead>
                  <tr>
                    <th colSpan={5} className="text-center font-bold bg-gray-100 py-1 border">Página Esquerda</th>
                    <th colSpan={5} className="text-center font-bold bg-gray-100 py-1 border">Página Direita</th>
                  </tr>
                  <tr>
                    <th className="border p-1 min-w-[5cm]">Nome</th>
                    <th className="border p-1 text-center w-[1cm]">CE</th>
                    <th className="border p-1 text-center w-[1cm]">MG</th>
                    <th className="border p-1 text-center w-[1cm]">TB</th>
                    <th className="border p-1 text-center w-[1cm]">IM</th>
                    <th className="border p-1 min-w-[5cm]">Nome</th>
                    <th className="border p-1 text-center w-[1cm]">CE</th>
                    <th className="border p-1 text-center w-[1cm]">MG</th>
                    <th className="border p-1 text-center w-[1cm]">TB</th>
                    <th className="border p-1 text-center w-[1cm]">IM</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr 
                      key={row.id} 
                      style={{ height: "0.6cm", lineHeight: "0.6cm" }}
                      className="border"
                    >
                      <td className="border p-1 overflow-hidden whitespace-nowrap text-overflow-ellipsis">
                        {row.leftSide.name}
                      </td>
                      <td className="border p-1 text-center">
                        {row.leftSide.ce}
                      </td>
                      <td 
                        className={`border p-1 text-center ${row.leftSide.mg && row.leftSide.mg !== "--" ? "font-bold" : ""}`}
                      >
                        {row.leftSide.mg}
                      </td>
                      <td 
                        className={`border p-1 text-center ${row.leftSide.tb && row.leftSide.tb !== "--" ? "font-bold bg-yellow-100" : ""}`}
                      >
                        {row.leftSide.tb}
                      </td>
                      <td 
                        className={`border p-1 text-center ${row.leftSide.im && row.leftSide.im !== "--" ? "font-bold bg-green-100" : ""}`}
                      >
                        {row.leftSide.im}
                      </td>
                      <td className="border p-1 overflow-hidden whitespace-nowrap text-overflow-ellipsis">
                        {row.rightSide.name}
                      </td>
                      <td className="border p-1 text-center">
                        {row.rightSide.ce}
                      </td>
                      <td 
                        className={`border p-1 text-center ${row.rightSide.mg && row.rightSide.mg !== "--" ? "font-bold" : ""}`}
                      >
                        {row.rightSide.mg}
                      </td>
                      <td 
                        className={`border p-1 text-center ${row.rightSide.tb && row.rightSide.tb !== "--" ? "font-bold bg-yellow-100" : ""}`}
                      >
                        {row.rightSide.tb}
                      </td>
                      <td 
                        className={`border p-1 text-center ${row.rightSide.im && row.rightSide.im !== "--" ? "font-bold bg-green-100" : ""}`}
                      >
                        {row.rightSide.im}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
