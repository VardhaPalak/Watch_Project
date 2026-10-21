import mongoose from "mongoose";
import env from "../config/env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`[db] connected to ${env.mongoUri.replace(/\/\/.*@/, "//***@")}`);
  return mongoose.connection;
}

export default connectDatabase;
