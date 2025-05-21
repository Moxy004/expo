const { Groq } = require("groq-sdk");

const groq = new Groq({ apiKey: "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" }); // Paste it directly for testing

(async () => {
  try {
    const result = await groq.chat.completions.create({
      messages: [
        { role: "user", content: "Hello!" }
      ],
      model: "llama3-70b-8192",
    });

    console.log("✅ Response:", result.choices[0].message.content);
  } catch (error) {
    console.error("❌ Groq API Error:", error.message);
  }
})();
