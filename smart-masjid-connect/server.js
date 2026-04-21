// server.js (Corrected with CORS and imports)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // 1. IMPORTANT: Import the 'cors' package
import connectDB from './config/db.js';
import announcementRoutes from './routes/announcementRoutes.js';
import prayerTimeRoutes from './routes/prayerTimeRoutes.js';
import hadithRoutes from './routes/hadithRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// === 2. IMPORTANT: APPLY MIDDLEWARE ===

// A. Enable CORS for ALL origins (safest for development)
// You MUST place this BEFORE defining any routes.
app.use(cors()); 

// B. Body parser (allows reading JSON in requests)
app.use(express.json());


// === 3. MOUNT ROUTERS ===
app.use('/api/announcements', announcementRoutes);
app.use('/api/prayertimes', prayerTimeRoutes);
app.use('/api/hadith', hadithRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));