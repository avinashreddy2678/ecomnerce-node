import express from "express";
import Admin from "../Models/Admin.js";
import BillboardModel from "../Models/Billboard.js";
import { verifyToken } from "./AdminRoute.js";

const router = express.Router();

router.get("/GetBillboard/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const user = await Admin.findOne({ _id: userId });
  if (user) {
    return res
      .status(200)
      .json({ message: "got the billboard", data: user.Billboard });
  }
  res.status(404).json({ message: "Somethign went wrong" });
});
router.post("/Create", verifyToken, async (req, res) => {
  try {
    const { userId, BillboardImage, BillboardTag } = req.body;
    const user = await Admin.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "No Admin Found" });
    }

    const newBillboard = new BillboardModel({
      BillboardImage,
      BillboardTag,
      CreatedAt: Date.now(),
      isActivated: user.Billboard.length === 0 ? true : false,
    });

    user.Billboard.push(newBillboard);
    await user.save();
    // await Promise.all([user.save(), newBillboard.save()]);

    res.json({ message: "Successfully added", billboardId: newBillboard._id });
  } catch (error) {
    console.error("Error creating billboard:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/Update/:billboardid", verifyToken, async (req, res) => {
  try {
    const { billboardid } = req.params;
    const { userId, BillboardTag, BillboardImage } = req.body;
    // console.log(BillboardImage,BillboardTag)
    const user = await Admin.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "No Admin Found" });
    }

    const userBillboard = user.Billboard.find(
      (item) => String(item._id) === billboardid
    );
    if (!userBillboard) {
      return res.status(400).json({
        message:
          "Provided billboardid does not match the existing billboard _id",
      });
    }

    if (!BillboardImage && BillboardTag) {
      userBillboard.BillboardTag = BillboardTag;
    } else if (BillboardImage && !BillboardTag) {
      userBillboard.BillboardImage = BillboardImage;
    } else if (BillboardImage && BillboardTag) {
      userBillboard.BillboardTag = BillboardTag;
      userBillboard.BillboardImage = BillboardImage;
    } else {
      return res.json({ message: "No changes provided" });
    }

    user.markModified("Billboard");

    await user.save();
    res.json({ message: "Update successful" });
  } catch (error) {
    console.error("Error updating billboard:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch(
  "/ChangeActivation/:changedProductId",
  verifyToken,
  async (req, res) => {
    const { changedProductId } = req.params;
    const { userId } = req.body;
    const user = await Admin.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "No Admin Found" });
    }
    const activatedBillboard = user.Billboard.find(
      (billboard) => billboard.isActivated
    );
    if (!activatedBillboard) {
      user.Billboard[0].isActivated = true;
      user.markModified("Billboard");
      await user.save();
      return res
        .status(200)
        .json({ message: "No Active is found so changed to first one" });
    }

    activatedBillboard.isActivated = false;

    const userBillboard = user.Billboard.find(
      (item) => String(item._id) === changedProductId
    );
    userBillboard.isActivated = true;
    user.markModified("Billboard");
    await user.save();
    return res
      .status(200)
      .json({ message: "Successfully changed the active billboard" });
  }
);

router.delete("/deleteBillboard/:billboardId", async (req, res) => {
  const { billboardId } = req.params;
  const { userId } = req.body;
  const user = await Admin.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ message: "No Admin Found" });
  }
  const AfterRemoved = user.Billboard.filter(
    (item) => String(item._id) !== billboardId
  );
  user.Billboard = AfterRemoved;
  user.markModified("Billboard");
  await user.save();
  // console.log(user)
  return res.status(200).json({ message: "successfully Deleted BillBoard" });
});

export { router as Billboard };
