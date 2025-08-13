import { validationResult } from 'express-validator';
import { pool } from '../db.js';

// GET /tasks
export const getTasks = async (req, res, next) => {
  try {
    const user = req.user;
    let sql, params;
    if (user.role === 'ADMIN') {
      sql = `SELECT t.id, t.title, t.description, t.status, t.userId, u.name as ownerName, t.createdAt, t.updatedAt
             FROM tasks t JOIN users u ON u.id = t.userId ORDER BY t.createdAt DESC`;
      params = {};
    } else {
      sql = `SELECT id, title, description, status, userId, createdAt, updatedAt
             FROM tasks WHERE userId = :userId ORDER BY createdAt DESC`;
      params = { userId: user.id };
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// POST /tasks
export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, description = '', status = 'OPEN' } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, status, userId)
       VALUES (:title, :description, :status, :userId)`,
      { title, description, status, userId }
    );

    const [rows] = await pool.query(
      'SELECT id, title, description, status, userId, createdAt, updatedAt FROM tasks WHERE id = :id',
      { id: result.insertId }
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const taskId = Number(req.params.id);
    const { title, description, status } = req.body;

    // fetch task
    const [existingRows] = await pool.query(
      'SELECT id, userId FROM tasks WHERE id = :id',
      { id: taskId }
    );
    if (!existingRows.length) return res.status(404).json({ message: 'Task not found' });

    const task = existingRows[0];

    // authz: ADMIN can edit any; USER can edit own only
    if (req.user.role !== 'ADMIN' && task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Build dynamic update safely
    const fields = [];
    const params = { id: taskId };
    if (title !== undefined) { fields.push('title = :title'); params.title = title; }
    if (description !== undefined) { fields.push('description = :description'); params.description = description; }
    if (status !== undefined) { fields.push('status = :status'); params.status = status; }

    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });

    await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = :id`,
      params
    );

    const [rows] = await pool.query(
      'SELECT id, title, description, status, userId, createdAt, updatedAt FROM tasks WHERE id = :id',
      { id: taskId }
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);

    const [existingRows] = await pool.query(
      'SELECT id, userId FROM tasks WHERE id = :id',
      { id: taskId }
    );
    if (!existingRows.length) return res.status(404).json({ message: 'Task not found' });

    const task = existingRows[0];
    if (req.user.role !== 'ADMIN' && task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await pool.query('DELETE FROM tasks WHERE id = :id', { id: taskId });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
