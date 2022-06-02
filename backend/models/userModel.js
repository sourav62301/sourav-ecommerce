const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Your Name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [3, "Name should have atleast 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Enter Your Password"],
    minlength: [8, "Password should be atleast 8 characters long"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
  role:{
      type:String,
      default: "user"
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,
});


userSchema.pre("save", async function(next){

  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})



//   JWT Token
userSchema.methods.getJWTToken = function (){
  return jwt.sign({id: this._id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE,
  })
}



// Comapre Passwords
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}


//  Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){

  // Genertaing Token 
  const resetToken = crypto.randomBytes(20).toString("hex");


  // Hashing and Adding to User Schema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 15*60*1000;

  return resetToken;


}


module.exports = mongoose.model("user", userSchema);