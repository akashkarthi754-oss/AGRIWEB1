import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/index.js';
import { config } from '../config/index.js';
import { AuthRequest } from '../middleware/auth.js';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      phone: user.phone,
      name: user.name,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );
};

export const sanitizeUser = (user: any) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  // normalize id for frontend
  userObj.id = userObj._id ? userObj._id.toString() : userObj.id;
  return userObj;
};

// POST /api/auth/signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      phone,
      email,
      password,
      role = 'farmer',
      language = 'en',
      location,
      organization,
      farmerDetails,
      buyerDetails,
      transporterDetails,
      adminInviteCode,
    } = req.body;

    // Normalize and validate role
    const normalizedRole = (role || 'farmer').toLowerCase().trim();
    const validRoles = ['farmer', 'buyer', 'transporter', 'admin', 'logistics'];
    if (!validRoles.includes(normalizedRole)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
      return;
    }

    // Secure Admin Registration: Require invite code
    if (normalizedRole === 'admin') {
      const expectedCode = process.env.ADMIN_INVITE_CODE || 'AGRICONNECT_ADMIN_2026';
      if (!adminInviteCode || adminInviteCode.trim() !== expectedCode) {
        res.status(403).json({
          success: false,
          message: 'Invalid Admin Invitation Code. Public admin registration is restricted.',
        });
        return;
      }
    }

    // Name validation
    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Full Name is required',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
      return;
    }

    // Phone validation (10 digits minimum)
    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number.',
      });
      return;
    }

    // Password validation (8 characters minimum)
    if (!password || password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check unique email in MongoDB
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: 'This email is already registered. Please log in.',
      });
      return;
    }

    // Check unique phone in MongoDB
    const existingPhone = await User.findOne({ phone: cleanPhone });
    if (existingPhone) {
      res.status(409).json({
        success: false,
        message: 'This phone number is already registered.',
      });
      return;
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare location object
    const userLocation = {
      state: location?.state || '',
      district: location?.district || '',
      village: location?.village || '',
      address: location?.address || '',
      pincode: location?.pincode || '',
    };

    // Create user in MongoDB
    const newUser = await User.create({
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password: hashedPassword,
      role: normalizedRole === 'logistics' ? 'transporter' : normalizedRole,
      language: language || 'en',
      location: userLocation,
      organization: organization?.trim() || '',
      farmerDetails: farmerDetails || {},
      buyerDetails: buyerDetails || {},
      transporterDetails: transporterDetails || {},
      isVerified: true,
      isActive: true,
    });

    const token = generateToken(newUser);
    const safeUser = sanitizeUser(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, email, phone, password } = req.body;
    const loginIdentifier = (identifier || email || phone || '').toString().trim();

    if (!loginIdentifier) {
      res.status(400).json({
        success: false,
        message: 'Please enter your registered email or phone number.',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Please enter your password.',
      });
      return;
    }

    // Search in MongoDB by email or phone
    const cleanPhone = loginIdentifier.replace(/\D/g, '');
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        ...(cleanPhone.length >= 10 ? [{ phone: cleanPhone }] : [{ phone: loginIdentifier }]),
      ],
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'No account found with this email or phone number.',
      });
      return;
    }

    // Check account status
    if (user.isActive === false) {
      res.status(403).json({
        success: false,
        message: 'Your account has been disabled. Please contact support.',
      });
      return;
    }

    // Compare bcrypt password hash
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
      return;
    }

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to connect to the server. Please try again.',
      error: error.message,
    });
  }
};

// POST /api/auth/logout
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Signed out successfully',
  });
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    res.json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message,
    });
  }
};

// GET /api/users/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await User.findById(req.user._id).select('-password');
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
      message: 'Failed to retrieve profile',
      error: error.message,
    });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const {
      name,
      language,
      location,
      organization,
      avatar,
      farmerDetails,
      buyerDetails,
      transporterDetails,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(language && { language }),
        ...(location && { location }),
        ...(organization !== undefined && { organization }),
        ...(avatar !== undefined && { avatar }),
        ...(farmerDetails && { farmerDetails }),
        ...(buyerDetails && { buyerDetails }),
        ...(transporterDetails && { transporterDetails }),
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizeUser(updatedUser),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};
