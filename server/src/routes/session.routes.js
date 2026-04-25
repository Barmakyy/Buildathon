import express from 'express';
import {
  getSessions,
  getSession,
  createSession,
  deleteSession,
} from '../controllers/session.controller.js';

const router = express.Router();

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:id', getSession);
router.delete('/:id', deleteSession);

export default router;
