/*
 * Database Configuration Module
 * 
 * This module handles the MongoDB database connection setup for the bioinformatics web application.
 * It establishes a connection to MongoDB using Mongoose ODM (Object Document Mapper) and provides
 * centralized database connection management for the MERN stack backend.
 * 
 * Key Features:
 * - Asynchronous connection handling with proper error management
 * - Environment-based configuration using MONGODB_URI from .env file
 * - Graceful error handling with process termination on connection failure
 * - Connection status logging for debugging and monitoring
 * 
 * Usage: Import and call this function in your main server file (typically app.js or server.js)
 * to establish the database connection before starting the Express server.
 * 
 * Dependencies:
 * - mongoose: MongoDB object modeling library
 * - Environment variable: MONGODB_URI (connection string)
 */


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;