import * as XLSX from 'xlsx';
import { ExcelData, Customer, Product } from '@/types';

// Function to read and process Excel file
export async function processExcelFile(
  file: File, 
  updateStepDetail: (detail: string) => void
): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Check if required sheets exist
        const requiredSheets = ['LISTA POR PEDIDO', 'CARGA'];
        const sheetNames = workbook.SheetNames;
        
        const missingSheets = requiredSheets.filter(sheet => !sheetNames.includes(sheet));
        if (missingSheets.length > 0) {
          throw new Error(`Required sheets not found: ${missingSheets.join(', ')}`);
        }
        
        updateStepDetail(`Abas "LISTA POR PEDIDO" e "CARGA" encontradas`);
        
        // Process "LISTA POR PEDIDO" sheet
        const listaPorPedidoSheet = workbook.Sheets['LISTA POR PEDIDO'];
        const listaPorPedidoData = XLSX.utils.sheet_to_json(listaPorPedidoSheet);
        
        if (listaPorPedidoData.length === 0) {
          throw new Error('No data found in "LISTA POR PEDIDO" sheet');
        }
        
        // Process "CARGA" sheet
        const cargaSheet = workbook.Sheets['CARGA'];
        const cargaData = XLSX.utils.sheet_to_json(cargaSheet);
        
        if (cargaData.length === 0) {
          throw new Error('No data found in "CARGA" sheet');
        }
        
        // Extract customers from the data
        const customers: Customer[] = extractCustomers(cargaData);
        
        // Extract and sort products
        const products: Product[] = extractAndSortProducts(listaPorPedidoData, customers);
        
        // Return processed data
        resolve({
          customers,
          products,
          totalProducts: products.length,
          tbColumnCount: countSpecialColumns(products, 'TB'),
          imColumnCount: countSpecialColumns(products, 'IM')
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Extract customer information from CARGA sheet
function extractCustomers(cargaData: any[]): Customer[] {
  const customers: Customer[] = [];
  const customerMap = new Map<string, Customer>();
  
  cargaData.forEach((row, index) => {
    // Assuming customer code is in a field like 'CODIGO' or 'COD_CLIENTE'
    const customerId = row['CODIGO'] || row['COD_CLIENTE'] || row['CLIENTE_ID'] || `cliente_${index}`;
    const customerName = row['NOME'] || row['CLIENTE'] || row['RAZAO_SOCIAL'] || `Cliente ${index}`;
    
    if (!customerMap.has(customerId.toString())) {
      const customer: Customer = {
        id: customerId.toString(),
        name: customerName.toString(),
        address: (row['ENDERECO'] || '').toString(),
        city: (row['CIDADE'] || '').toString()
      };
      
      customerMap.set(customerId.toString(), customer);
      customers.push(customer);
    }
  });
  
  return customers;
}

// Extract and sort products by customer
function extractAndSortProducts(pedidoData: any[], customers: Customer[]): Product[] {
  const products: Product[] = [];
  
  // Map to group products by customer
  const productsByCustomer = new Map<string, Product[]>();
  
  pedidoData.forEach((row, index) => {
    // Assuming customer ID is in a field like 'CLIENTE_ID' or 'COD_CLIENTE'
    const customerId = row['CLIENTE_ID'] || row['COD_CLIENTE'] || row['CODIGO'] || '';
    const customerName = row['CLIENTE'] || row['NOME_CLIENTE'] || row['RAZAO_SOCIAL'] || '';
    
    // Find matching customer or create a temporary one
    let customer = customers.find(c => c.id === customerId.toString());
    if (!customer && customers.length > 0) {
      // If we can't find by ID, try to match by name
      customer = customers.find(c => c.name.toLowerCase() === customerName.toString().toLowerCase());
    }
    
    // If we still can't find, use the first customer or create a temporary one
    if (!customer) {
      customer = customers[0] || {
        id: customerId.toString() || `temp_${index}`,
        name: customerName.toString() || `Cliente Temporário`,
        address: '',
        city: ''
      };
    }
    
    // Extract product information
    const product: Product = {
      id: (row['PRODUTO_ID'] || row['COD_PRODUTO'] || index).toString(),
      customerId: customer.id,
      customerName: customer.name,
      name: (row['PRODUTO'] || row['DESCRICAO'] || `Produto ${index}`).toString(),
      quantity: Number(row['QUANTIDADE'] || row['QTD'] || 1),
      code: (row['CODIGO_PRODUTO'] || row['COD'] || '').toString(),
      columns: extractColumns(row),
      tbColumn: findSpecialColumn(row, 'TB'),
      imColumn: findSpecialColumn(row, 'IM')
    };
    
    // Add product to the customer's group
    if (!productsByCustomer.has(customer.id)) {
      productsByCustomer.set(customer.id, []);
    }
    
    productsByCustomer.get(customer.id)!.push(product);
  });
  
  // Sort products alphabetically within each customer group
  productsByCustomer.forEach((customerProducts) => {
    customerProducts.sort((a, b) => a.name.localeCompare(b.name));
    products.push(...customerProducts);
  });
  
  return products;
}

// Extract column data from a row
function extractColumns(row: any): string[] {
  const columns: string[] = [];
  
  // Extract all keys from the row that might represent columns
  Object.keys(row).forEach(key => {
    if (typeof row[key] === 'string' || typeof row[key] === 'number') {
      columns.push(row[key].toString());
    }
  });
  
  return columns;
}

// Find special columns (TB or IM)
function findSpecialColumn(row: any, type: 'TB' | 'IM'): string | null {
  for (const key in row) {
    // Look for keys containing TB or IM
    if (key.includes(type) && row[key]) {
      return row[key].toString();
    }
  }
  
  // Alternative: look for values containing TB or IM
  for (const key in row) {
    if (typeof row[key] === 'string' && row[key].includes(type)) {
      return row[key].toString();
    }
  }
  
  return null;
}

// Count products with special columns
function countSpecialColumns(products: Product[], type: 'TB' | 'IM'): number {
  return products.filter(product => type === 'TB' ? product.tbColumn : product.imColumn).length;
}
