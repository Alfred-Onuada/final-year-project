import DOCTOR from "../models/doctor.model.js";
import handle_error from "../utils/handle-error.js";
import express from "express";
import jwt from "jsonwebtoken";

/**
 * Creates a JWT
 * @param {InstanceType<typeof DOCTOR>} info
 * @returns {string}
 */
function create_token(info) {
  const token = jwt.sign(
    {
      role: info.role,
      _id: info._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '30d',
    }
  )

  return token;
}

/**
 * Registers doctors
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
export async function register(req, res) {
  try {
    const data = req.body;

    if (typeof data !== 'object') {
      res.status(400).json({message: 'Invalid request'});
      return;
    }

    const doctorInfo = await DOCTOR.create(data);

    const accessToken = create_token(doctorInfo);

    res.status(200).json({message: 'Registration Successful', data: accessToken});
  } catch (error) {
    handle_error(error, res);
  }
}