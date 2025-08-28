/*
 * Authentication Controller for Bioinformatics MERN Application
 * 
 * Handles user authentication operations including registration, login, and profile retrieval.
 * Uses JWT (JSON Web Tokens) for stateless authentication and session management.
 * 
 * Key Features:
 * - User registration with duplicate checking (email/username)
 * - Secure login with password validation
 * - JWT token generation with configurable expiration
 * - Current user profile retrieval for authenticated requests
 * 
 * Security Notes:
 * - Passwords are hashed using the User model's comparePassword method
 * - JWT tokens are signed with environment-configured secrets
 * - Generic error messages prevent user enumeration attacks
 * 
 * Dependencies:
 * - User model for database operations
 * - jsonwebtoken library for token management
 * - Environment variables: JWT_SECRET, JWT_EXPIRE
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
};

module.exports = { register, login, getMe };