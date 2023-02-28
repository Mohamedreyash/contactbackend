const express=require('express');
const bodyParser=require("body-parser");
const app=express();
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const contactModel=require('./models/schema');
dotenv.config();
app.use(bodyParser.json());
mongoose.set("strictQuery",false);
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true},()=>{
    console.log("connected to db");
    app.listen(5000,()=>console.log("server running"))
});
app.set("view engine","ejs");

app.get('/v1/contacts',async(req,res)=>{
    try{
        const newContact=await contactModel.find({userID: req.user });
        res.status(201).json(newContact)
    }catch(err){
        res.status(404).json({
            message:err.message
        })
    }
})
app.get("/v1/contacts/:id", async (req, res) => {
    try{
        const Contact = await contactModel.findOne({_id: req.params.id });
        if(Contact._id){
        return res.json({
            status:"Success",
            Contact
        })
        }
        else{
            res.status(404).json({
                status:"failed",
                message:"user does not exists"
            })
        }
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});
app.put("/v1/contacts/:id", async (req, res) => {
    try{
        const Contact = await contactModel.updateOne(
            {_id: req.body.id},
            { $set: req.body} 
            );
        return res.json({
            status:"Updated",
            Contact
        })
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});

app.post('/v1/contacts',async(req,res)=>{
    const data=req.body;
    try{
        console.log(req.body);
       const Contact= await contactModel.create({
            userID:req.user,
            firstName:data.firstName,
            lastName:data.lastName,
            email:data.email,
            phone:data.phone
        })
        if(data){
        res.status(201).json({
              data
        })}else if(!data){
            "Missing required field"
        }
    }catch(err){
        res.status(404).json({
            message:err.message
        })
    }
})

app.delete("/v1/contacts/:id", async (req, res) => {
    try{
        const Contact = await contactModel.findOne({_id: req.params.id });
        const deleteContact=await contactModel.deleteOne({_id:req.params.id})
        return res.json({
            status:"deleted",
            Contact
        })
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});