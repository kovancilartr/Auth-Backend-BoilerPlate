import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/auditService';

import { AuthRequest } from '../middleware/auth';

export const auditController = {
  // Admin only - All system audit logs
  getAuditLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const filters: any = {};
      if (req.query.userId) filters.userId = req.query.userId as string;
      if (req.query.action) filters.action = req.query.action as string;
      if (req.query.resource) filters.resource = req.query.resource as string;
      if (req.query.success !== undefined) filters.success = req.query.success === 'true';
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
      
      const result = await auditService.getAuditLogs(page, limit, filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // User can view their own audit logs
  getMyAuditLogs: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20; // Smaller limit for users
      
      const filters: any = {
        userId: req.user!.id // Only their own logs
      };
      
      if (req.query.action) filters.action = req.query.action as string;
      if (req.query.resource) filters.resource = req.query.resource as string;
      if (req.query.success !== undefined) filters.success = req.query.success === 'true';
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
      
      const result = await auditService.getAuditLogs(page, limit, filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};