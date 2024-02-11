import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import dotenv from "dotenv";
import { adminrouter } from "./Routes/AdminRoute.js";
import { ProductRouter } from "./Routes/ProductRoute.js";
import { Billboard } from "./Routes/BillBoardRoute.js";
import { OrderRouter } from "./Routes/OrderRoute.js";

dotenv.config();
try {
  await mongoose.connect(process.env.MONGO_URI);
} catch (error) {
  handleError(error);
}
const app = express();
app.use(Cors());
app.use(express.json());
app.use("/",adminrouter);
app.use("/Product",ProductRouter);
app.use("/Billboard",Billboard)
app.use("/Orders",OrderRouter);
app.listen(process.env.PORT_NUMBER||4001,()=>{
    console.log(`Server is On Fire ${process.env.PORT_NUMBER} ` );
})