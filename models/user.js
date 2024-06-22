const {Schema, model}=require("mongoose");
const crypto=require("crypto");
const validator=require("validator");
const { timeStamp } = require("console");
const { createAccessToken, createRefreshToken } = require("../service/auth");
const ErrorHandler = require("../utils/error");

const userSchema=Schema({
    userName:{
        type:String,
        required:[true,"Please Enter UserName "],
        minlength:[4,"Name should have atleast 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter email"],
        unique:[true,"Email already exists"],
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    phone:{
        type:String,
        default:""

    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minlength:[8,"Password should be of minimum 8 characters"],
        // select:false //gives everything in findAll except password
    },
    profileUrl:{
        
        
        public_id:{
        type:String,
        
        
        },
        url:{
            type:String,
            default:"https://imgs.search.brave.com/_QS-C_ZdFRoEEb83lITyO3dY1Y6syO6ywUb65b2ZRcQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/dzNzY2hvb2xzLmNv/bS9ob3d0by9pbWdf/YXZhdGFyLnBuZw",
            required:true 
        }
        

        
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    },
    resetPasswordExpire:{
        type:Date
    },
    resetPasswordToken:{
        type:String
    },
    cartItems:[
        {
            name:{
                type:String,
                required:[true,"Please enter product name"]
            },
            image:{
                type:String,
                required:[true,"Please enter image url"]
            },
            newPrice:{
                type:Number,
                required:[true,"Please enter new price"]
            },
            oldPrice:{
                type:Number,
                
            },
            discount:{
                type:Number,
                
            },
            quantity:{
                type:Number,
                default:1,
                required:[true,"Please enter quantity"]
            },
            size:{
                type:String,
                enum:["XS","S","M","L","XL","XXL"],
                required:[true,"Please enter size"]
            },
            product:{
                type:Schema.ObjectId,
                required:[true,"Missing Product"]
            },
            brand:{
                type:String,
                required:[true,"Missing brand"]
            },
            avgRating:{
                type:Number,
                required:[true,"Missing average rating"]
            }
        }

    ],
    cartTotalPriceDetails:{
        totalMRP:{
            type:Number,
            default:0,
            required:[true,"Please enter total MRP"]
        },
        discountOnMRP:{
            type:Number,
            default:0,
            required:[true,"Please enter discount on MRP"]
        },
        shippingFee:{
            type:Number,
            default:0,
            required:[true,"Please enter shipping fees"]
        },
        totalAmount:{
            type:Number,
            default:0,
            required:[true,"Please enter total amount"]
        }
    },
    savedAddresses:[
        {
            name:{
                type:String,
                required:[true,"Please enter name in address"]
            },
            email:{
                type:String,
                required:[true,"Please enter email in address"],
                validate:[validator.isEmail,"Please enter a valid email"]
            },
            phone:{
                type:String,
                required:[true,"Please enter phone in address"],
                
            },
            houseAddress:{
                type:String,
                required:[true,"Please enter house address in address"],   
            },
            areaAddress:{
                type:String,
                required:[true,"Please enter area address in address"],   
            },
            pinCode:{
                type:String,
                required:[true,"Please enter pincode in address"],   
            },
            city:{
                type:String,
                required:[true,"Please enter city in address"],   
            },
            state:{
                type:String,
                required:[true,"Please enter state in address"],   
            },
            country:{
                type:String,
                required:[true,"Please enter country in address"],
                default:"India"   
            },

            
        }
    ]
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const password=this.password;
    try {
        const salt=crypto.randomBytes(16).toString("hex");
        const hashedPassword=crypto.createHmac("sha256",salt).update(password).digest("hex");
        this.salt=salt;
        this.password=hashedPassword;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
    
})


userSchema.static("matchPasswordAndGenerateToken",async function (email,password){
   
    const user=await this.findOne({email});   
    if(!user){
        throw new ErrorHandler("User not found",404);
        
    }
    const salt=user.salt;
    const userGivenHashedPassword=crypto.createHmac("sha256",salt).update(password).digest("hex");
    // console.log(user.password," ",userGivenHashedPassword);
    if(user.password!=userGivenHashedPassword){
        
        throw new ErrorHandler("Wrong Password",400);
        
    }

    const accessToken=createAccessToken(user);
    const refreshToken=createRefreshToken(user);

    
    
    const result= {_id:user._id,userName:user.userName,email,password,accessToken,refreshToken,cartItemsCount:user.cartItems.length,profileUrl:user.profileUrl.url};
    return result;

});

userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+15*60*1000; //15 min in ms
    return resetToken;
}

const User=model("user",userSchema);



module.exports=User

