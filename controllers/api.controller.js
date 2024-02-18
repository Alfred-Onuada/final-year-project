import DOCTOR from "../models/doctor.model.js";
import ADMIN from "../models/admin.model.js";
import handle_error from "../utils/handle-error.js";
import express from "express";
import jwt from "jsonwebtoken";
import {compareSync, hashSync} from 'bcrypt';

/**
 * Creates a JWT
 * @param {InstanceType<typeof DOCTOR>} info
 * @returns {string}
 */
function create_token(info, role) {
  const token = jwt.sign(
    {
      role: role ? role : info.role,
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
 * Registers an ADMIN
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
export async function register_an_admin(req, res) {
  try {
    const data = req.body;

    if (typeof data !== 'object') {
      res.status(400).json({message: 'Invalid request'});
      return;
    }

    await ADMIN.create(data);

    res.status(200).json({message: 'Admin added successfully'});
  } catch (error) {
    handle_error(error, res);
  }
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

/**
 * Logs doctors in
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
export async function login(req, res) {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }

    const doctorInfo = await DOCTOR.findOne({email});

    if (!doctorInfo) {
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }

    const passwordMatch = compareSync(password, doctorInfo.password);

    if (!passwordMatch) {
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }

    const accessToken = create_token(doctorInfo);

    res.status(200).json({message: 'Registration Successful', data: accessToken});
  } catch (error) {
    handle_error(error, res);
  }
}

/**
 * Logs Admin in
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
export async function admin_login(req, res) {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }

    const adminInfo = await ADMIN.findOne({email});

    if (!adminInfo) {
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }

    const passwordMatch = compareSync(password, adminInfo.password);

    if (!passwordMatch) {
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }

    const accessToken = create_token(adminInfo, 'admin');

    res.status(200).json({message: 'Registration Successful', data: accessToken});
  } catch (error) {
    handle_error(error, res);
  }
}

/**
 * Retrieves profile information
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
export async function get_profile(req, res) {
  try {
    const {userId} = req;

    const userInfo = await DOCTOR.findOne({_id: userId}, {__v: 0, password: 0});

    if (!userInfo) {
      res.status(404).json({message: 'User not found'});
      return;
    }

    res.status(200).json({message: 'Success', data: userInfo});
  } catch (error) {
    handle_error(error, res);
  }
}

/**
 * Updates the profile
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
export async function update_profile(req, res) {
  try {
    const update = req.body;
    const {userId} = req;

    if (typeof update !== 'object') {
      res.status(400).json({message: 'Invalid request'});
      return;
    }

    const allowedFields = ['firstName', 'lastName', 'middleName', 'hospitalName', 'phone', 'password', 'specialization'];

    const keys = Object.keys(update);

    if (!keys.length) {
      res.status(400).json({message: 'Update can not be empty'});
      return;
    }

    const containsOnlyValidFields = keys.every(key => allowedFields.includes(key));

    if (!containsOnlyValidFields) {
      res.status(400).json({message: 'Please provide valid update information'});
      return;
    }

    if (Object.prototype.hasOwnProperty.call(update, 'password')) {
      update.password = hashSync(update.password, 10);
    }

    await DOCTOR.updateOne({_id: userId}, update);

    res.status(200).json({message: 'Update successful'});
  } catch (error) {
    handle_error(error, res);
  }
}