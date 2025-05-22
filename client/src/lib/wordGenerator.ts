import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  BorderStyle,
  AlignmentType,
  WidthType,
  HeightRule,
} from "docx";
import { saveAs } from "file-saver";
import { ExcelData, DataBlock, ProductData } from "@/types";

// Define typed arrays for sections
interface DocSection {
  properties: Record<string, any>;
  children: Table[];
}

// Interface para as opções de célula da tabela
interface TableCellOptions {
  isHeader?: boolean;
  width?: number;
  bold?: boolean;
  highlight?: "yellow" | "green";
  alignLeft?: boolean;
  colSpan?: number;
}

export async function generateWordDocument(
  excelData: ExcelData,
): Promise<void> {
  // Constants for document formatting
  const fontName = "Times New Roman";
  const fontSize = 24; // 12pt = 24 half-points in docx
  // Altura da linha em twips (1 cm = 567 twips, então 0.5cm = 284 twips exatamente)
  const rowHeight = 284;
  const columnWidth = 1000; // 1.0cm for number columns
  const nameColumnWidth = 5000; // 5.0cm for name columns

  // Create document sections
  const sections = createDocumentSections(excelData.processedData, {
    fontName,
    fontSize,
    rowHeight,
    columnWidth,
    nameColumnWidth,
    totalProducts: excelData.totalProducts,
  });

  // Create the document with table settings
  const doc = new Document({
    sections: sections.map((section) => ({
      ...section,
      properties: {
        ...section.properties,
        // Definindo margens exatas:
        // 2,0 cm para margens superior e inferior (1134 twips = 2cm)
        // 2,5 cm para margens esquerda e direita (1417 twips = 2.5cm)
        page: {
          margin: {
            top: 1134,
            bottom: 1134,
            left: 1417,
            right: 1417,
          },
        },
      },
    })),
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: fontName,
            size: fontSize,
          },
        },
      ],
    },
  });

  try {
    // Generate and save the file - using Blob directly for browser environment
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Lista_${new Date().toISOString().slice(0, 10)}.docx`);
  } catch (error) {
    console.error("Erro ao gerar documento:", error);
    throw new Error("Erro ao gerar o documento. Por favor, tente novamente.");
  }
}

function createDocumentSections(
  blocks: DataBlock[],
  options: {
    fontName: string;
    fontSize: number;
    rowHeight: number;
    columnWidth: number;
    nameColumnWidth: number;
    totalProducts?: ProductData[];
  },
): DocSection[] {
  const sections: DocSection[] = [];
  // Exatamente 50 linhas de cada lado conforme solicitado pelo cliente
  const maxRowsPerSide = 50; // 50 linhas por lado = 100 linhas no total por página
  const blocksWithProducts = blocks.filter(
    (block) => block.products.length > 0,
  );

  // Organiza os blocos em páginas
  const pages: Array<{ leftBlocks: DataBlock[]; rightBlocks: DataBlock[] }> =
    [];

  // Inicializa a primeira página
  let currentPage = {
    leftBlocks: [] as DataBlock[],
    rightBlocks: [] as DataBlock[],
  };

  // Calcula o número de linhas que um bloco ocuparia (nome + produtos + linha extra entre blocos)
  const calculateBlockSize = (block: DataBlock): number => {
    // +1 para o nome e +1 para a linha extra entre blocos (quando não for o último)
    return 1 + block.products.length + (block.products.length > 0 ? 1 : 0);
  };

  // Calcula o total de linhas na coluna esquerda da página atual
  const getLeftColumnSize = (): number => {
    return currentPage.leftBlocks.reduce((total, block) => {
      return total + calculateBlockSize(block);
    }, 0);
  };

  // Calcula o total de linhas na coluna direita da página atual
  const getRightColumnSize = (): number => {
    return currentPage.rightBlocks.reduce((total, block) => {
      return total + calculateBlockSize(block);
    }, 0);
  };

  // Distribui os blocos entre as colunas e páginas seguindo as regras solicitadas
  for (const block of blocksWithProducts) {
    const blockSize = calculateBlockSize(block);

    // Verifica se o bloco cabe na coluna esquerda da página atual
    if (getLeftColumnSize() + blockSize <= maxRowsPerSide) {
      // Adiciona o bloco na coluna esquerda
      currentPage.leftBlocks.push(block);
    }
    // Se não couber na coluna esquerda, tenta na coluna direita
    else if (getRightColumnSize() + blockSize <= maxRowsPerSide) {
      // Adiciona o bloco na coluna direita
      currentPage.rightBlocks.push(block);
    }
    // Se não couber em nenhuma das colunas, inicia uma nova página
    else {
      // Salva a página atual
      pages.push({ ...currentPage });

      // Inicia uma nova página com o bloco na coluna esquerda
      currentPage = {
        leftBlocks: [block],
        rightBlocks: [],
      };
    }
  }

  // Adiciona a última página se houver blocos nela
  if (currentPage.leftBlocks.length > 0 || currentPage.rightBlocks.length > 0) {
    pages.push({ ...currentPage });
  }

  // Processa a seção TOTAL se existirem produtos totais
  if (options.totalProducts && options.totalProducts.length > 0) {
    const totalBlock: DataBlock = {
      name: "TOTAL",
      products: options.totalProducts,
    };

    // Tamanho do bloco TOTAL
    const totalBlockSize = calculateBlockSize(totalBlock);

    // Verifica se há uma página atual com espaço na coluna esquerda
    const lastPage = pages[pages.length - 1];

    if (lastPage) {
      // Verifica se cabe na coluna esquerda da última página
      const leftSize = lastPage.leftBlocks.reduce(
        (total, block) => total + calculateBlockSize(block),
        0,
      );

      if (leftSize + totalBlockSize <= maxRowsPerSide) {
        // Adiciona o bloco TOTAL na coluna esquerda da última página
        lastPage.leftBlocks.push(totalBlock);
      }
      // Se não couber na coluna esquerda, tenta na coluna direita
      else {
        const rightSize = lastPage.rightBlocks.reduce(
          (total, block) => total + calculateBlockSize(block),
          0,
        );

        if (rightSize + totalBlockSize <= maxRowsPerSide) {
          // Adiciona o bloco TOTAL na coluna direita da última página
          lastPage.rightBlocks.push(totalBlock);
        }
        // Se não couber em nenhuma das colunas, cria uma nova página
        else {
          // Cria uma nova página com o bloco TOTAL na coluna esquerda
          pages.push({
            leftBlocks: [totalBlock],
            rightBlocks: [],
          });
        }
      }
    } else {
      // Se não houver página, cria uma com o bloco TOTAL
      pages.push({
        leftBlocks: [totalBlock],
        rightBlocks: [],
      });
    }
  }

  // Usar todas as páginas, mesmo vazias
  // Garantir que pelo menos uma página seja criada
  if (pages.length === 0) {
    pages.push({ leftBlocks: [], rightBlocks: [] });
  }

  // Cria tabelas para todas as páginas, mesmo vazias
  pages.forEach(({ leftBlocks, rightBlocks }) => {
    const table = createPageTable(leftBlocks, rightBlocks, options);

    if (table) {
      // Verifica se a tabela não é nula
      sections.push({
        properties: {},
        children: [table],
      });
    }
  });

  return sections;
}

function createPageTable(
  leftBlocks: DataBlock[],
  rightBlocks: DataBlock[],
  options: {
    fontName: string;
    fontSize: number;
    rowHeight: number;
    columnWidth: number;
    nameColumnWidth: number;
  },
) {
  // Garantir exatamente 50 linhas por página
  const ROWS_PER_PAGE = 50;
  // Limitar texto a 27 caracteres para colunas de nomes
  const truncateNameText = (text: string): string => {
    return text.length > 27 ? text.substring(0, 27) : text;
  };

  // Get the first name for each side (if available)
  const firstLeftName =
    leftBlocks.length > 0 ? truncateNameText(leftBlocks[0].name) : "";
  const firstRightName =
    rightBlocks.length > 0 ? truncateNameText(rightBlocks[0].name) : "";

  // Create header row with names in the first row
  const headerRow = new TableRow({
    height: {
      value: options.rowHeight,
      rule: HeightRule.EXACT,
    },
    children: [
      createTableCell(firstLeftName, options, {
        isHeader: true,
        width: options.nameColumnWidth,
        bold: true,
        alignLeft: true,
      }),
      createTableCell("CE", options, {
        isHeader: true,
        width: options.columnWidth,
        bold: false,
      }),
      createTableCell("MG", options, {
        isHeader: true,
        width: options.columnWidth,
      }),
      createTableCell("TB", options, {
        isHeader: true,
        width: options.columnWidth,
        bold: true,
        highlight: "yellow",
      }),
      createTableCell("IM", options, {
        isHeader: true,
        width: options.columnWidth,
        bold: true,
        highlight: "green",
      }),
      createTableCell(firstRightName, options, {
        isHeader: true,
        width: options.nameColumnWidth,
        bold: true,
        // Removendo alignLeft para que fique centralizado
      }),
      createTableCell("CE", options, {
        isHeader: true,
        width: options.columnWidth,
        bold: false,
      }),
      createTableCell("MG", options, {
        isHeader: true,
        width: options.columnWidth,
      }),
      createTableCell("TB", options, {
        isHeader: true,
        width: options.columnWidth,
        bold: true,
        highlight: "yellow",
      }),
      createTableCell("IM", options, {
        isHeader: true,
        width: options.columnWidth,
        bold: true,
        highlight: "green",
      }),
    ],
  });

  // Create data rows
  const dataRows: TableRow[] = [];

  // Process blocks to create two columns of data
  const leftRows = processBlocksToRows(leftBlocks);
  const rightRows = processBlocksToRows(rightBlocks);

  // Skip the first row of each side since we already included it in the header
  const leftRowsWithoutFirst = leftRows.slice(1);
  const rightRowsWithoutFirst = rightRows.slice(1);

  // Determine max rows needed
  const maxRows = Math.max(
    leftRowsWithoutFirst.length,
    rightRowsWithoutFirst.length,
  );

  // Create rows
  for (let i = 0; i < maxRows; i++) {
    const leftRow = leftRowsWithoutFirst[i] || {
      name: "",
      ce: "",
      mg: "",
      tb: "",
      im: "",
      isAgulha: false,
    };
    const rightRow = rightRowsWithoutFirst[i] || {
      name: "",
      ce: "",
      mg: "",
      tb: "",
      im: "",
      isAgulha: false,
    };

    // Truncar nomes para 27 caracteres
    const leftName =
      leftRow.name.length > 27 ? leftRow.name.substring(0, 27) : leftRow.name;
    const rightName =
      rightRow.name.length > 27
        ? rightRow.name.substring(0, 27)
        : rightRow.name;
    
    // Detectar se é um produto Agulha (para destaque em negrito e amarelo)
    const isLeftAgulha = leftRow.isAgulha || leftName.toLowerCase().includes("agulha");
    const isRightAgulha = rightRow.isAgulha || rightName.toLowerCase().includes("agulha");

    const isLeftNameRow = !!(
      leftRow.name &&
      leftRow.ce === "" &&
      leftRow.mg === "" &&
      leftRow.tb === "" &&
      leftRow.im === ""
    );
    const isRightNameRow = !!(
      rightRow.name &&
      rightRow.ce === "" &&
      rightRow.mg === "" &&
      rightRow.tb === "" &&
      rightRow.im === ""
    );

    // Verificar se esta é uma linha de TOTAL
    const isLeftTotalRow = leftRow.ce === "TOTAL_MARKER";
    const isRightTotalRow = rightRow.ce === "TOTAL_MARKER";

    // Criar uma linha com tratamento especial para TOTAL
    let rowChildren = [];

    if (isLeftTotalRow) {
      // Se for linha TOTAL na esquerda, adiciona TOTAL na primeira coluna e mantém os cabeçalhos CE, MG, TB, IM
      rowChildren = [
        createTableCell("TOTAL", options, {
          width: options.nameColumnWidth,
          bold: true,
          isHeader: true, // Para centralizar e aplicar estilo de cabeçalho
        }),
        createTableCell("CE", options, {
          width: options.columnWidth,
          bold: false,
          isHeader: true,
        }),
        createTableCell("MG", options, {
          width: options.columnWidth,
          bold: true,
          isHeader: true,
        }),
        createTableCell("TB", options, {
          width: options.columnWidth,
          bold: true,
          highlight: "yellow",
          isHeader: true,
        }),
        createTableCell("IM", options, {
          width: options.columnWidth,
          bold: true,
          highlight: "green",
          isHeader: true,
        }),
        createTableCell(rightName, options, {
          width: options.nameColumnWidth,
          bold: isRightNameRow,
          alignLeft: true,
        }),
        createTableCell(rightRow.ce, options, {
          width: options.columnWidth,
          bold: false,
        }),
        createTableCell(rightRow.mg, options, {
          width: options.columnWidth,
          bold: !!rightRow.mg,
        }),
        createTableCell(rightRow.tb, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "yellow",
        }),
        createTableCell(rightRow.im, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "green",
        }),
      ];
    } else if (isRightTotalRow) {
      // Se for linha TOTAL na direita, adiciona TOTAL na primeira coluna e mantém os cabeçalhos CE, MG, TB, IM
      rowChildren = [
        createTableCell(leftName, options, {
          width: options.nameColumnWidth,
          bold: isLeftNameRow,
          alignLeft: true,
        }),
        createTableCell(leftRow.ce, options, {
          width: options.columnWidth,
          bold: false,
        }),
        createTableCell(leftRow.mg, options, {
          width: options.columnWidth,
          bold: !!leftRow.mg,
        }),
        createTableCell(leftRow.tb, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "yellow",
        }),
        createTableCell(leftRow.im, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "green",
        }),
        createTableCell("TOTAL", options, {
          width: options.nameColumnWidth,
          bold: true,
          isHeader: true, // Para centralizar e aplicar estilo de cabeçalho
        }),
        createTableCell("CE", options, {
          width: options.columnWidth,
          bold: false,
          isHeader: true,
        }),
        createTableCell("MG", options, {
          width: options.columnWidth,
          bold: true,
          isHeader: true,
        }),
        createTableCell("TB", options, {
          width: options.columnWidth,
          bold: true,
          highlight: "yellow",
          isHeader: true,
        }),
        createTableCell("IM", options, {
          width: options.columnWidth,
          bold: true,
          highlight: "green",
          isHeader: true,
        }),
      ];
    } else {
      // Linha normal (não é TOTAL)
      rowChildren = [
        createTableCell(leftName, options, {
          width: options.nameColumnWidth,
          bold: isLeftNameRow || isLeftAgulha, // Negrito para nomes de cliente ou produtos Agulha
          alignLeft: true,
          highlight: isLeftAgulha ? "yellow" : undefined, // Destaque amarelo para produtos Agulha
        }),
        createTableCell(leftRow.ce, options, {
          width: options.columnWidth,
          bold: false,
        }),
        createTableCell(leftRow.mg, options, {
          width: options.columnWidth,
          bold: !!leftRow.mg,
        }),
        createTableCell(leftRow.tb, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "yellow",
        }),
        createTableCell(leftRow.im, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "green",
        }),
        createTableCell(rightName, options, {
          width: options.nameColumnWidth,
          bold: isRightNameRow,
          alignLeft: true,
        }),
        createTableCell(rightRow.ce, options, {
          width: options.columnWidth,
          bold: false,
        }),
        createTableCell(rightRow.mg, options, {
          width: options.columnWidth,
          bold: !!rightRow.mg,
        }),
        createTableCell(rightRow.tb, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "yellow",
        }),
        createTableCell(rightRow.im, options, {
          width: options.columnWidth,
          bold: true,
          highlight: "green",
        }),
      ];
    }

    dataRows.push(
      new TableRow({
        height: {
          value: options.rowHeight,
          rule: HeightRule.EXACT,
        },
        children: rowChildren,
      }),
    );
  }

  // Verificar se há blocos com produtos para processar
  const hasRealContent =
    leftBlocks.some((block) => block.products.length > 0) ||
    rightBlocks.some((block) => block.products.length > 0);

  if (hasRealContent && dataRows.length > 0) {
    // Adicionar linhas vazias para preencher a página até o final (como na imagem)
    // Ajustado para 50 linhas em uma página A4 com linhas de 0.6cm
    const totalRowsPerPage = 50;
    const emptyRowsNeeded = totalRowsPerPage - (dataRows.length + 1); // +1 para o cabeçalho

    if (emptyRowsNeeded > 0) {
      // Adicionar linhas vazias para preencher a página
      for (let i = 0; i < emptyRowsNeeded; i++) {
        dataRows.push(
          new TableRow({
            height: {
              value: options.rowHeight,
              rule: HeightRule.EXACT,
            },
            children: [
              createTableCell("", options, { width: options.nameColumnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
              createTableCell("", options, { width: options.nameColumnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
              createTableCell("", options, { width: options.columnWidth }),
            ],
          }),
        );
      }
    }
  }

  // Só criar a tabela se houver dados reais para exibir e se tiver linhas de dados
  if (hasRealContent && dataRows.length > 0) {
    return new Table({
      width: {
        size: 120, // Setting to 120% as requested
        type: WidthType.PERCENTAGE,
      },
      alignment: AlignmentType.CENTER, // Centralizado conforme a imagem
      rows: [headerRow, ...dataRows],
    });
  }

  // Se não houver conteúdo real, retorna null para que a seção não seja criada
  return null as any;
}

function processBlocksToRows(blocks: DataBlock[]) {
  const rows: {
    name: string;
    ce: string;
    mg: string;
    tb: string;
    im: string;
    isAgulha?: boolean; // Adicionando propriedade para identificar produtos Agulha
  }[] = [];

  blocks.forEach((block, blockIndex) => {
    if (block.products.length === 0) return;

    // Verifica se este bloco é a seção TOTAL
    const isTotal = block.name === "TOTAL";

    if (isTotal) {
      // Para a seção TOTAL, a palavra "TOTAL" deve ir centralizada nas colunas de valor
      // Isso será tratado na hora de renderizar, aqui apenas marcamos com um valor especial
      rows.push({
        name: "TOTAL",
        ce: "TOTAL_MARKER", // Marcador especial para identificar linha de TOTAL
        mg: "",
        tb: "",
        im: "",
        isAgulha: false,
      });
    } else {
      // Add the client name first (caso normal para blocos que não são TOTAL)
      rows.push({
        name: block.name,
        ce: "",
        mg: "",
        tb: "",
        im: "",
      });
    }

    // Add product rows
    block.products.forEach((product) => {
      // Only add products that have values in columns C-F
      if (product.values.some((v) => v !== null && v !== 0)) {
        // Verificar se é um produto "Agulha" para destacar
        const isAgulha = product.name.toLowerCase().includes("agulha");
        
        rows.push({
          name: product.name,
          ce: product.values[0]
            ? String(product.values[0]).padStart(2, "0")
            : "",
          mg: product.values[1]
            ? String(product.values[1]).padStart(2, "0")
            : "",
          tb: product.values[2]
            ? String(product.values[2]).padStart(2, "0")
            : "",
          im: product.values[3]
            ? String(product.values[3]).padStart(2, "0")
            : "",
          isAgulha: isAgulha, // Adicionar flag para produtos Agulha
        });
      }
    });

    // Add empty row after each block (except the last one)
    if (blockIndex < blocks.length - 1) {
      rows.push({
        name: "",
        ce: "",
        mg: "",
        tb: "",
        im: "",
        isAgulha: false,
      });
    }
  });

  return rows;
}

function createTableCell(
  text: string,
  options: {
    fontName: string;
    fontSize: number;
  },
  cellOptions: TableCellOptions,
) {
  // Verificar se é um produto que precisa de destaque - aplicar negrito e realce amarelo
  const isAgulhaProduct = typeof text === 'string' && text.toLowerCase().includes('agulha');
  const isCadeiraAltaEstofada = typeof text === 'string' && text.toLowerCase().includes('cadeira alta estofada');
  const needsHighlight = isAgulhaProduct || isCadeiraAltaEstofada;
  
  // Ensure that bold is properly typed as boolean or undefined
  const isBold: boolean | undefined =
    cellOptions.isHeader === true
      ? true
      : needsHighlight // Se for um produto destacado, sempre em negrito
        ? true
        : cellOptions.bold === true
          ? true
          : cellOptions.bold === false
            ? false
            : undefined;
            
  // Se for produto que precisa de destaque, aplicar realce amarelo
  if (needsHighlight && !cellOptions.highlight) {
    cellOptions.highlight = 'yellow';
  }

  // Determine if text should be left-aligned
  const shouldAlignLeft =
    cellOptions.alignLeft ||
    (!cellOptions.isHeader &&
      text !== "" &&
      (isNaN(Number(text)) || text.trim() === ""));

  // Configuração da célula
  const tableCellConfig: any = {
    width: {
      size: cellOptions.width || 1000,
      type: WidthType.DXA,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
    children: [
      new Paragraph({
        alignment: shouldAlignLeft ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [
          new TextRun({
            text: text,
            font: options.fontName,
            size: options.fontSize,
            bold: isBold,
            highlight: cellOptions.highlight,
          }),
        ],
      }),
    ],
  };

  // Adicionar colspan se especificado
  if (cellOptions.colSpan && cellOptions.colSpan > 1) {
    tableCellConfig.columnSpan = cellOptions.colSpan;
  }

  return new TableCell(tableCellConfig);
}
