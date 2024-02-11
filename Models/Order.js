import mongoose from "mongoose";
const Orderschema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed,
    ref: "Product",
  },
  amount: {
      type:Number
  },
  name:{
    type:String,
  }
  ,
  pincode:{
    type:String,
  },
  fulladdress:{
    type:String,
  },
  phonenumber:{
    type:String,
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});
const Order = mongoose.model("Order", Orderschema);
export default Order;
