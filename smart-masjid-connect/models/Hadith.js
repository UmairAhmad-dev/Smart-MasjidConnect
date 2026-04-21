// models/Hadith.js
import mongoose from 'mongoose';

const hadithSchema = new mongoose.Schema({
  // The main English or Urdu translation
  text: { 
    type: String, 
    required: [true, 'Please add the Hadith text'] 
  },
  // The source (e.g., Sahih Bukhari, Muslim)
  source: { 
    type: String, 
    required: [true, 'Please add the source (e.g., Sahih Bukhari)'] 
  },
  // Specific reference (e.g., Hadith #123, Volume 1)
  reference: { 
    type: String 
  },
  // Optional Arabic text
  arabicText: {
    type: String
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// For simplicity, we will fetch the newest Hadith.
// Advanced: You could add a 'isFeatured' boolean and logic to ensure only one is active.

export default mongoose.model('Hadith', hadithSchema);