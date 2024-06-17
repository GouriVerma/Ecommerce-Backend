const ErrorHandler=require("../utils/error");

function handleError(err,req,res,next){
    //2 properties of our error
    err.statusCode=err.statusCode || 500
    err.message=err.message || "Internal Server Error"

    //Wrong MongoDB Id error
    if(err.name==="CastError"){
        const message=`Resource not found ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    //Mongoose duplicate error
    if(err.code===11000){
        const message= `${Object.keys(err.keyValue)} already exists`
        err=new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({error:err.message});
}

module.exports=handleError