import mongoose from "mongoose";

const mongoURI = "mongodb+srv://storgewebsolutions:pbRJ8Jb1vnWKJw9F@storge.n4ggj.mongodb.net/Trak-rec";

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
