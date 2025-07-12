const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch notifications' });
      res.json(results);
    }
  );
});

router.post('/mark-read', auth, (req, res) => {
  db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to mark notifications as read' });
    res.json({ message: 'Notifications marked as read' });
  });
});

module.exports = router;