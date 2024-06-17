const {Router}=require("express");
const {handleUserSignUp,handleUserLogIn,handleRefresh,handleLogout, handleForgotPassword,handleResetPassword}=require("../controllers/auth");


const router=Router();

router.post("/signup",handleUserSignUp);
router.post("/login",handleUserLogIn);
router.put("/refresh",handleRefresh);
router.post("/logout",handleLogout);
router.post("/password/forgot",handleForgotPassword);
router.put("/password/reset/:token",handleResetPassword);






module.exports=router;