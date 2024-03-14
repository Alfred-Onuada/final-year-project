import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  inference: {
    type: String,
    required: [true, 'Please specify a prediction inference'],
    enum: {
      values: ['glioma','no tumor','meningioma','pituitary'],
      message: 'Please specify a valid prediction inference'
    }
  },
  confidenceScore: {
    type: Number,
    required: [true, 'Please provide a valid confidence score'],
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors',
    required: [true, 'Please provide a valid doctor ID'],
  }
}, {timestamps: true});

const PREDICTION = mongoose.model('prediction', predictionSchema);

export default PREDICTION;
