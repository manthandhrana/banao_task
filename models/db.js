const mongoose = require("mongoose")
const validator = require("validator")
require('dotenv').config()
const mongoURI = process.env.MongoURI || "mongodb://localhost:27017/studentdata"

mongoose.connect(mongoURI).then(()=>{
    console.log("mongoDB connected")
}).catch(()=>{
    console.log("no connection")
})

const studentSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:[true,"Username Already Exists"]
    },
    email:{
        type:String,
        require:true,
        unique:[true,"Email Already Exists"],
        validator(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid Email")
            }
        }
    },
    password:{
        type:String,
        require:true
    }
});

const student = new mongoose.model("student", studentSchema)

module.exports = student;
