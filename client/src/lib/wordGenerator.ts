import { Document, Packer, Paragraph, Table, TableRow, TableCell, BorderStyle, WidthType, TextRun, HeadingLevel, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';
import { ExcelData } from '@/types';

export async function generateWordDocument(excelData: ExcelData): Promise<void> {
  const { processedData, totalProducts } = excelData;
  
  // Configuração para exatamente 50 linhas por página
  const ROWS_PER_PAGE = 50;
  
  // Array para armazenar todos os elementos do documento
  const documentElements: any[] = [];
  
  // Contador de linhas na página atual
  let currentPageRows = 0;
  
  // Processar cada bloco de dados (cliente)
  for (const block of processedData) {
    if (block.products.length === 0) continue;
    
    // Verificar se precisamos de uma nova página
    const blockSize = 1 + block.products.length; // 1 para o título + produtos
    
    if (currentPageRows > 0 && currentPageRows + blockSize > ROWS_PER_PAGE) {
      // Adicionar linhas vazias para completar exatamente 50 linhas
      const emptyRowsNeeded = ROWS_PER_PAGE - currentPageRows;
      for (let i = 0; i < emptyRowsNeeded; i++) {
        documentElements.push(new Paragraph({ text: " " }));
      }
      
      // Quebra de página
      documentElements.push(new Paragraph({ pageBreakBefore: true }));
      currentPageRows = 0;
    }
    
    // Adicionar título do bloco (cliente)
    documentElements.push(
      new Paragraph({
        text: block.name,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );
    currentPageRows++;
    
    // Verificar quantos produtos podem caber nesta página
    const availableRows = ROWS_PER_PAGE - currentPageRows - 1; // -1 para o cabeçalho da tabela
    const productsForThisPage = block.products.slice(0, availableRows);
    const remainingProducts = block.products.slice(availableRows);
    
    // Criar tabela para os produtos desta página
    const tableRows = [
      // Linha de cabeçalho
      new TableRow({
        tableHeader: true,
        children: [
          createTableCell("Produto", true),
          createTableCell("CE", true),
          createTableCell("MG", true),
          createTableCell("TB", true),
          createTableCell("IM", true),
        ]
      })
    ];
    
    // Adicionar linhas para os produtos
    for (const product of productsForThisPage) {
      const values = product.values;
      
      // Obter valores para as colunas
      const ce = values[0] !== null ? values[0].toString() : "";
      const mg = values[1] !== null ? values[1].toString() : "";
      const tb = values[2] !== null ? values[2].toString() : "";
      const im = values[3] !== null ? values[3].toString() : "";
      
      // Verificar se precisa destacar TB ou IM
      const highlightTB = tb ? "yellow" : undefined;
      const highlightIM = im ? "green" : undefined;
      
      tableRows.push(
        new TableRow({
          children: [
            createTableCell(product.name),
            createTableCell(ce),
            createTableCell(mg),
            createTableCell(tb, false, highlightTB),
            createTableCell(im, false, highlightIM),
          ]
        })
      );
    }
    
    // Criar e adicionar a tabela
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
      },
      rows: tableRows
    });
    
    documentElements.push(table);
    currentPageRows += 1 + productsForThisPage.length; // Cabeçalho + produtos
    
    // Processar produtos restantes em novas páginas, se necessário
    if (remainingProducts.length > 0) {
      // Completar exatamente 50 linhas na página atual
      const emptyRowsNeeded = ROWS_PER_PAGE - currentPageRows;
      for (let i = 0; i < emptyRowsNeeded; i++) {
        documentElements.push(new Paragraph({ text: " " }));
      }
      
      // Quebra de página
      documentElements.push(new Paragraph({ pageBreakBefore: true }));
      currentPageRows = 0;
      
      // Processar os produtos restantes em novas páginas
      let processedCount = 0;
      while (processedCount < remainingProducts.length) {
        // Adicionar cabeçalho de continuação
        documentElements.push(
          new Paragraph({
            text: `${block.name} (continuação)`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          })
        );
        currentPageRows++;
        
        // Calcular produtos para esta página
        const maxProductsOnThisPage = ROWS_PER_PAGE - currentPageRows - 1; // -1 para o cabeçalho
        const productsOnThisPage = remainingProducts.slice(
          processedCount,
          processedCount + maxProductsOnThisPage
        );
        
        // Criar tabela para continuação
        const continueTableRows = [
          // Linha de cabeçalho
          new TableRow({
            tableHeader: true,
            children: [
              createTableCell("Produto", true),
              createTableCell("CE", true),
              createTableCell("MG", true),
              createTableCell("TB", true),
              createTableCell("IM", true),
            ]
          })
        ];
        
        // Adicionar linhas para os produtos
        for (const product of productsOnThisPage) {
          const values = product.values;
          
          // Obter valores para as colunas
          const ce = values[0] !== null ? values[0].toString() : "";
          const mg = values[1] !== null ? values[1].toString() : "";
          const tb = values[2] !== null ? values[2].toString() : "";
          const im = values[3] !== null ? values[3].toString() : "";
          
          // Verificar se precisa destacar TB ou IM
          const highlightTB = tb ? "yellow" : undefined;
          const highlightIM = im ? "green" : undefined;
          
          continueTableRows.push(
            new TableRow({
              children: [
                createTableCell(product.name),
                createTableCell(ce),
                createTableCell(mg),
                createTableCell(tb, false, highlightTB),
                createTableCell(im, false, highlightIM),
              ]
            })
          );
        }
        
        // Criar e adicionar tabela de continuação
        const continueTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
          rows: continueTableRows
        });
        
        documentElements.push(continueTable);
        currentPageRows += 1 + productsOnThisPage.length;
        
        // Atualizar contador de produtos processados
        processedCount += productsOnThisPage.length;
        
        // Se ainda houver produtos a processar, adicionar nova página
        if (processedCount < remainingProducts.length) {
          // Completar exatamente 50 linhas
          const emptyRowsNeeded = ROWS_PER_PAGE - currentPageRows;
          for (let i = 0; i < emptyRowsNeeded; i++) {
            documentElements.push(new Paragraph({ text: " " }));
          }
          
          // Quebra de página
          documentElements.push(new Paragraph({ pageBreakBefore: true }));
          currentPageRows = 0;
        }
      }
    }
  }
  
  // Adicionar seção TOTAL
  // Verificar se precisa de nova página
  if (currentPageRows + 4 > ROWS_PER_PAGE) { // 4 linhas para título + tabela simples
    // Completar exatamente 50 linhas
    const emptyRowsNeeded = ROWS_PER_PAGE - currentPageRows;
    for (let i = 0; i < emptyRowsNeeded; i++) {
      documentElements.push(new Paragraph({ text: " " }));
    }
    
    // Quebra de página
    documentElements.push(new Paragraph({ pageBreakBefore: true }));
    currentPageRows = 0;
  }
  
  // Adicionar título TOTAL
  documentElements.push(
    new Paragraph({
      text: "TOTAL",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );
  currentPageRows++;
  
  // Criar tabela para a seção TOTAL
  let totalTableRows;
  
  if (totalProducts && totalProducts.length > 0) {
    // Cabeçalho da tabela
    totalTableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          createTableCell("Produto", true),
          createTableCell("Quantidade", true),
        ]
      })
    ];
    
    // Linhas para cada produto total
    for (const product of totalProducts) {
      const quantity = product.values[0] !== null ? product.values[0].toString() : "0";
      
      totalTableRows.push(
        new TableRow({
          children: [
            createTableCell(product.name),
            createTableCell(quantity),
          ]
        })
      );
    }
  } else {
    // Se não houver produtos totais, criar uma tabela simples
    totalTableRows = [
      new TableRow({
        children: [
          createTableCell("Total Geral", true),
          createTableCell("0"),
        ]
      })
    ];
  }
  
  // Criar e adicionar tabela de totais
  const totalTable = new Table({
    width: { size: 70, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: totalTableRows
  });
  
  documentElements.push(totalTable);
  currentPageRows += totalTableRows.length;
  
  // Completar a última página com exatamente 50 linhas
  const finalEmptyRowsNeeded = ROWS_PER_PAGE - currentPageRows;
  if (finalEmptyRowsNeeded > 0) {
    for (let i = 0; i < finalEmptyRowsNeeded; i++) {
      documentElements.push(new Paragraph({ text: " " }));
    }
  }
  
  // Criar o documento com as margens específicas
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(2.0 / 2.54), // 2.0 cm convertido para polegadas e depois twips
              right: convertInchesToTwip(2.5 / 2.54), // 2.5 cm
              bottom: convertInchesToTwip(2.0 / 2.54), // 2.0 cm
              left: convertInchesToTwip(2.5 / 2.54), // 2.5 cm
            },
          },
        },
        children: documentElements,
      },
    ],
  });
  
  // Gerar e salvar o documento
  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Lista_Entrega_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.docx`);
  } catch (error) {
    console.error("Erro ao gerar documento Word:", error);
    throw new Error("Falha ao gerar o documento Word.");
  }
}

// Função auxiliar para criar células da tabela
function createTableCell(text: string, isHeader: boolean = false, highlight?: string) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            highlight: highlight as any, // Conversão necessária para compatibilidade
          }),
        ],
      }),
    ],
    shading: isHeader ? { fill: "F2F2F2" } : undefined,
  });
}