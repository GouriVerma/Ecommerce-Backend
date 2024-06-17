const {Router}=require("express");
const {restrictTo}=require("../middleware/auth");

const {handleGetAllProducts, handleCreateProduct,handleUpdateProduct,handleGetProduct,handleDeleteProduct, handleCreateUpdateReview, handleGetAllReviews, handleDeleteReview, handleGetReview}=require("../controllers/product");

const router=Router();

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

router.get("/:id",handleGetProduct);








module.exports=router;


