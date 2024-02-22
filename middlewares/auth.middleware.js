import express from 'express';
import jwt from 'jsonwebtoken';

/**
 * Checks auth status
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export function check_auth_status(req, res, next) {
  try {
    const token = req.cookies['accessToken'];

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.role = payload.role;

    next();
  } catch (error) {
    next();
  }
}

/**
 * Checks auth status if user is logged in
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export function is_logged_in(req, res, next) {
  try {
    const token = req.headers['authorization'].split(' ')[1];

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = payload._id;
    req.role = payload.role;

    next();
  } catch (error) {
    res.status(401).json({message: 'Access Denied'});
  }
}

export function is_admin(req, res, next) {
  try {
    const token = req.headers['authorization'].split(' ')[1];

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = payload._id;

    if (payload.role !== 'admin') {
      res.status(401).json({message: 'Access Denied'});
      return;
    }
    
    next();
  } catch (error) {
    res.status(401).json({message: 'Access Denied'});
  }
}