import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

// authRouter.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ message: 'Please provide username, email, and password' });
//   }

//   try {
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save new user
//     const user = new User({ username, email, password: hashedPassword });
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });


export const ClientLogin= async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with 1 hour expiry
    const token = jwt.sign(
      { userId: user._id },
      'TR24-PWRD-STRE', // Replace with process.env.SECRET_KEY for security
      { expiresIn: '1h' } // Set token expiration to 1 hour
    );

    res.status(200).json({ message: 'Login successful', token, data:{userId:user._id,firstname:user.firstname,company:user.company,webp:user.permissions.weblogin} });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error', error });
  }
};

export const ClientAppLogin= async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token without expiration
    const token = jwt.sign({ userId: user._id }, 'SECRET_KEY'); 

    res.status(200).json({ message: 'Login successful', token,data:{id:user._id,firstname:user.firstname,company:user.company,app:user.permissions.applogin} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


