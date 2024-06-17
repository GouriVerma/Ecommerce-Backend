const {Schema, model}=require("mongoose");
const validator=require("validator");

const orderSchema=new Schema({
    shippingDetails:{
        houseAddress:{
            type:String,
            required:[true,"Please Enter houseAddress"]
        },
        areaAddress:{
            type:String,
            required:[true,"Please Enter areaAddress"] 
        },
        city:{
            type:String,
            required:[true,"Please Enter city"]
        },
        pinCode:{
            type:Number,
            required:[true,"Please Enter pincode"]
        },
        state:{
            type:String,
            required:[true,"Please Enter State"]
        },
        country:{
            type:String,
            required:[true,"Please Enter Country"]
        },
        name:{
            type:String,
            required:[true,"Please Enter name"]
        },
        email:{
            type:String,
            required:[true,"Please Enter email"],
            validate:[validator.isEmail,"Please enter a valid email"]
        },
        phone:{
            type:Number,
            required:[true,"Please Enter Phone no"]
        }
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true,
            },
            newPrice:{
                type:Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            },
            image:{
                type:String,
                required:true,
            },
            size:{
                type:String,
                enum:["XS","S","M","L","XL","XXL"],
                required:true,
            },
            product:{
                type:Schema.Types.ObjectId,
                ref:"product",
                required:true,
            }
        }
    ],
    user:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    // paymentInfo:{
    //     id:{
    //         type:String,
    //         required:true,
    //     },
    //     status:{
    //         type:String,
    //         required:true,
    //     },
    //     paidAt:{
    //         type:Date,
            
    //     }

    // },

    priceDetails:{
        totalMRP:{
            type:Number,
            required:true,
            default:0
        },
        shippingFee:{
            type:Number,
            required:true,
            default:0
        },
       
        discountOnMRP:{
            type:Number,
            required:true,
            default:0
        },
        totalAmount:{
            type:Number,
            required:true,
            default:0
        },



    },
    orderStatus:{
        type:String,
        required:true,
        default:"Order Placed",
        enum:["Order Placed","Shipped","Arrived"]
    },

    deliveredAt:{
        type:Date
    },



},{timestamps:true})

const Order=model("order",orderSchema);

module.exports=Order;






