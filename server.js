const express = require('express');
const { Groq } = require('groq-sdk');

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: "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" });

app.post('/chat', async (req, res) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: req.body.message }],
      model: "llama3-70b-8192",
    });
    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('❌ Groq API error:', error);
    res.status(500).json({ error: error.message || 'Groq API request failed' });
  }
});

app.listen(8080, () => console.log('Server running on port 8080'));
