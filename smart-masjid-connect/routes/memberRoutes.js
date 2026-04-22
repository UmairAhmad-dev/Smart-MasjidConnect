import express from 'express';
const router = express.Router();
import { getMembers, createMember, deleteMember } from '../controllers/memberController.js';

router.route('/').get(getMembers).post(createMember);
router.route('/:id').delete(deleteMember);

export default router;