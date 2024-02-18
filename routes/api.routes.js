import { Router } from "express";
import {
  register,
  login,
  get_profile,
  update_profile,
  admin_login,
  register_an_admin
} from "./../controllers/api.controller.js";
import { is_admin, is_logged_in } from "../middlewares/auth.middleware.js";
const router = Router();

router.get('/profile', is_logged_in, get_profile);

router.post('/login', login);

router.post('/register', register);

router.post('/youmustbeajoker/register', is_admin, register_an_admin);

router.post('/youmustbeajoker/login', admin_login);

router.patch('/profile', is_logged_in, update_profile);

export default router;