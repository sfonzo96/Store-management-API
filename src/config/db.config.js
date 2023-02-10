import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log('✅ Conection to DB established');
    }
});
