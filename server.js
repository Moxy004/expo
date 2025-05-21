require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;  // Use dynamic port

// Enable CORS for your frontend domain
app.use(cors({ origin: 'https://dialektogo.web.app' }));

app.use(express.json());
app.use(express.static(path.join(__dirname))); // To serve home.html

// Initialize Groq with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Test endpoint to check if the backend is working
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Handle chat requests to the /chat endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Request chat completion from Groq API
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
      model: "llama3-8b-8192", // safer default
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false
    });

    // Send the chat reply to the frontend
    const fullReply = chatCompletion.choices[0].message.content;
    res.json({ reply: fullReply });

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Groq API request failed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
