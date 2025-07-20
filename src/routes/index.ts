import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import auditRoutes from './audit';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/audit', auditRoutes);

export default router;