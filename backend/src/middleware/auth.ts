import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User, IUser } from '../models/index.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authRequired = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists or session expired',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const roleRequired = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const userRole = req.user.role;
    // Normalize aliases: transporter <-> logistics
    const effectiveRoles = [...roles];
    if (roles.includes('transporter') && !effectiveRoles.includes('logistics')) {
      effectiveRoles.push('logistics');
    }
    if (roles.includes('logistics') && !effectiveRoles.includes('transporter')) {
      effectiveRoles.push('transporter');
    }

    if (!effectiveRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: role '${userRole}' does not have permission to access this resource`,
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
};
