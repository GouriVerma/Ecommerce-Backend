
//anonymous function which takes input as handlAsyncError as parameter which is a function and returns a function which takes req,res,next as parameter and implement handleAsyncError on req,res,next catches any errors that occur in the asynchronous function and passes them to next which is handles by Error Handler
module.exports= (handleAsyncError)=>(req,res,next)=>{
    Promise.resolve(handleAsyncError(req,res,next)).catch(next);
}

// module.exports=handleAsyncError