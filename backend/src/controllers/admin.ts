import { Response } from 'express';
import { User } from '../models/index.js';
import { AuthRequest } from '../middleware/auth.js';
import { sanitizeUser } from './auth.js';

// GET /api/admin/users
export const getAdminUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const totalUsers = users.length;
    const farmersCount = users.filter((u) => u.role === 'farmer').length;
    const buyersCount = users.filter((u) => u.role === 'buyer').length;
    const transportersCount = users.filter((u) => u.role === 'transporter' || u.role === 'logistics').length;
    const adminsCount = users.filter((u) => u.role === 'admin').length;
    const activeUsers = users.filter((u) => u.isActive !== false).length;
    const inactiveUsers = users.filter((u) => u.isActive === false).length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        farmersCount,
        buyersCount,
        transportersCount,
        adminsCount,
        activeUsers,
        inactiveUsers,
        recentRegistrations: users.slice(0, 5).map(sanitizeUser),
      },
      users: users.map(sanitizeUser),
    });
  } catch (error: any) {
    console.error('getAdminUsers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
};

// GET /api/admin/users/:id
export const getAdminUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error.message,
    });
  }
};

// PUT /api/admin/users/:id/status
export const updateAdminUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'isActive boolean is required',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      message: `User account has been ${isActive ? 'activated' : 'deactivated'}`,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message,
    });
  }
};
