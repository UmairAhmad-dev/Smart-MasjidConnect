// routes/hadithRoutes.js
import express from 'express';
import { getDailyHadith, createHadith } from '../controllers/hadithController.js';

const router = express.Router();

// Public route to get the daily Hadith
router.get('/today', getDailyHadith);

// Private route (for now, tested by Postman) to add Hadiths
router.post('/', createHadith);

export default router;