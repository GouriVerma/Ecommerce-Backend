const {Schema, model}=require("mongoose");

const productSchema=new Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        unique:[true,"Name already taken"],
        trim:true
    },
    smallDesc:{
        type:String,

    },
    desc:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    newPrice:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxLength:[4,"Price cannot exceed 4 digits "]
    },
    oldPrice:{
        type:Number,
        
    },
    discount:{
        type:Number,
        
    },
    
    category:{
        type:String,
        required:[true,"Please Enter Category"]
    },
    gender:{
        type:String,
        required:[true,"Please Enter Gender"],
        enum:["men","women","kids"]
    },
    color:{
        type:String,
        required:true
    },
    avgRating:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        required:[true,"Please enter stock"],
        maxLength:[4,"Stock cannot exceed 4 digits"],
        default:1
    },


    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
           rating:{
            type:Number,
            required:true
           },
           description:{
            type:String,
            required:true
           },

           imagesUrl:[
                {
                    public_id:{
                        type:String,
                        
                    },
                    url:{
                        type:String,
                        
                    },
                }
           ],
           createdByName:{
            type:String,
            required:true
           },
           createdBy:{
            type:Schema.ObjectId,
            ref:"user",
            required:true
           },
           createdAt:{
            type:Date,
            default:Date.now()
           }
        },{timestamps:true}
    ],
    createdBy:{
        type:Schema.ObjectId,
        ref:"user",
        required:true
    },
    brand:{
        type:String,
        required:true
    }
},{timestamps:true})

const Product=model("product",productSchema);

module.exports=Product;