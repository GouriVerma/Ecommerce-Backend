const Product = require("../models/product");
const ErrorHandler = require("../utils/error");
const handleAsyncError = require("../utils/asyncError");
const ApiFeatures = require("../utils/apiFeature");



const handleGetAllProducts = handleAsyncError(async (req, res, next) => {
    // console.log("entered");
    const productCount=Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(10);
    const products = await apiFeature.query;
    // console.log(products);
    // const products=await Product.find({});
    return res.status(200).json(products);
});

const handleCreateProduct = handleAsyncError(async (req, res, next) => {

    const { name, smallDesc, desc, images, newPrice, oldPrice, discount, category, color, rating, stock, numOfReviews, reviews, gender,brand } = req.body;
    const createdBy=req.user._id;
    const product = await Product.create({ name, smallDesc, desc, images, newPrice, oldPrice, discount, category, color, rating, stock, numOfReviews, reviews, createdBy, gender,brand });
    return res.status(200).json({ success: true, product });
});


const handleGetProduct = handleAsyncError(async (req, res, next) => {
    const _id = req.params.id;
    const product = await Product.findById(_id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    else {
        return res.status(200).json(product);
    }

});


//admin
const handleUpdateProduct = handleAsyncError(async (req, res, next) => {
    const _id = req.params.id;

    const product = await Product.findById(_id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const updatedProduct = await Product.findByIdAndUpdate(_id,
        { $set: req.body }, //modify specific fields of a document without affecting other fields.
        { new: true } //returns the updated
    ).populate("createdBy");


    return res.status(200).json(updatedProduct);

})


const handleDeleteProduct = handleAsyncError(async (req, res, next) => {
    const _id = req.params.id;
    const product = await Product.findById(_id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await Product.deleteOne({ _id });
    return res.status(200).json("Product Deleted Successfully");

})

const handleCreateUpdateReview=handleAsyncError(async (req, res, next) => {
    const _id = req.query?.productId;
    const product = await Product.findById(_id);

    if(!req.user){
        return next(new ErrorHandler("You are not authenticated", 401));
    }
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const {rating,description}=req.body;

    const isReviewed=product.reviews.find((rev)=>rev.createdBy.toString() === req.user._id);

    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.createdBy.toString() === req.user._id){
                rev.rating=Number(rating);
                rev.description=description;
                rev.createdByName=req.user?.userName;
                rev.createdBy=req.user?._id
            }
        })
    }
    else{
        product.reviews.push({rating:Number(rating),description,createdByName:req.user?.userName,
            createdBy:req.user?._id});
        product.numOfReviews=product.reviews.length;
    }

    let avg=0;
    //console.log(product.reviews);
    product.reviews.forEach(rev=>{avg+=rev.rating});
    product.avgRating=avg/product.reviews.length;
    

    await product.save({new:true,validateBeforeSave:false});

    return res.status(200).json(product);
    
    

})

const handleGetAllReviews=handleAsyncError(async(req,res,next)=>{

    const _id = req.query?.productId;
    


    if (!req.query?.productId) {
        return next(new ErrorHandler("Product ID is required", 400));
    }

    const product = await Product.findById(_id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews=product.reviews;
    return res.status(200).json(reviews);

})
const test=async(req,res,next)=>{
    return res.status(200).json("Hi");
}




const handleDeleteReview=handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not authenticated", 401));
    }

    const {productId,id}=req.query;
    
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const foundReview=product.reviews.find((rev)=>rev._id.toString() === id);
    console.log(foundReview);

    if(req.user?.role=="ADMIN" || foundReview.createdBy.toString()===req.user?._id){
        const reviews=product.reviews.filter(rev=>rev!==foundReview);
        console.log(reviews);
        product.reviews=reviews;
        let avg=0;
        product.reviews.forEach(rev=>{avg+=rev.rating});
        product.avgRating=avg/product.reviews.length;
        product.numOfReviews=reviews.length;

        await product.save({new:true,validateBeforeSave:false});

        

        return res.status(200).json(product);
    
    }

    else{
        return res.status(401).json("You are not authorized");
    }
    
    
})

const handleGetReview=handleAsyncError(async(req,res,next)=>{
    const {productId,id}=req.query;

    if(!productId){
        return next(new ErrorHandler("Product ID is required", 400));
    }  

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    
    const foundReview=product.reviews.find((rev)=>rev._id.toString() === id);

    if(!foundReview){
        return next(new ErrorHandler("No review found", 400));
    }

    return res.status(200).json(foundReview);


    
})

module.exports = { handleGetAllProducts, handleCreateProduct, handleUpdateProduct, handleGetProduct, handleDeleteProduct, handleCreateUpdateReview,handleGetAllReviews, handleDeleteReview,handleGetReview }