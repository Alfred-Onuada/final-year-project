import express from 'express';
import jwt from 'jsonwebtoken';

/**
 * Checks auth status
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