const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.post('/', auth, (req, res) => {
  const { title, description, tags } = req.body;
  db.query(
    'INSERT INTO questions (user_id, title, description) VALUES (?, ?, ?)',
    [req.user.id, title, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to post question' });
      const questionId = result.insertId;
      tags.forEach(tag => {
        db.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tag], (err, tagResult) => {
          if (err) return;
          db.query('SELECT id FROM tags WHERE name = ?', [tag], (err, tagData) => {
            db.query('INSERT INTO question_tags (question_id, tag_id) VALUES (?, ?)', [questionId, tagData[0].id]);
          });
        });
      });
      res.status(201).json({ message: 'Question posted' });
    }
  );
});

router.get('/', (req, res) => {
  db.query(
    `SELECT q.*, u.username, GROUP_CONCAT(t.name) as tags 
     FROM questions q 
     JOIN users u ON q.user_id = u.id 
     LEFT JOIN question_tags qt ON q.id = qt.question_id 
     LEFT JOIN tags t ON qt.tag_id = t.id 
     GROUP BY q.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch questions' });
      res.json(results);
    }
  );
});

module.exports = router;