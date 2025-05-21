import { 
  users, 
  excelTemplates,
  generatedDocuments,
  type User, 
  type InsertUser,
  type ExcelTemplate,
  type InsertExcelTemplate,
  type GeneratedDocument,
  type InsertGeneratedDocument
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Excel template operations
  getExcelTemplates(): Promise<ExcelTemplate[]>;
  getExcelTemplate(id: number): Promise<ExcelTemplate | undefined>;
  createExcelTemplate(template: InsertExcelTemplate): Promise<ExcelTemplate>;
  
  // Generated document operations
  getGeneratedDocuments(): Promise<GeneratedDocument[]>;
  getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined>;
  createGeneratedDocument(document: InsertGeneratedDocument): Promise<GeneratedDocument>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private excelTemplates: Map<number, ExcelTemplate>;
  private generatedDocuments: Map<number, GeneratedDocument>;
  private userId: number;
  private templateId: number;
  private documentId: number;

  constructor() {
    this.users = new Map();
    this.excelTemplates = new Map();
    this.generatedDocuments = new Map();
    this.userId = 1;
    this.templateId = 1;
    this.documentId = 1;
    
    // Add default template
    this.createExcelTemplate({
      name: "Lista de Entrega Padrão",
      description: "Modelo padrão para listas de entrega da Móveis Bonafé",
      defaultRowsPerPage: 50
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Excel template methods
  async getExcelTemplates(): Promise<ExcelTemplate[]> {
    return Array.from(this.excelTemplates.values());
  }
  
  async getExcelTemplate(id: number): Promise<ExcelTemplate | undefined> {
    return this.excelTemplates.get(id);
  }
  
  async createExcelTemplate(insertTemplate: InsertExcelTemplate): Promise<ExcelTemplate> {
    const id = this.templateId++;
    const now = new Date().toISOString();
    
    const template: ExcelTemplate = { 
      ...insertTemplate, 
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.excelTemplates.set(id, template);
    return template;
  }
  
  // Generated document methods
  async getGeneratedDocuments(): Promise<GeneratedDocument[]> {
    return Array.from(this.generatedDocuments.values());
  }
  
  async getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined> {
    return this.generatedDocuments.get(id);
  }
  
  async createGeneratedDocument(insertDocument: InsertGeneratedDocument): Promise<GeneratedDocument> {
    const id = this.documentId++;
    const now = new Date().toISOString();
    
    const document: GeneratedDocument = { 
      ...insertDocument, 
      id,
      createdAt: now
    };
    
    this.generatedDocuments.set(id, document);
    return document;
  }
}

// Export storage instance
export const storage = new MemStorage();
