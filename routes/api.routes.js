import { Router } from "express";
import {
  register,
  login,
  get_profile
} from "./../controllers/api.controller.js";
import { is_logged_in } from "../middlewares/auth.middleware.js";
const router = Router();

router.get('/profile', is_logged_in, get_profile);

router.post('/login', login);

router.post('/register', register);

router.post('/admin/login');

router.patch('/profile');

export default router;