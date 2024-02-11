import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../Models/Admin.js";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();
router.post("/Signup", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (user) {
    return res.status(201).json({ message: "Admin exists" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  const newuser = await Admin.create({
    name,
    email,
    password: hashedpassword,
  });
  await newuser.save();
  return res.status(200).json({ message: "Admin Account Created Success" });
});

router.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (!user) {
    return res.status(202).json({ message: "User not found" });
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) {
      return res.status(204).send("User password incorrect");
    }
    const token = jwt.sign({ id: user.id }, process.env.SECREAT);
   res.json({ userId: user.id, token, message: "Admin Logged in Success" });
});
  });
  router.patch("/Admin",async(req,res)=>{

  })
  
export { router as adminrouter };

export const verifyToken=async(req,res,next)=>{
  const token=req.headers.authorization;
  if(token){
    jwt.verify(token, process.env.SECREAT,async(err,decoded)=>{
      if(err){
        return res.status(404).json({message:"Not Authorized user"})
      }
      const userId=decoded.id;
      try{
          const user=await Admin.findOne({_id:userId});
          if(!user){
          return res.status(401).json({message:"Not Found"});
          }
          req.userId=userId;
          next();
      }
      catch{
          res.status(404).json({message:"someting went wrong"});
      }
    })
  }
}