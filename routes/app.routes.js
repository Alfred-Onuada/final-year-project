import {Router} from 'express';
import apiRoutes from "./api.routes.js";
import { is_admin } from '../middlewares/auth.middleware.js';
import DOCTOR from '../models/doctor.model.js';
const router = Router();

router.get('', (req, res) => {
  res.render('index');
})

router.get('/contact', (req, res) => {
  res.render('contact');
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/youmustbeajoker', (req, res) => {
  res.render('admin/login');
})

router.get('/youmustbeajoker/doctors', is_admin,  async (req, res) => {
  const doctors = await DOCTOR.find({}, {password: 0, __v: 0})
  
  res.locals.doctors = doctors;
  res.render('admin/doctors');
})

router.use('/api', apiRoutes);

router.all('**', (req, res) => {
  res.status(404).render('404');
})

export default router;