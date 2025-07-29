import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();


const UserSchema = new mongoose.Schema({
  firstName: String,
  surName: String,
  email: { type: String, unique: true },
  mobileNumber: { type: String, unique: true },
  password: String,
  college: String,
  district: String,
  state: String,
  age: Number,
  gender: String,
});


const User = mongoose.models.User || mongoose.model('User', UserSchema);


router.post('/submit', async (req, res) => {
  try {
    const {
      firstName,
      surName,
      email,
      mobileNumber,
      password,
      college,
      district,
      state,
      age,
      gender,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
  const rawMobile = mobileNumber.replace(/^\+\d{1,4}/, '');


    const newUser = new User({
      firstName,
      surName,
      email,
      mobileNumber: String ,
      password,
      college,
      district,
      state,
      age,
      gender,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Signup successful',
      userId: savedUser._id,
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

export default router;
