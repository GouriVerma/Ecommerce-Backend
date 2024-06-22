const User=require("../models/user");
const handleAsyncError=require("../utils/asyncError");
const ErrorHandler = require("../utils/error");
const {uploadFile} =require("../utils/uploadFile");


const uploadProfileImage=handleAsyncError(async(req,res,next)=>{
    
    if(!req.user){
        return next(new ErrorHandler("You are not authenticated", 401));
    }

    
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    const file=req.file;
    const upload = await uploadFile(file.path);
    user.profileUrl.public_id=upload.public_id;
    user.profileUrl.url=upload.url;
    
    user.save({validateBeforeSave:false});

    return res.status(200).json(user);
    
});


const handleGetUser=handleAsyncError(async (req, res, next) => {
    const _id = req.params.id;

    if(!req.user){
        return next(new ErrorHandler("You are not logged in", 401));
    }
    if(_id!==req.user._id){
        return next(new ErrorHandler("You are not authorised", 403));
    }

    const user = await User.findById(_id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    else {
        return res.status(200).json(user);
    }

});

const handleUpdateUser=handleAsyncError(async (req, res, next) => {
    const _id = req.params.id;
    console.log(_id);

    if(!req.user){
        return next(new ErrorHandler("You are not logged in", 401));
    }

    if(req.user._id !==_id){
        return next(new ErrorHandler("You can update only your details", 403));
    }


    const user = await User.findById(_id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }   

    const updatedUser = await User.findByIdAndUpdate(_id,
        { $set: req.body }, //modify specific fields of a document without affecting other fields.
        { new: true } //returns the updated
    );


    return res.status(200).json(updatedUser);

})

const handleDeleteUser=handleAsyncError(async (req, res, next) => {
    const _id = req.params.id;
    const user = await User.findById(_id);
    
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    await User.deleteOne({ _id });
    
    return res.status(200).json({msg:"User Deleted Successfully"});

})

const handleGetAllUsers=handleAsyncError(async (req, res, next) => {
    // console.log("entered");
    
    const users = await User.find({});
    return res.status(200).json(users);
});

const handleGetUserByAdmin=handleAsyncError(async (req,res,next)=>{
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    else {
        return res.status(200).json(user);
    }
})

const handleUpdateUserRoleByAdmin=handleAsyncError(async (req,res,next)=>{
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const updatedUser = await User.findByIdAndUpdate(_id,
        { $set: req.body }, //modify specific fields of a document without affecting other fields.
        { new: true } //returns the updated
    );


    return res.status(200).json(updatedUser);
})

const handleDeleteUserByAdmin=handleAsyncError(async (req,res,next)=>{
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    await User.deleteOne({ _id });
    const userCount=await User.countDocuments();
    return res.status(200).json({msg:"User Deleted Successfully",userCount});
})









module.exports={uploadProfileImage,handleGetUser,handleUpdateUser,handleDeleteUser,handleGetAllUsers,handleGetUserByAdmin,handleUpdateUserRoleByAdmin,handleDeleteUserByAdmin}