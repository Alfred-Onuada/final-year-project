import {Router} from 'express';
import apiRoutes from "./api.routes.js";
import { is_admin, is_logged_in } from '../middlewares/auth.middleware.js';
import DOCTOR from '../models/doctor.model.js';
import PREDICTION from '../models/predictions.model.js';
const router = Router();

router.get('', (req, res) => {
  res.locals.role = req.role;
  res.render('index');
})

router.get('/contact', (req, res) => {
  res.locals.role = req.role;
  res.render('contact');
})

router.get('/register', (req, res) => {
  res.locals.role = req.role;
  res.render('register');
})

router.get('/login', (req, res) => {
  res.locals.role = req.role;
  res.render('login');
})

router.get('/make-prediction', is_logged_in, (req, res) => {
  res.locals.role = req.role;
  res.render('make-prediction');
});

router.get('/history', is_logged_in, async (req, res) => {
  const {userId} = req;
  const predictions = await PREDICTION.find({doctorId: userId})
    .sort({createdAt: -1});
  
  res.locals.predictions = predictions;
  res.locals.role = req.role;
  res.render('history');
});

router.get('/profile', is_logged_in, async (req, res) => {
  const {userId} = req;

  const userInfo = await DOCTOR.findOne({_id: userId}, {__v: 0, password: 0});

  if (!userInfo) {
    res.redirect('/log-out');
    return;
  }

  res.locals.role = req.role;
  res.locals.profile = userInfo;
  res.render('profile');
});

router.get('/youmustbeajoker', (req, res) => {
  res.locals.role = req.role;
  res.render('admin/login');
})

router.get('/youmustbeajoker/doctors', is_admin,  async (req, res) => {
  const doctors = await DOCTOR.find({}, {password: 0, __v: 0})
  
  res.locals.doctors = doctors;
  res.render('admin/doctors');
})

router.get('/log-out', (req, res) => {
  res.clearCookie('accessToken');
  res.redirect('/');
})

router.use('/api', apiRoutes);

router.all('**', (req, res) => {
  res.locals.role = req.role;
  res.status(404).render('404');
})

export default router;