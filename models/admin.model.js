import { hashSync } from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
const {isEmail} = validator;

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    unique: true,
    validator: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  lastLoginDate: {
    type: Date,
    default: Date.now(),
  },
  activeStatus: {
    type: Boolean,
    default: true
  },
}, {timestamps: true});

adminSchema.pre('save', function(next) {
  this.password = hashSync(this.password, 10);

  next();
})

const ADMIN = mongoose.model('admin', adminSchema);

export default ADMIN;