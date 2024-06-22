const {Router}=require("express");
const {restrictTo}=require("../middleware/auth");
const multer=require("multer");



const {handleGetAllProducts, handleCreateProduct,handleUpdateProduct,handleGetProduct,handleDeleteProduct, handleCreateUpdateReview, handleGetAllReviews, handleDeleteReview, handleGetReview, uploadReviewImages, uploadProductImage}=require("../controllers/product");

const router=Router();

// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         return cb(null,'public/uploads') //name of folder if error came null else /public/uploads
//     },
//     filename:function(req,file,cb){

//         return cb(null,Date.now()+file.originalname);
//     }
// })

// const upload = multer({storage:storage});

const storage=multer.diskStorage({});
const upload=multer({storage:storage,limits:{fileSize:500000}});

router.get("/",handleGetAllProducts);

router.post("/admin/new",restrictTo(["ADMIN"]),handleCreateProduct);

router.route("/admin/:id")
.put(restrictTo(["ADMIN"]),handleUpdateProduct)
.delete(restrictTo(["ADMIN"]),handleDeleteProduct);

router.get("/reviews",handleGetAllReviews);

router.route("/review")
.get(handleGetReview)
.post(handleCreateUpdateReview)
.delete(handleDeleteReview);

// router.post("/review/upload",upload.array('files'),(req,res)=>{
//     console.log("file",req.file || req.files); //req.file for single and req.files for array
    
//     return res.json("Successful");
// })
router.post("/review/upload",upload.array('files'),uploadReviewImages);

router.post("/upload/:id",restrictTo(["ADMIN"]),upload.array('files'),uploadProductImage);

router.get("/:id",handleGetProduct);








module.exports=router;


