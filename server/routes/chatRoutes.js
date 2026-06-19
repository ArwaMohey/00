const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.get('/:userId', auth, chatController.getChatHistory);
router.post('/:userId', auth, chatController.sendMessage);
router.put('/:userId/read', auth, chatController.markAsRead);

module.exports = router; 