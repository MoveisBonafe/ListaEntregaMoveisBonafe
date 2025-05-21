import { Document, Packer, Paragraph, Table, TableRow, TableCell, BorderStyle, WidthType, TextRun, HeadingLevel, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';
import { ExcelData } from '@/types';

export async function generateWordDocument(excelData: ExcelData): Promise<void> {
  const { processedData, totalProducts } = excelData;
  
  // Configuração para exatamente 50 linhas por página
  const ROWS_PER_PAGE = 50;
  
  // Agrupar os dados em pares para formar as 10 colunas (5 de cada lado)
  const prepareDataForTables = () => {
    // Criar uma única tabela com dois blocos lado a lado
    let allRows: TableRow[] = [];
    
    // Adicionar cabeçalho da tabela
    allRows.push(
      new TableRow({
        tableHeader: true,
        children: [
          // Lado esquerdo - 5 colunas
          createTableCell("", true),
          createTableCell("CE", true),
          createTableCell("MG", true),
          createTableCell("TB", true),
          createTableCell("IM", true),
          // Lado direito - 5 colunas
          createTableCell("", true),
          createTableCell("CE", true),
          createTableCell("MG", true),
          createTableCell("TB", true),
          createTableCell("IM", true),
        ]
      })
    );
    
    // Dividir os blocos em duas colunas
    let leftBlocks: any[] = [];
    let rightBlocks: any[] = [];
    
    // Distribuir os blocos entre as colunas
    processedData.forEach((block, index) => {
      if (index % 2 === 0) {
        leftBlocks.push(block);
      } else {
        rightBlocks.push(block);
      }
    });
    
    // Número máximo de blocos em qualquer lado
    const maxBlocks = Math.max(leftBlocks.length, rightBlocks.length);
    
    // Processando os dados linha por linha
    let currentRow = 1; // Já contamos o cabeçalho
    
    for (let blockIndex = 0; blockIndex < maxBlocks; blockIndex++) {
      const leftBlock = blockIndex < leftBlocks.length ? leftBlocks[blockIndex] : null;
      const rightBlock = blockIndex < rightBlocks.length ? rightBlocks[blockIndex] : null;
      
      // Adicionar linha com nome dos clientes (em destaque/azul)
      allRows.push(
        new TableRow({
          children: [
            // Cliente do lado esquerdo
            createColoredCell(leftBlock ? leftBlock.name : "", "0070C0", true),
            createTableCell("", false),
            createTableCell("", false),
            createTableCell("", false),
            createTableCell("", false),
            // Cliente do lado direito
            createColoredCell(rightBlock ? rightBlock.name : "", "0070C0", true),
            createTableCell("", false),
            createTableCell("", false),
            createTableCell("", false),
            createTableCell("", false),
          ]
        })
      );
      currentRow++;
      
      // Obter o número máximo de produtos entre os dois blocos
      const leftProducts = leftBlock ? leftBlock.products : [];
      const rightProducts = rightBlock ? rightBlock.products : [];
      const maxProducts = Math.max(leftProducts.length, rightProducts.length);
      
      // Adicionar linhas para os produtos de ambos os blocos
      for (let i = 0; i < maxProducts; i++) {
        // Produto do lado esquerdo
        const leftProduct = i < leftProducts.length ? leftProducts[i] : null;
        const leftValues = leftProduct ? leftProduct.values : [null, null, null, null];
        const leftCE = leftValues[0] !== null ? leftValues[0].toString() : "";
        const leftMG = leftValues[1] !== null ? leftValues[1].toString() : "";
        const leftTB = leftValues[2] !== null ? leftValues[2].toString() : "";
        const leftIM = leftValues[3] !== null ? leftValues[3].toString() : "";
        
        // Produto do lado direito
        const rightProduct = i < rightProducts.length ? rightProducts[i] : null;
        const rightValues = rightProduct ? rightProduct.values : [null, null, null, null];
        const rightCE = rightValues[0] !== null ? rightValues[0].toString() : "";
        const rightMG = rightValues[1] !== null ? rightValues[1].toString() : "";
        const rightTB = rightValues[2] !== null ? rightValues[2].toString() : "";
        const rightIM = rightValues[3] !== null ? rightValues[3].toString() : "";
        
        // Adicionar linha com os produtos
        allRows.push(
          new TableRow({
            children: [
              // Lado esquerdo - produto e valores
              createTableCell(leftProduct ? leftProduct.name : ""),
              createTableCell(leftCE),
              createTableCell(leftMG),
              createTableCell(leftTB, false, leftTB ? "yellow" : undefined),
              createTableCell(leftIM, false, leftIM ? "green" : undefined),
              // Lado direito - produto e valores
              createTableCell(rightProduct ? rightProduct.name : ""),
              createTableCell(rightCE),
              createTableCell(rightMG),
              createTableCell(rightTB, false, rightTB ? "yellow" : undefined),
              createTableCell(rightIM, false, rightIM ? "green" : undefined),
            ]
          })
        );
        currentRow++;
        
        // Se atingiu 50 linhas, encerra esta página
        if (currentRow >= ROWS_PER_PAGE) {
          break;
        }
      }
      
      // Se atingiu 50 linhas, encerra esta página
      if (currentRow >= ROWS_PER_PAGE) {
        break;
      }
    }
    
    // Adicionar linhas vazias para completar exatamente 50 linhas, se necessário
    while (currentRow < ROWS_PER_PAGE) {
      allRows.push(
        new TableRow({
          children: Array(10).fill(createTableCell(""))
        })
      );
      currentRow++;
    }
    
    return allRows;
  };
  
  // Obter as linhas da tabela
  const tableRows = prepareDataForTables();
  
  // Criar a tabela principal
  const mainTable = new Table({
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
        children: [mainTable],
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

// Função auxiliar para criar células coloridas (para os nomes dos clientes)
function createColoredCell(text: string, color: string, isBold: boolean = false) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: isBold,
            color: color,
          }),
        ],
      }),
    ],
  });
}