import express from 'express';

import { register, login, getUserProfile } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validation/userValidator.js';

const router = express.Router();

// Register
router.post('/register', validate(registerSchema), register);

// Login
router.post('/login', validate(loginSchema), login);

// User profile
router.get('/me', auth, getUserProfile);

export default router;