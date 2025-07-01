// Import dependencies
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load .env variables

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Get API Key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY tidak ditemukan. Pastikan ada file .env dengan isinya.");
  process.exit(1);
}

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.message;
    if (!userInput) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    // Context for the AI
    const prompt = `
      Anda adalah asisten AI di website portofolio milik Wahyu Setiaji.
      Wahyu adalah seorang Frontend Developer dan Data Entry Specialist dari Balikpapan, Indonesia.
      Keahliannya meliputi HTML, CSS, JavaScript, WordPress, dan Microsoft Office.
      Jawab pertanyaan pengguna secara singkat dan ramah berdasarkan konteks ini. Jika pertanyaannya di luar konteks, jawab dengan sopan bahwa Anda hanya bisa membantu untuk pertanyaan terkait Wahyu Setiaji.

      Pertanyaan Pengguna: "${userInput}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error saat memanggil Gemini API:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
