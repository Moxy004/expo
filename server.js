require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Allowed origins for CORS
const allowedOrigins = [
  'https://dialektogo.web.app',
  'http://localhost:8080',
  'https://expo-production-aab4.up.railway.app'
];

// CORS middleware with dynamic origin check
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname))); // To serve your frontend files (like home.html)

// Initialize Groq client with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Test endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});
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
      model: "mixtral-8x7b-32768",  // 👈 Updated model here
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const fullReply = chatCompletion.choices[0].message.content;
    res.json({ reply: fullReply });

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: error.message || 'Groq API request failed' });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
