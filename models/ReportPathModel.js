import mongoose from "mongoose";

// Local MongoDB connection string
const localDB = "mongodb://trak24-dev:Trak24Bezoftwares@148.113.44.181:24724/trak24";

// Create a separate connection for local DB
const localConnection = mongoose.createConnection(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const reportPathSchema = new mongoose.Schema({
  imei: {
    type: String,
  },
  travelid: {
    type: String
  },
  history: [
    {
      latitude: {
        type: Number,
      },
      latiD: {
        type: String,
      },
      longitude: {
        type: Number,
      },
      longiD: {
        type: String,
      },
    }
  ],
});

// Create model using the local connection
const ReportPath = localConnection.model("ReportPath", reportPathSchema);

export default ReportPath;
