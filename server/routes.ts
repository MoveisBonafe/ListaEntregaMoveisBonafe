import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for template management
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getExcelTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // API route to store document generation statistics
  app.post("/api/documents", async (req, res) => {
    try {
      const { filename, stats } = req.body;
      
      if (!filename || !stats) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const document = await storage.createGeneratedDocument({
        filename,
        stats: JSON.stringify(stats),
      });
      
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to save document information" });
    }
  });

  // API route to get document generation history
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getGeneratedDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
