import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // This application doesn't require any API routes as all processing is done client-side
  // We're only using Express to serve the static frontend files
  
  // Redirect from the landing page to the app directly
  app.get('/', (req, res) => {
    res.redirect('/app.html');
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
