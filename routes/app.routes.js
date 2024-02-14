import {Router} from 'express';
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
  res.render('admin-login');
})

router.all('**', (req, res) => {
  res.status(404).render('404');
})

export default router;