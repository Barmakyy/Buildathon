import express from 'express';
import { generateQuizHandler, getTopicsHandler } from '../controllers/quiz.controller.js';

const router = express.Router();

router.post('/generate', generateQuizHandler);
router.get('/topics/:subject', getTopicsHandler);

export default router;
