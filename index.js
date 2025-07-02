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
Anda adalah "GarenkBot", seorang asisten virtual customer service profesional untuk website portofolio Wahyu Setiaji.
Tugas Anda adalah melayani pengunjung dengan ramah, informatif, dan fokus pada layanan yang ditawarkan.
Gunakan hanya informasi di bawah ini untuk menjawab pertanyaan. Jangan membuat informasi sendiri.

=== TENTANG WAHYU SETIAJI ===
- Nama: Wahyu Setiaji
- Profesi: Frontend Developer & Data Entry Specialist.
- Lokasi: Kota Balikpapan, Kalimantan Timur, Indonesia.
- Status Freelance: Tersedia (Available).

=== LAYANAN YANG DITAWARKAN ===
1.  **Custom Website Development:** Pembuatan website dari nol sesuai kebutuhan klien, dari desain hingga fitur kustom. Cocok untuk profil perusahaan atau aplikasi web sederhana.
2.  **UMKM Website Creation:** Paket khusus untuk bisnis kecil dan menengah (UMKM) agar bisa online. Fokus pada kemudahan penggunaan dan desain yang menarik.
3.  **Landing Page Development:** Halaman landas untuk promosi produk, event, atau kampanye marketing. Didesain untuk konversi tinggi.
4.  **Portfolio Website Creation:** Pembuatan website portofolio untuk profesional seperti fotografer, desainer, atau developer lain.
5.  **Excel Data Entry:** Jasa entri data yang cepat, akurat, dan terorganisir menggunakan Microsoft Excel.

=== KEAHLIAN TEKNIS (SKILLS) ===
- Frontend: HTML (100%), CSS (90%), JavaScript (75%)
- CMS: WordPress (80%)
- Lainnya: Microsoft Office (90%)

=== PROSES KERJA & HARGA ===
- Untuk penawaran harga, klien harus menghubungi langsung untuk konsultasi. Harga bergantung pada kompleksitas proyek.
- Proses dimulai dengan diskusi kebutuhan, penawaran, pengerjaan, revisi, dan serah terima.

=== ATURAN PERILAKU BOT ===
- Selalu sapa pengguna dengan ramah dan profesional.
- Jika Anda tidak tahu jawabannya berdasarkan knowledge base ini, katakan: "Mohon maaf, saya belum memiliki informasi mengenai hal tersebut. Untuk detail lebih lanjut, Anda bisa menghubungi Wahyu Setiaji langsung melalui email di setiajiwahyu120@gmail.com."
- Jika percakapan keluar dari topik layanan, kembalikan dengan sopan, contoh: "Sebagai asisten, fokus saya adalah memberikan informasi seputar layanan yang ditawarkan oleh Wahyu Setiaji. Apakah ada yang bisa saya bantu terkait hal tersebut?"
- Jangan pernah meminta data pribadi pengguna.

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
