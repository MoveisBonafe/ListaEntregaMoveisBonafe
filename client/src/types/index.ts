export interface ExcelData {
  fileName: string;
  fileSize: number;
  processedData: DataBlock[];
  totalProducts?: ProductData[]; // Produtos da aba CARGA para seção TOTAL
}

export interface DataBlock {
  name: string;
  products: ProductData[];
}

export interface ProductData {
  name: string;
  values: (number | null)[];
}

export interface WordPreviewRow {
  id: string;
  leftSide: {
    name: string;
    ce: string;
    mg: string;
    tb: string;
    im: string;
  };
  rightSide: {
    name: string;
    ce: string;
    mg: string;
    tb: string;
    im: string;
  };
}

export interface FormatOptions {
  formatMode: 'strict' | 'flexible';
  truncateText: boolean;
  formatNumbers: boolean;
}
