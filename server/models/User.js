const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords securely

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,    // Must be provided
    unique: true,      // No two users can have the same username
    trim: true,        // Removes leading/trailing spaces
    minlength: 3,      // Minimum length for validation
    maxlength: 30      // Maximum length for validation
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true    // Convert email to lowercase for consistency
  },
  password: {
    type: String,
    required: true,
    minlength: 6       // Minimum length for security
  }
}, {
  timestamps: true     // Adds createdAt and updatedAt automatically
});

// Pre-save middleware to hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash password if it is new or modified
  if (!this.isModified('password')) return next();

  // Hash the password with 12 salt rounds
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare candidate password with stored hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);
