const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
const port = process.env.PORT || 8080;

// ✅ Setup CORS first
const allowedOrigins = [
  'https://dialektogo.web.app',
  'https://testingdialektogo.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ✅ Groq API init
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// ✅ Chat endpoint
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
      model: "llama3-8b-8192",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false
    });

    res.json({ reply: chatCompletion.choices[0].message.content });

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Groq API request failed' });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
