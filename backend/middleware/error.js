const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Inter Server Error"


    // Wrong MongoDb ID Error
    if(err.name === "CastError"){
        const message = `Resource Not Found.  Invalid : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }


    // Mongoose Duplicate Key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    
    
    // Wrong JWT error
    if(err.code === "JsonWebTokenError"){
        const message = `Json Web Token is Invalid, try again !!`;
        err = new ErrorHandler(message, 400);
    }
    
    
    // JWT EXPIRE Error
    if(err.code === "TokenExpiredError"){
        const message = `Json Web Token is Expired, try again !!`;
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message
        // error: err.stack
    })

}