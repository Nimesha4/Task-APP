import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';
import { validationResult } from 'express-validator';

const router = Router();

// helper to return validation errors (ensure uniform handling even if controller forgets)
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/register', registerValidator, validate, register);
router.post('/login',    loginValidator,    validate, login);

export default router;
