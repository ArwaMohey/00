import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipient, setRecipient] = useState(null);
    const messagesEndRef = useRef(null);
    const { userId } = useParams();
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`/api/chat/${userId}`);
                setMessages(response.data.data.messages || []);
                setRecipient(response.data.data.recipient);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
        const interval = setInterval(fetchChatHistory, 5000); // Poll for new messages

        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(`/api/chat/${userId}`, {
                content: newMessage
            });
            setMessages(response.data.data.chat.messages);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat with {recipient?.name || 'User'}</h2>
            </div>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${
                            message.sender === user.id ? 'sent' : 'received'
                        }`}
                    >
                        <div className="message-content">{message.content}</div>
                        <div className="message-timestamp">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat; 