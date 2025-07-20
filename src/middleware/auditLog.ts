import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/auditService';
import { AuthRequest } from './auth';

export const auditLog = (action: string, resource?: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Override res.send
    res.send = function(data) {
      logAuditEvent();
      return originalSend.call(this, data);
    };
    
    // Override res.json
    res.json = function(data) {
      logAuditEvent();
      return originalJson.call(this, data);
    };
    
    const logAuditEvent = () => {
      // Only log once
      if ((res as any)._auditLogged) return;
      (res as any)._auditLogged = true;
      
      const success = res.statusCode >= 200 && res.statusCode < 400;
      
      // Extract resource ID from params if available
      const resourceId = req.params.userId || req.params.id || req.params.resourceId;
      
      // Get IP address
      const ipAddress = req.ip || 
                       req.connection.remoteAddress || 
                       req.socket.remoteAddress ||
                       (req.connection as any)?.socket?.remoteAddress;
      
      auditService.log({
        userId: req.user?.id,
        userEmail: req.user?.email,
        action,
        resource: resource || req.route?.path || req.path,
        resourceId,
        details: {
          method: req.method,
          url: req.originalUrl,
          body: sanitizeBody(req.body),
          query: req.query,
          statusCode: res.statusCode
        },
        ipAddress,
        userAgent: req.get('User-Agent'),
        success
      });
    };
    
    next();
  };
};

// Sanitize sensitive data from request body
const sanitizeBody = (body: any) => {
  if (!body || typeof body !== 'object') return body;
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'refreshToken', 'secret'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};