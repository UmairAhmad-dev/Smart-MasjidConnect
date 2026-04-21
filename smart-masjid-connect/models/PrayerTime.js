// models/PrayerTime.js
import mongoose from 'mongoose';

const prayerTimeSchema = new mongoose.Schema({
  dateEn: { type: String, required: true }, // e.g., "Friday, 17 Apr 2026"
  dateUr: { type: String, required: true }, // e.g., "جمعہ، 17 اپریل 2026ء"
  nextPrayerTime: { type: String, required: true }, // e.g., "1:00 PM"
  times: [
    {
      name: { type: String, required: true }, // e.g., "Fajr"
      time: { type: String, required: true }, // e.g., "5:00 AM"
      urName: { type: String, required: true } // e.g., "فجر"
    }
  ]
}, { timestamps: true });

const PrayerTime = mongoose.model('PrayerTime', prayerTimeSchema);

export default PrayerTime;