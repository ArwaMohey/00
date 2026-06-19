const User = require('../models/User');

// @desc    Get chat history with a specific user
// @route   GET /api/chat/:userId
// @access  Private
exports.getChatHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const chatHistory = user.chatHistory.find(
            chat => chat.recipient.toString() === req.params.userId
        );

        if (!chatHistory) {
            return res.status(200).json({
                success: true,
                data: {
                    recipient: req.params.userId,
                    messages: []
                }
            });
        }

        res.status(200).json({
            success: true,
            data: chatHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Send message to a user
// @route   POST /api/chat/:userId
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const sender = await User.findById(req.user.id);
        const recipient = await User.findById(req.params.userId);

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }

        // Add message to sender's chat history
        let senderChat = sender.chatHistory.find(
            chat => chat.recipient.toString() === req.params.userId
        );

        if (!senderChat) {
            senderChat = {
                recipient: req.params.userId,
                messages: []
            };
            sender.chatHistory.push(senderChat);
        }

        senderChat.messages.push({
            content,
            sender: req.user.id,
            timestamp: Date.now(),
            read: false
        });

        // Add message to recipient's chat history
        let recipientChat = recipient.chatHistory.find(
            chat => chat.recipient.toString() === req.user.id
        );

        if (!recipientChat) {
            recipientChat = {
                recipient: req.user.id,
                messages: []
            };
            recipient.chatHistory.push(recipientChat);
        }

        recipientChat.messages.push({
            content,
            sender: req.user.id,
            timestamp: Date.now(),
            read: false
        });

        await sender.save();
        await recipient.save();

        res.status(200).json({
            success: true,
            data: {
                message: 'Message sent successfully',
                chat: senderChat
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/:userId/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const chatHistory = user.chatHistory.find(
            chat => chat.recipient.toString() === req.params.userId
        );

        if (chatHistory) {
            chatHistory.messages.forEach(message => {
                if (message.sender.toString() === req.params.userId) {
                    message.read = true;
                }
            });
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}; 