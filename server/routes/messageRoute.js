import express from 'express'
import { addMessage, getAllMessages } from '../controllers/messageController.js';

const messageRoute = express.Router();

messageRoute.post('/add_msg/', addMessage);
messageRoute.post('/get_msg', getAllMessages);

export default messageRoute;