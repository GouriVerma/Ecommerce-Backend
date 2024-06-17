const {Router}=require("express");
const {handleGetUser,handleUpdateUser,handleDeleteUser,handleGetAllUsers,handleGetUserByAdmin,handleDeleteUserByAdmin,handleUpdateUserRoleByAdmin}=require("../controllers/user");
const {restrictTo}=require("../middleware/auth");
const { handleAddToCart, handleDeleteFromCart, handleUpdateItemInCart, handleGetAllCartItems,handleDeleteCartItems } = require("../controllers/cart");
const {handleGetMyAllAddresses,handleAddNewAddress,handleUpdateAddress,handleDeleteAddress}=require("../controllers/address")

const router=Router();

router.get("/admin",restrictTo(["ADMIN"]),handleGetAllUsers); //only to admin
router.route("/admin/:id")
.get(restrictTo(["ADMIN"]),handleGetUserByAdmin) //only to admin
.put(restrictTo(["ADMIN"]),handleUpdateUserRoleByAdmin) //only to admin
.delete(restrictTo(["ADMIN"]),handleDeleteUserByAdmin); //only to admin

router.delete("/cart/delete",handleDeleteCartItems)

router.route("/cart/:id")
.get(handleGetAllCartItems)
.post(handleAddToCart)
.delete(handleDeleteFromCart)
.put(handleUpdateItemInCart);




router.route("/address/:id")
.get(handleGetMyAllAddresses)
.post(handleAddNewAddress)
.delete(handleDeleteAddress)
.put(handleUpdateAddress);

router.route("/:id")
.get(handleGetUser)
.put(handleUpdateUser)
.delete(handleDeleteUser); 









module.exports=router;