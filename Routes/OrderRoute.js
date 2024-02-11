import express, { response } from "express";
import Admin from "../Models/Admin.js";
import Order from "../Models/Order.js";
import Razorpay from "razorpay";

const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API__KEY,
  key_secret: process.env.RAZORPAY_SECREAT_KEY,
});

router.get("/getKey", async (req, res) => {
  return res.json({ key_secret: process.env.RAZORPAY_API__KEY });
});

router.post("/payment/checkout", async (req, res) => {
  const { amount, name, products, pincode, fulladdress, phonenumber } =
    req.body;
    console.log(products)
    const firstUser = await Admin.findOne();
    const neworder = await new Order({ name, amount, product:products, pincode, fulladdress, phonenumber });
    firstUser.Order.push(neworder);
    firstUser.markModified("Order");
    await firstUser.save();
  var options = {
    amount:amount*100,
    currency: "INR",
  };
  const orders = await instance.orders.create(options);
  return res.json({ messages: "success", orders,firstUser });
});

router.post("/paymentverifcation", async (req, res) => {
  return res.redirect("https://ecommerce-admin-gwx2.vercel.app/cart");
});

router.get("/CheckAvailbility/:productid/:size", async (req, res) => {
  try {
    const firstUser = await Admin.findOne();
    const { productid, size } = req.params;
    const Product = firstUser.Products.filter(
      (item) => String(item._id) === productid
    );
    if (!Product) {
      return res.json({ message: "Not Available" });
    }
    const requestedSize = Product[0].size.find((item) => item.size === size);
    if (!requestedSize || requestedSize.quantity === 0) {
      return res.json({
        message: `Size ${size} not available or quantity is 0`,
      });
    }
    requestedSize.quantity--;
    firstUser.markModified("Products");
    await firstUser.save();

    return res.json({ message: "Available", data: Product });
  } catch (error) {
    res.status(500).json({ message: "Interna fdal Server Error" });
  }
});
router.get("/CheckInOrder/:productid/:size", async (req, res) => {
  try {
    const firstUser = await Admin.findOne();
    const { productid, size } = req.params;
    const ProductCheckinOrder = await Order.findOne({ productid });
    if (!ProductCheckinOrder) {
      const Product = firstUser.Products.find(
        (item) => String(item._id) === productid
      );
      const changeQuantityOfProduct = Product.size.find(
        (item) => item.size === size
      );
      changeQuantityOfProduct.quantity++;
      firstUser.markModified("Products");
      await firstUser.save();
      return res.json({ message: "Remove" });
    }
    res.json({ message: "Ordered" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export { router as OrderRouter };
