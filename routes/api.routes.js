import { Router } from "express";
import {
  register,
  login
} from "./../controllers/api.controller.js";
const router = Router();

router.get('/profile');

router.get('/admin/login');

router.post('/login', login);

router.post('/register', register);

router.post('/admin/login');

router.patch('/profile');

export default router;