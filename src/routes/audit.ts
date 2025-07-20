import express from 'express';
import { auditController } from '../controllers/auditController';
import { authenticate, authorize } from '../middleware/auth';
import { auditLog } from '../middleware/auditLog';

const router = express.Router();

// Admin only - view all system audit logs
router.get('/system', authenticate, authorize(['ADMIN']), auditLog('SYSTEM_AUDIT_LOGS_VIEWED', 'AuditLog'), auditController.getAuditLogs);

// Any authenticated user - view their own audit logs
router.get('/my-activity', authenticate, auditLog('MY_AUDIT_LOGS_VIEWED', 'AuditLog'), auditController.getMyAuditLogs);

// Backward compatibility - admin endpoint
router.get('/', authenticate, authorize(['ADMIN']), auditLog('AUDIT_LOGS_VIEWED', 'AuditLog'), auditController.getAuditLogs);

export default router;