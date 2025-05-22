import * as XLSX from 'xlsx';
import { ExcelData, DataBlock, ProductData } from '@/types';

export async function processExcelFile(file: File): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Look for the specific sheets "LISTA POR PEDIDO" and "CARGA"
        const orderSheetName = "LISTA POR PEDIDO";
        const totalSheetName = "CARGA";
        
        if (!workbook.SheetNames.includes(orderSheetName)) {
          reject(new Error(`A planilha não contém uma aba chamada "${orderSheetName}"`));
          return;
        }
        
        const orderSheet = workbook.Sheets[orderSheetName];
        const orderJsonData = XLSX.utils.sheet_to_json<any>(orderSheet, { header: 1 });
        
        if (orderJsonData.length < 2) {
          reject(new Error("A planilha não contém dados suficientes"));
          return;
        }
        
        // Process the data from LISTA POR PEDIDO
        const processedData = processData(orderJsonData);
        
        // Check if CARGA sheet exists and process it
        let totalProducts: ProductData[] = [];
        if (workbook.SheetNames.includes(totalSheetName)) {
          const totalSheet = workbook.Sheets[totalSheetName];
          const totalJsonData = XLSX.utils.sheet_to_json<any>(totalSheet, { header: 1 });
          
          if (totalJsonData.length >= 2) {
            totalProducts = processTotalData(totalJsonData);
          }
        }
        
        resolve({
          fileName: file.name,
          fileSize: file.size,
          processedData,
          totalProducts
        });
      } catch (error) {
        reject(new Error("Erro ao processar o arquivo Excel. Verifique se o formato está correto."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

function processData(jsonData: any[][]): DataBlock[] {
  const blocks: DataBlock[] = [];
  let currentBlock: DataBlock | null = null;
  
  // Start from row 2 (index 1) as row 1 is headers
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    if (!row || !row[0]) continue; // Skip empty rows
    
    const name = row[0]?.toString().trim() || '';
    const product = row[1]?.toString().trim() || '';
    
    // Check if we have values in columns C-F (indices 2-5)
    const values = [
      row[2] !== undefined ? Number(row[2]) : null,
      row[3] !== undefined ? Number(row[3]) : null,
      row[4] !== undefined ? Number(row[4]) : null,
      row[5] !== undefined ? Number(row[5]) : null
    ];
    
    // If we don't have any values in the required columns, skip this product
    if (values.every(val => val === null || val === 0)) continue;
    
    // Check if this is a new name or continuing with products
    if (currentBlock && currentBlock.name === name) {
      // Check if product already exists in current block
      const existingProduct = currentBlock.products.find(p => p.name === product);
      
      if (existingProduct) {
        // Sum the values with existing product
        for (let j = 0; j < values.length; j++) {
          const newValue = values[j];
          if (newValue !== null && newValue !== undefined) {
            const existingValue = existingProduct.values[j];
            if (existingValue === null || existingValue === undefined) {
              existingProduct.values[j] = newValue;
            } else {
              existingProduct.values[j] = existingValue + newValue;
            }
          }
        }
      } else {
        // Add new product to existing block
        currentBlock.products.push({
          name: product,
          values
        });
      }
    } else {
      // Start a new block
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      
      currentBlock = {
        name,
        products: [{
          name: product,
          values
        }]
      };
    }
  }
  
  // Add the last block if it exists
  if (currentBlock) {
    blocks.push(currentBlock);
  }
  
  // Ordenar produtos dentro de cada bloco em ordem alfabética
  blocks.forEach(block => {
    block.products.sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return blocks;
}

function processTotalData(jsonData: any[][]): ProductData[] {
  const productMap = new Map<string, ProductData>();
  
  // Start from row 2 (index 1) as row 1 is headers
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    if (!row || !row[0]) continue; // Skip empty rows
    
    const product = row[0]?.toString().trim() || '';
    
    // Check if we have values in columns B-E (indices 1-4)
    const values = [
      row[1] !== undefined ? Number(row[1]) : null,
      row[2] !== undefined ? Number(row[2]) : null,
      row[3] !== undefined ? Number(row[3]) : null,
      row[4] !== undefined ? Number(row[4]) : null
    ];
    
    // If we don't have any values in the required columns, skip this product
    if (values.every(val => val === null || val === 0)) continue;
    
    // Check if product already exists
    if (productMap.has(product)) {
      const existingProduct = productMap.get(product)!;
      // Sum the values with existing product
      for (let j = 0; j < values.length; j++) {
        const newValue = values[j];
        if (newValue !== null && newValue !== undefined) {
          const existingValue = existingProduct.values[j];
          if (existingValue === null || existingValue === undefined) {
            existingProduct.values[j] = newValue;
          } else {
            existingProduct.values[j] = existingValue + newValue;
          }
        }
      }
    } else {
      // Add new product to the map
      productMap.set(product, {
        name: product,
        values
      });
    }
  }
  
  // Convert map to array while maintaining insertion order
  const products = Array.from(productMap.values());
  
  // Sort alphabetically to match the order from the main data
  products.sort((a, b) => a.name.localeCompare(b.name));
  
  return products;
}
