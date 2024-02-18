import {Router} from 'express';
import apiRoutes from "./api.routes.js";
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

router.get('/youmustbeajoker/doctors', (req, res) => {
  res.render('admin/doctors');
})

router.use('/api', apiRoutes);

router.all('**', (req, res) => {
  res.status(404).render('404');
})

export default router;