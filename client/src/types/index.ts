// Configuration for document generation
export interface Config {
  limitRowsPerPage: boolean;
  highlightColumns: 'all' | 'tb' | 'im' | 'none';
}

// Customer data model
export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
}

// Product data model
export interface Product {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  quantity: number;
  code: string;
  columns: string[];
  tbColumn: string | null;
  imColumn: string | null;
}

// Processed Excel data
export interface ExcelData {
  customers: Customer[];
  products: Product[];
  totalProducts: number;
  tbColumnCount: number;
  imColumnCount: number;
  detail?: string;
}

// Processing step information
export interface ProcessingStep {
  id: string;
  label: string;
  complete: boolean;
  active: boolean;
  detail?: string;
}

// Processing result
export interface ProcessingResult {
  filename: string;
  timestamp: string;
  pageCount: number;
  stats: {
    customers: number;
    products: number;
    tbColumns: number;
    imColumns: number;
  };
}

// Processing error
export interface ProcessingError {
  message: string;
  details: string;
}
