// controllers/prayerTimeController.js
import PrayerTime from '../models/PrayerTime.js';

// @desc    Get the current prayer times (usually the latest entry)
// @route   GET /api/prayertimes/current
export const getCurrentPrayerTimes = async (req, res) => {
  try {
    // Get the very last entry added to the database
    const currentTimes = await PrayerTime.findOne().sort({ createdAt: -1 });
    
    if (!currentTimes) {
      return res.status(404).json({ success: false, message: 'Prayer times not found.' });
    }

    res.status(200).json({ success: true, data: currentTimes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set/Update the current prayer times (for Admin)
// @route   POST /api/prayertimes
export const updatePrayerTimes = async (req, res) => {
  try {
    // Create a new record. The frontend GET request will always fetch the latest one.
    const newTimes = await PrayerTime.create(req.body);
    res.status(201).json({ success: true, data: newTimes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};