import express from 'express';
import { userController } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { auditLog } from '../middleware/auditLog';

const router = express.Router();

// Admin only routes
router.get('/', authenticate, authorize(['ADMIN']), auditLog('USER_LIST_VIEWED', 'Users'), userController.getAllUsers);
router.get('/:userId', authenticate, authorize(['ADMIN', 'MODERATOR']), auditLog('USER_VIEWED', 'User'), userController.getUserById);
router.put('/:userId/role', authenticate, authorize(['ADMIN']), auditLog('USER_ROLE_UPDATED', 'User'), userController.updateUserRole);
router.put('/:userId/status', authenticate, authorize(['ADMIN']), auditLog('USER_STATUS_UPDATED', 'User'), userController.toggleUserStatus);
router.delete('/:userId', authenticate, authorize(['ADMIN']), auditLog('USER_DELETED', 'User'), userController.deleteUser);

export default router;