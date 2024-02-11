import mongoose from "mongoose";
const SizeQuantitySchema = new mongoose.Schema({
  size: {
    type: String,
  },
  quantity: {
    type: Number,  
  },
});
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  Type: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  size: [{
    type:SizeQuantitySchema
  }],
  productImage: [
    {
      type: String,
    },
  ],
  price: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  
});
const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
