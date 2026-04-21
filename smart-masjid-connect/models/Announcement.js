// models/Announcement.js
import mongoose from 'mongoose'; // Assuming you are using mongoose

const announcementSchema = new mongoose.Schema({
  // ... your schema definition ...
  title: { type: String, required: true },
  content: { type: String, required: true },
  // ...
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement; // Ensure it looks like this
// module.exports = Announcement; // <-- NOT LIKE THIS