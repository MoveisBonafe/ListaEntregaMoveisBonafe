import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // This application doesn't require any API routes as all processing is done client-side
  // We're only using Express to serve the static frontend files
  
  const httpServer = createServer(app);
  return httpServer;
}
