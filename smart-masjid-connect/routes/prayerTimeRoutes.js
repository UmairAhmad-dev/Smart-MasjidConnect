// routes/prayerTimeRoutes.js
import express from 'express';
import { getCurrentPrayerTimes, updatePrayerTimes } from '../controllers/prayerTimeController.js';

const router = express.Router();

router.get('/current', getCurrentPrayerTimes);
router.post('/', updatePrayerTimes); // In production, protect this route!

export default router;