import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define database schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Define document schema for Excel to Word conversion
export const excelTemplates = pgTable("excel_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  defaultRowsPerPage: integer("default_rows_per_page").notNull().default(50),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const generatedDocuments = pgTable("generated_documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  stats: text("stats").notNull(), // JSON stringified stats
  createdAt: text("created_at").notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertExcelTemplateSchema = createInsertSchema(excelTemplates).pick({
  name: true,
  description: true,
  defaultRowsPerPage: true,
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).pick({
  filename: true,
  stats: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertExcelTemplate = z.infer<typeof insertExcelTemplateSchema>;
export type ExcelTemplate = typeof excelTemplates.$inferSelect;

export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
