import express from 'express';
import { addUser, loginUser } from '../../controllers/user/UserController.js';

const router = express.Router();


router.post('/adduser', addUser);

router.post('/login', loginUser);

export default router;
