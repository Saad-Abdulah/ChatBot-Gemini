const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(cors());

// Load API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

if (!GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY. Set it in .env file.');
    process.exit(1);
}

// Chatbot route
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Send request to Gemini API
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                prompt: {
                    text: userMessage
                }
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const aiResponse = response.data.candidates?.[0]?.output || 'No response from AI';
        res.json({ reply: aiResponse });
    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get response from Gemini' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
