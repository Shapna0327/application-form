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
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    let query;

    if (trimmedIdentifier.includes('@')) {
      query = { email: trimmedIdentifier.toLowerCase() };
    } else {

      query = { mobileNumber: trimmedIdentifier };
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password.trim() !== trimmedPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      userId: user._id,
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
