const cloudinary = require('cloudinary').v2;

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

const uploadFile=async(filepath)=>{
    try {
        const res=await cloudinary.uploader.upload(filepath);
       // console.log(res);
        return res;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={uploadFile};