import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDocumentSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  },
});

interface AuthenticatedRequest extends Request {
  user?: any; // Using any to match Express.User type from Passport
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update last login
      await storage.updateUserLastLogin(userId);
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats (Admin only)
  app.get('/api/dashboard/stats', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Online sessions (Admin only)
  app.get('/api/sessions/active', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const sessions = await storage.getActiveSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      res.status(500).json({ message: "Failed to fetch active sessions" });
    }
  });

  // Document routes
  
  // Get documents by type
  app.get('/api/documents/:type', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { type } = req.params;
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (type !== 'reference' && type !== 'patient') {
        return res.status(400).json({ message: "Invalid document type" });
      }

      // Reference documents - Admin only
      if (type === 'reference' && user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      // Patient documents - Doctors and the patient themselves
      if (type === 'patient' && user.role === 'patient') {
        const documents = await storage.getDocumentsByPatient(userId);
        return res.json(documents);
      }

      const documents = await storage.getDocumentsByType(type);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Upload document
  app.post('/api/documents/upload', isAuthenticated, upload.single('file'), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { type, patientId } = req.body;

      // Validate document type
      if (type !== 'reference' && type !== 'patient') {
        return res.status(400).json({ message: "Invalid document type" });
      }

      // Reference documents - Admin only
      if (type === 'reference' && user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      // Patient documents - Doctors only
      if (type === 'patient' && user.role !== 'doctor') {
        return res.status(403).json({ message: "Access denied" });
      }

      const documentData = {
        name: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        type: type as 'reference' | 'patient',
        uploadedById: userId,
        patientId: type === 'patient' ? patientId : null,
        status: 'uploading' as const,
      };

      const document = await storage.createDocument(documentData);

      // Simulate processing (in real app, this would be a background job)
      setTimeout(async () => {
        await storage.updateDocument(document.id, { 
          status: 'processing',
          progress: 50 
        });
        
        // Simulate completion
        setTimeout(async () => {
          await storage.updateDocument(document.id, { 
            status: 'indexed',
            progress: 100,
            metadata: {
              aiAnalysis: {
                summary: "Document processed successfully",
                keyFindings: ["Finding 1", "Finding 2"],
                riskAssessment: "Low",
                recommendations: ["Recommendation 1", "Recommendation 2"]
              }
            }
          });
        }, 3000);
      }, 1000);

      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Get document by ID
  app.get('/api/documents/detail/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // For now, return mock document details
      // In real implementation, fetch from storage
      const mockDocument = {
        id,
        name: "Patient Report #001",
        type: "patient",
        analysis: {
          patientInfo: {
            age: "45",
            gender: "Male",
            condition: "Chest pain and shortness of breath",
            history: "History of hypertension"
          },
          keyFindings: [
            "Elevated troponin levels",
            "ECG shows ST elevation",
            "Blood pressure: 150/90"
          ],
          aiRecommendations: "Consider immediate cardiac catheterization. Review with cardiology team urgently.",
          riskAssessment: "High Risk",
          similarCases: [
            "Case #A4521: Similar presentation, successful PCI outcome",
            "Case #B7832: Comparable troponin levels, medical management"
          ],
          treatmentSuggestions: [
            "Aspirin 325mg immediately",
            "Clopidogrel loading dose",
            "Heparin per protocol",
            "Urgent cardiology consultation"
          ]
        }
      };

      res.json(mockDocument);
    } catch (error) {
      console.error("Error fetching document details:", error);
      res.status(500).json({ message: "Failed to fetch document details" });
    }
  });

  // Update user role (Admin only)
  app.patch('/api/users/:id/role', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      // In real implementation, update user role
      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
