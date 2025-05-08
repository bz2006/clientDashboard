import mongoose from "mongoose";

// Local MongoDB connection string
const localDB = "mongodb://trak24-dev:Trak24Bezoftwares@148.113.44.181:24724/trak24";

// Create a separate connection for local DB
const localConnection = mongoose.createConnection(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const CordinateAdrsModel = new mongoose.Schema({
  lat: {
    type: String,
  },
  lon: {
    type: String
  },
  address: {
    type: String
  },
  lastFetched: {
    type: Date
  },
});

// Create model using the local connection
const CordinateAdress = localConnection.model("CordinateAdress", CordinateAdrsModel);

export default CordinateAdress;
