import { Router } from 'express';
import { authRequired, roleRequired } from '../middleware/auth.js';
import {
  getAdminUsers,
  getAdminUserById,
  updateAdminUserStatus,
} from '../controllers/admin.js';

export const adminRouter = Router();

// Protect all admin routes with authRequired & roleRequired('admin')
adminRouter.use(authRequired, roleRequired('admin'));

adminRouter.get('/users', getAdminUsers);
adminRouter.get('/users/:id', getAdminUserById);
adminRouter.put('/users/:id/status', updateAdminUserStatus);
