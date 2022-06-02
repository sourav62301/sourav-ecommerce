const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a Sample Id",
      url: "ProfilePicURL",
    },
  });

  // const token = user.getJWTToken();
  // res.status(201).json({
  //     success: true,
  //     token,
  // })

  sendToken(user, 201, res);
});

//   Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user have given both email and password
  if (!email || !password) {
    return next(new ErrorHandler("Enter enail & password !!!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password !!!", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password !!!", 401));
  }

  // const token = user.getJWTToken();
  // res.status(200).json({
  //     success: true,
  //     token,
  // });

  sendToken(user, 200, res);
});

//  Logout User

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out SuccessFully..",
  });
});

//  Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password Reset Token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then ignore \n Full Power Ignore..`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Reset !!",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully..`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//  Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token is Invalid or has been expired..!!",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//  Get USER Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//  Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
    return next(new ErrorHandler("Old Password is Incorrect", 400));
  }
  
  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password doesn't match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);

});


//  Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }

  // We will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });

});



//  Get All Users

exports.getAllUsers = catchAsyncErrors(async (req, res, next)=>{
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  })
})



//  Get Single User (Admin)

exports.getSingleUser = catchAsyncErrors(async (req, res, next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User doesn't exist with ID : ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  })
})



//  Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });

});



//  Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`User doesn't exist with ID : ${req.params.id}`));
  }

  await user.remove();

  // We will remove cloudinary later

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully.."
  });

});



