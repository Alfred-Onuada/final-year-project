import { Router } from "express";
import {
  register,
  login,
  update_profile,
  admin_login,
  register_an_admin,
  store_contact_message,
  update_profile_image,
  make_prediction
} from "./../controllers/api.controller.js";
import { is_admin, is_logged_in } from "../middlewares/auth.middleware.js";
const router = Router();

router.post('/store-contact-messages', store_contact_message)

router.post('/login', login);

router.post('/register', register);

router.patch('/profile', is_logged_in, update_profile);

router.post('/make-prediction', is_logged_in, make_prediction);

router.patch('/update-profile-image', is_logged_in, update_profile_image);

router.post('/youmustbeajoker/register', is_admin, register_an_admin);

router.post('/youmustbeajoker/login', admin_login);


export default router;