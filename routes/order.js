const {Router}=require("express");
const {restrictTo}=require("../middleware/auth");
const {handlePlaceOrder,handleGetOrder,handleGetMyAllOrders,updateOrderStatus, handleDeleteOrder,handleGetAllOrders}=require("../controllers/order");

const router=Router();

router.post("/new",handlePlaceOrder);
router.get("/my-orders",handleGetMyAllOrders);
router.get("/admin",restrictTo("ADMIN"),handleGetAllOrders);
router.get("/:id",handleGetOrder);
router.route("/admin/:id")
.put(restrictTo("ADMIN"),updateOrderStatus)
.delete(restrictTo("ADMIN"),handleDeleteOrder);




module.exports=router;