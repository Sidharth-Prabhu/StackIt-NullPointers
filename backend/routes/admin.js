const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

router.delete('/question/:id', auth, isAdmin, (req, res) => {
  db.query('DELETE FROM questions WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete question' });
    res.json({ message: 'Question deleted' });
  });
});

router.post('/ban/:userId', auth, isAdmin, (req, res) => {
  db.query('UPDATE users SET role = "banned" WHERE id = ?', [req.params.userId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to ban user' });
    res.json({ message: 'User banned' });
  });
});

router.post('/broadcast', auth, isAdmin, (req, res) => {
  const { message } = req.body;
  db.query('INSERT INTO notifications (user_id, content) SELECT id, ? FROM users', [message], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to send broadcast' });
    res.json({ message: 'Broadcast sent' });
  });
});

module.exports = router;