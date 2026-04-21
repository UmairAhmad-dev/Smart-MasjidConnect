// routes/announcementRoutes.js
import express from 'express'; // Changed from require
const router = express.Router();

// Changed from require. MUST add .js extension to the path!
import {
  getAnnouncements,
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';

// Route mapping (this stays the same)
router.route('/')
  .get(getAnnouncements)
  .post(createAnnouncement);

router.route('/:id')
  .get(getAnnouncement)
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

export default router; // Changed from module.exports = router