import mongoose from "mongoose";
const Orderschema = new mongoose.Schema({
  productid: {
    type: mongoose.Schema.Types.String,
    ref: "Product",
  },
  isOrdered: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});
const Order = mongoose.model("Order", Orderschema);
export default Order;
