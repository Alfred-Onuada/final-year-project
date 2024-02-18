import { hashSync } from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
const { isEmail, isMobilePhone } = validator;

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    lowercase: true,
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    lowercase: true,
    trim: true
  },
  middleName: {
    type: String,
    lowercase: true,
    trim: true
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required'],
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
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validator: [isMobilePhone('en-NG'), 'Please enter a valid nigerian phone number (+234)'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    default: 'regular',
    lowercase: true,
    trim: true,
    enum: {
      values: ['regular', 'raintainer'],
      message: 'Please specify a valid role value',
    }
  },
  specialization: {
    type: [String],
    required: [true, 'Please provide at least 1 specialization'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value) {
        // Check if the array contains at least one element
        return value.length > 0;
      },
      message: 'Please provide at least 1 specialization'
    },
  }
}, {timestamps: true});

doctorSchema.pre('save', function(next) {
  this.password = hashSync(this.password, 10);

  next();
})

const DOCTOR = mongoose.model('doctor', doctorSchema);

export default DOCTOR;