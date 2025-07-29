import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const applicationSchema = new mongoose.Schema({
  firstName: String,
  surName: String,
  age: Number,
  gender: String,
  mobileNumber: String,
  countryCode: String,
  college: String,
  address: String,
  pinCode: String,
  district: String,
  state: String,
  fatherName: String,
  motherName: String,
  degree: String,
  selectedCourse: String,
  marks: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);


router.post('/', async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();

    res.status(201).json({
      success: true,
      applicationId: newApp._id,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
