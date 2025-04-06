import mongoose from "mongoose";

// Local MongoDB connection string
const localDB = "mongodb://trak24-dev:Trak24Bezoftwares@148.113.44.181:24724/trak24";

// Create a separate connection for local DB
const localConnection = mongoose.createConnection(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const staticMediaSchema = new mongoose.Schema({
  file: {
    type: String,
  },
  time: {
    type: Date
  },
});

// Create model using the local connection
const StaticMedia = localConnection.model("StaticMedia", staticMediaSchema);

export default StaticMedia;
