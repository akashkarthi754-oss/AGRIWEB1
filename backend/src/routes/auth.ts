import { Router } from 'express';
import { signup, login, logout, getMe, getProfile, updateProfile } from '../controllers/auth.js';
import { authRequired } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', authRequired, getMe);

export const userRouter = Router();
userRouter.get('/profile', authRequired, getProfile);
userRouter.put('/profile', authRequired, updateProfile);
userRouter.get('/me', authRequired, getMe);
