import mongoose from "mongoose";
const AdminSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    image:{
        type:String
    },
    password:{
        type:String,
        require:true
    },

    Products:[{
            type:mongoose.Schema.Types.Mixed,
            ref:'Product'
    }],
    Order:[{
        type:mongoose.Schema.Types.Mixed,
        ref:"Order"
    }],
    Billboard:[{
        type:mongoose.Schema.Types.Mixed,
        ref:"Billboard"
    }]
})
const Admin=mongoose.model("Admin",AdminSchema);
export default Admin;