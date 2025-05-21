const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Allowed origins for CORS
const allowedOrigins = [
  'https://dialektogo.web.app',
  'http://localhost:8080',
  'https://expo-production-aab4.up.railway.app',
  'https://pwa---dialektogo.web.app',
];

// Use CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow tools like Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend files if any

// Use API key from .env or fall back to hardcoded key
const apiKey = process.env.GROQ_API_KEY || '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';
const groq = new Groq({ apiKey });

// Test endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a friendly and helpful Tagalog assistant. The user is a foreigner in the Philippines learning Tagalog. Assist them by translating English to Tagalog, answering questions, or providing phrases they might need in various situations (e.g., asking for directions, ordering food, etc.). Your responses should be natural, conversational, and not overly formal. Include the pronunciation of each phrase or word."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama3-70b-8192",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const fullReply = chatCompletion.choices[0].message.content;
    res.json({ reply: fullReply });

  } catch (error) {
    console.error('❌ Groq API error:', error);
    res.status(500).json({ error: error.message || 'Groq API request failed' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
