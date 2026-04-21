// controllers/hadithController.js
import Hadith from '../models/Hadith.js';

// @desc    Get the 'Hadith of the Day' (we will fetch the newest one)
// @route   GET /api/hadith/today
export const getDailyHadith = async (req, res) => {
  try {
    // Find one Hadith, sort by newest (createdAt: -1)
    const hadith = await Hadith.findOne().sort({ createdAt: -1 });

    if (!hadith) {
      return res.status(404).json({ 
        success: false, 
        message: 'No Hadiths found in the database.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: hadith 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Add a new Hadith to the pool (for Postman testing)
// @route   POST /api/hadith
export const createHadith = async (req, res) => {
  try {
    const hadith = await Hadith.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: hadith 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};