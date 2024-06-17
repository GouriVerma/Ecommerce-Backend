const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/error");



let refreshTokens=[];


function createAccessToken(user) {
    const payload = { _id: user._id, 
        userName: user.userName, 
        password: user.password, 
        role: user.role, 
        email: user.email };

    return jwt.sign(payload, process.env.JWT_SECRET_ACCESS,{expiresIn:process.env.JWT_EXPIRE_ACCESS});
}

function validateAccessToken(token){
    const payload=jwt.verify(token,process.env.JWT_SECRET_ACCESS);
    return payload;
}

function createRefreshToken(user){
    const payload = { _id: user._id, 
        userName: user.userName, 
        password: user.password, 
        role: user.role, 
        email: user.email };
    const refreshToken=jwt.sign(payload, process.env.JWT_SECRET_REFRESH);
    refreshTokens.push(refreshToken);
    console.log("RefreshTokens in createRefreshToken",refreshTokens);

    return refreshToken;
}

function validateRefreshToken(token){
    if(!refreshTokens.includes(token)){
        throw new ErrorHandler("Not active refresh token",401);
    }
    const payload=jwt.verify(token,process.env.JWT_SECRET_REFRESH);
    if(!payload){
        throw new ErrorHandler("Invalid Refresh Token",401)
    }
    else{
        return payload;
    }
    
}

function deleteRefreshToken(refreshToken){
   
    refreshTokens=refreshTokens.filter((token)=>token!=refreshToken);
   
}


module.exports={createAccessToken,validateAccessToken,createRefreshToken,validateRefreshToken,deleteRefreshToken};