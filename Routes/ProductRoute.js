import express from "express";
import Admin from "../Models/Admin.js";
import ProductModel from "../Models/Product.js";
import { verifyToken } from "./AdminRoute.js";

const router = express.Router();


router.get("/AllProducts", async (req, res) => {
  try {
    const firstUser = await Admin.findOne();
    const activeBillboards = firstUser.Billboard.filter(billboard => billboard.isActivated);
   return res.json({Products:firstUser.Products,BillBoard:activeBillboards});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/Allproducts/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  // console.log(userId)
  const user = await Admin.findOne({ _id: userId });
  if (user) {
    // console.log(user.Products)
    return res
      .status(200)
      .json({ message: "got all products", data: user.Products });
  }
  res.status(404).json({ message: "sometihgn went wrong" });
});

router.post("/AddProduct", verifyToken, async (req, res) => {
  const {
    userId,
    ProductName,
    Type,
    color,
    price,
    imageurl,
    AllSizeandQuantity,
  } = req.body;
  // console.log("dae")
  const user = await Admin.findOne({ _id: userId });
  if (!user) {
    return res.json({ message: "No Admin Found" });
  }
  const product = new ProductModel({
    name:ProductName,
    Type,
    color,
    price,
    productImage:imageurl,
    size:AllSizeandQuantity,
  });
  user.Products.push(product);
  //   await product.save();
  await user.save();
  res.json({ message: "successfully added" });
});

// update the product by product id

router.patch("/UpdateProduct/:productid", verifyToken, async (req, res) => {
  try {
    const { productid } = req.params;
    const {
      userId,
      ProductName,
      Type,
      color,
      price,
      imageurl,
      AllSizeandQuantity,
    } = req.body;
    const user = await Admin.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "No Admin Found" });
    }

    const Allproducts = user.Products;
    const ProductToModify = Allproducts.find(
      (item) => String(item._id) === productid
    );

    if (!ProductToModify) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update properties only if they are provided in the request body
    if (ProductName) ProductToModify.name = ProductName;
    if (Type) ProductToModify.Type = Type;
    if (color) ProductToModify.color = color;
    // if (quantity) ProductToModify.quantity = quantity;
    if (price) ProductToModify.price = price;
    if (imageurl) ProductToModify.productImage = imageurl;
    if (AllSizeandQuantity) ProductToModify.size = AllSizeandQuantity;
    user.markModified("Products");
    await user.save();

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// deleting a product
router.delete("/DeleteProduct/:productid", verifyToken, async (req, res) => {
  const { productid } = req.params;
  const { userId } = req.body;
  const user = await Admin.findOne({ _id: userId });
  // console.log(user);
  if (!user) {
    return res.status(404).json({ message: "No Admin Found" });
  }
  const Allproducts = user.Products;
  const FilterProducts = Allproducts.filter(
    (item) => String(item._id) !== productid
  );
  if (Allproducts.length === FilterProducts.length) {
    return res.json({ message: "No product Found" });
  }
  user.Products = FilterProducts;
  user.markModified("Products");
  await user.save();
  res.json({ message: "Product deleted successfully" });
});
export { router as ProductRouter };
