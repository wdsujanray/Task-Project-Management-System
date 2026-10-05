const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task & Project Management System API is running',
  });
});

module.exports = router;
