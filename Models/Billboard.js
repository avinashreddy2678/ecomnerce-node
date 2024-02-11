import mongoose from "mongoose";
const BillboardSchema=mongoose.Schema({
    BillboardTag:{
        type:String,
    },
    BillboardImage:{
        type:String
    },
    CreatedAt:{
        type:Date
    },
    isActivated:{
        type:Boolean
    }
})
const BillboardModel=mongoose.model("Billboard",BillboardSchema);
export default BillboardModel;