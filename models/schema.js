const mongoose=require("mongoose");
const contactSchema=new mongoose.Schema({
    userID: { type:String, ref: "Users" },
    firstName:{type:String},
    lastName:{type:String},
    email:{type:String},
    phone:{type:Number}
});

const contactModel=new mongoose.model("contacts",contactSchema);
module.exports=contactModel;