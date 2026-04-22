import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  urRole: { type: String, required: true }, // For Urdu translation
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);