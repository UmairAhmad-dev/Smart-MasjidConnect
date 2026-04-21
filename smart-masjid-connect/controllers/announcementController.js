// controllers/announcementController.js
import Announcement from '../models/Announcement.js'; // Ensure .js extension is present

// @desc    Get all announcements
// @route   GET /api/announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
export const createAnnouncement = async (req, res) => {
  try {
    // Assuming request body contains fields defined in your model (e.g., title, content)
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single announcement by ID
// @route   GET /api/announcements/:id
export const getAnnouncement = async (req, res) => {
  try {
    // CRITICAL: We use 'await' before 'Announcement.findById'
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    // This catch often handles invalid MongoDB ObjectId formats
    res.status(400).json({ success: false, message: `Invalid ID format: ${error.message}` });
  }
};

// @desc    Update announcement by ID
// @route   PUT /api/announcements/:id
export const updateAnnouncement = async (req, res) => {
  try {
    // CRITICAL: We use 'await' before 'Announcement.findByIdAndUpdate'
    // { new: true } returns the updated document
    // { runValidators: true } ensures the update respects model validation rules
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete announcement by ID
// @route   DELETE /api/announcements/:id
export const deleteAnnouncement = async (req, res) => {
  try {
    // CRITICAL: We use 'await' before 'Announcement.findByIdAndDelete'
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    // Standard practice for DELETE is to return success but an empty data object
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};