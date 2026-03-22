import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Mongo connected");
  } catch (error) {
    console.error("Mongo connection failed", error);
    process.exit(1);
  }
};
