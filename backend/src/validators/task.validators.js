import { body, param } from 'express-validator';

export const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('status').optional().isIn(['OPEN','IN_PROGRESS','DONE'])
];

export const updateTaskValidator = [
  param('id').isInt().withMessage('Task id must be an integer'),
  body('title').optional().trim().notEmpty(),
  body('description').optional().isString(),
  body('status').optional().isIn(['OPEN','IN_PROGRESS','DONE'])
];
