
const Razorpay=require('razorpay');
const handleAsyncError = require("../utils/asyncError");
const ErrorHandler=require("../utils/error");
const axios=require('axios');
const uniqid=require('uniqid');
const sha256=require('sha256');

//razorpay instance
// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const checkout=handleAsyncError(async (req,res,next)=>{
//     if(!req.user){
//         return next(new ErrorHandler("You are not authenticated", 401));
//     }
//     const options = {
//         amount: Number(req.body.amount*100),  // amount in the smallest currency  in paise
//         currency: "INR",
       
//     };
//     const order=await instance.orders.create(options);

//     return res.status(200).json(order);

// })

// const paymentVerification=handleAsyncError(async(req,res,next)=>{
    
//     console.log(req.body);

//     return res.status(200).json({success:true,body:req.body});
// })

// const phonepeCheckout=async(req,res)=>{
//     const merchantTransactionId=uniqid();

//     const merchantUserId=123;
//     const payload={
//         merchantId: process.env.MERCHANT_ID,
//         merchantTransactionId: merchantTransactionId,
//         merchantUserId: merchantUserId,
//         amount: 10000,
//         redirectUrl:`http://localhost:5173/payment-status/${merchantTransactionId}`,
//         redirectMode:"REDIRECT",
//         mobileNumber: "9999999999",
//         paymentInstrument: {
//           type: "PAY_PAGE",
          
//         }
//       }
      
//       //SHA256(base64 encoded payload + “/pg/v1/pay” + salt key) + ### + salt index
//       const bufferObj=Buffer.from(JSON.stringify(payload),"utf8");
      
//       const encodedPayload=bufferObj.toString("base64");
//       const xVerify=sha256(encodedPayload+process.env.PHONE_PE_ENDPOINT+process.env.SALT_KEY)+'###'+process.env.SALT_INDEX;
      
//     const options = {
//         method: 'post',
//         url: `${process.env.PHONE_PE_HOST_URL}${process.env.PHONE_PE_ENDPOINT}`,
//         headers: {
//                 accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VERIFY':xVerify,
//                 'Retry-After':120
//                 },
//         data: {
//             'request':encodedPayload

//         }
//     };
//     axios
//     .request(options)
//         .then(function (response) {
//         console.log(response.data);
//         return res.send(response.data)
//     })
//     .catch(function (error) {
//         return res.json(error)
//     });
// }

module.exports={phonepeCheckout}

// module.exports={checkout,paymentVerification};