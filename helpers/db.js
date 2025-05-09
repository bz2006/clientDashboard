import mongoose from "mongoose";

const mongoURI = "mongodb://trak24-dev:Trak24Bezoftwares@148.113.44.181:24724/trak24";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");

    // Listen for disconnection and attempt to reconnect
    mongoose.connection.on("disconnected", () => {
      console.error("MongoDB disconnected! Trying to reconnect...");
      connectToDatabase(); // Reconnect
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected!");
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
  }
};



export default mongoose.connection;
