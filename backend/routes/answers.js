const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.post('/:questionId', auth, (req, res) => {
  const { content } = req.body;
  const questionId = req.params.questionId;
  db.query(
    'INSERT INTO answers (user_id, question_id, content) VALUES (?, ?, ?)',
    [req.user.id, questionId, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to post answer' });
      db.query(
        'INSERT INTO notifications (user_id, content) SELECT user_id, ? FROM questions WHERE id = ?',
        [`New answer on your question`, questionId]
      );
      res.status(201).json({ message: 'Answer posted' });
    }
  );
});

router.post('/:answerId/vote', auth, (req, res) => {
  const { vote_type } = req.body;
  const answerId = req.params.answerId;
  db.query(
    'INSERT INTO votes (user_id, answer_id, vote_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE vote_type = ?',
    [req.user.id, answerId, vote_type, vote_type],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to vote' });
      const voteChange = vote_type === 'upvote' ? 1 : -1;
      db.query('UPDATE answers SET votes = votes + ? WHERE id = ?', [voteChange, answerId]);
      res.json({ message: 'Vote recorded' });
    }
  );
});

router.post('/:answerId/accept', auth, (req, res) => {
  const answerId = req.params.answerId;
  db.query(
    'UPDATE answers SET is_accepted = TRUE WHERE id = ? AND question_id IN (SELECT id FROM questions WHERE user_id = ?)',
    [answerId, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to accept answer' });
      res.json({ message: 'Answer accepted' });
    }
  );
});

module.exports = router;