const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = {
      user: req.user.id,
      title: { $regex: search, $options: 'i' }
    };

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, dueDate, priority, categories } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      dueDate: dueDate || null,
      priority,
      categories,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, completed, dueDate, priority, categories } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Task title cannot be empty' });
      }
      updates.title = title;
    }

    if (completed !== undefined) {
      updates.completed = completed;
    }

    if (dueDate !== undefined) {
      updates.dueDate = dueDate || null;
    }

    if (priority !== undefined) {
      updates.priority = priority;
    }

    if (categories !== undefined) {
      updates.categories = categories;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete task' });
  }
});

module.exports = router;
