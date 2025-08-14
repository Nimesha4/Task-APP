import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { createTaskValidator, updateTaskValidator } from '../validators/task.validators.js';
import { validationResult } from 'express-validator';

const router = Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/tasks', verifyJWT, getTasks);
router.post('/tasks', verifyJWT, createTaskValidator, validate, createTask);
router.put('/tasks/:id', verifyJWT, updateTaskValidator, validate, updateTask);
router.delete('/tasks/:id', verifyJWT, deleteTask);

export default router;
