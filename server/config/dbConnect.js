import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
    try {
       const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected: ${conn.connection.name}`);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
    }
};

export default dbConnect;
