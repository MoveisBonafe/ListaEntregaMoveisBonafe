import { Document, Packer, Paragraph, Table, TableRow, TableCell, BorderStyle, WidthType, TextRun, HeadingLevel } from 'docx';
import { ExcelData, Config, Product } from '@/types';

export async function generateWordDocument(data: ExcelData, config: Config): Promise<Blob> {
  const { customers, products } = data;
  const { limitRowsPerPage, highlightColumns } = config;
  
  const rowsPerPage = limitRowsPerPage ? 50 : Infinity;
  
  // Organize products by customer
  const productsByCustomer = new Map<string, Product[]>();
  
  customers.forEach(customer => {
    productsByCustomer.set(customer.id, []);
  });
  
  products.forEach(product => {
    if (productsByCustomer.has(product.customerId)) {
      productsByCustomer.get(product.customerId)!.push(product);
    } else {
      // If customer doesn't exist in the map, create a new entry
      productsByCustomer.set(product.customerId, [product]);
    }
  });
  
  // Create document sections (Customer blocks)
  const sections: any[] = [];
  let rowCount = 0;
  
  productsByCustomer.forEach((customerProducts, customerId) => {
    // Find the customer
    const customer = customers.find(c => c.id === customerId);
    
    if (customer) {
      // Add customer header
      sections.push(
        new Paragraph({
          text: customer.name,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200
          }
        })
      );
      
      // If address exists, add it
      if (customer.address || customer.city) {
        sections.push(
          new Paragraph({
            text: `${customer.address}${customer.city ? `, ${customer.city}` : ''}`,
            spacing: {
              before: 100,
              after: 200
            }
          })
        );
      }
      
      // Add products table
      if (customerProducts.length > 0) {
        const tableRows = [
          // Header row
          new TableRow({
            children: [
              createTableCell("Código", true),
              createTableCell("Produto", true),
              createTableCell("Qtd", true),
              createTableCell("TB", true),
              createTableCell("IM", true),
            ],
          }),
          // Product rows
          ...customerProducts.map(product => {
            rowCount++;
            
            // Should we highlight this row's TB column?
            const highlightTB = (highlightColumns === 'all' || highlightColumns === 'tb') && product.tbColumn;
            
            // Should we highlight this row's IM column?
            const highlightIM = (highlightColumns === 'all' || highlightColumns === 'im') && product.imColumn;
            
            return new TableRow({
              children: [
                createTableCell(product.code || ""),
                createTableCell(product.name),
                createTableCell(product.quantity.toString()),
                createTableCell(product.tbColumn || "", false, highlightTB),
                createTableCell(product.imColumn || "", false, highlightIM),
              ],
            });
          }),
        ];
        
        const productsTable = new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
          rows: tableRows,
        });
        
        sections.push(productsTable);
        
        // Add page break if we've reached rowsPerPage
        if (limitRowsPerPage && rowCount >= rowsPerPage) {
          sections.push(
            new Paragraph({
              pageBreakBefore: true,
            })
          );
          rowCount = 0;
        }
      }
    }
  });
  
  // Add TOTAL section at the end
  const totalSection = createTotalSection(products);
  sections.push(...totalSection);
  
  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });
  
  // Generate the document as a blob
  return await Packer.toBlob(doc);
}

// Helper to create table cells
function createTableCell(text: string, isHeader: boolean = false, highlight: boolean = false) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            highlight: highlight ? (highlight === true ? 'yellow' : highlight) : undefined,
          }),
        ],
      }),
    ],
    shading: isHeader ? { fill: "F2F2F2" } : undefined,
  });
}

// Create the TOTAL section at the end of the document
function createTotalSection(products: Product[]): any[] {
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  
  return [
    new Paragraph({
      text: "TOTAL",
      heading: HeadingLevel.HEADING_1,
      spacing: {
        before: 600,
        after: 200
      }
    }),
    new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
      rows: [
        new TableRow({
          children: [
            createTableCell("Total de Produtos", true),
            createTableCell(totalProducts.toString()),
          ],
        }),
        new TableRow({
          children: [
            createTableCell("Quantidade Total", true),
            createTableCell(totalQuantity.toString()),
          ],
        }),
      ],
    }),
  ];
}
