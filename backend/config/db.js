const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not set. Add it to backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected → ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
