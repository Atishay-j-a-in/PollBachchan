import crypto from "crypto"

import ApiError from "../../common/utils/apiError.js" 
import Token from "../../common/utils/jwt.utility.js" 
import User from "../user/user.schema.js" 

const authenticate=async (req,res,next)=>{
    try {
        let token 
        if(req.headers.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }
        if(!token && req.cookies?.accessToken){
            token = req.cookies.accessToken
        }
        if(!token){
            throw ApiError.unauthorized("Not authenticated")
        }
        
        
        let decoded
        try {
            decoded = Token.verifyAccessToken(token)
           
        } catch(tokenError) {
            console.error("Token verification error:", tokenError.message)
            throw ApiError.unauthorized(tokenError.message)
        }

        const user = await User.findOne({_id:decoded.id})
        
        
        if(!user){
            throw ApiError.unauthorized("user no longer exist")
        }
        req.user={
            id:decoded.id,
            name:decoded.name
        }
        
        next()
    } catch(error) {
        
        next(error)
    }
}

const authenticateRefreshToken = async function(req,res,next) {
    try {
        let token = req.cookies.refreshToken
      
        if(!token && req.headers.refreshtoken){
            token = req.headers.refreshtoken
        }
        
        if(!token){
            throw ApiError.notFound("refresh token not found")
        }
        const hashToken =  crypto.hash('sha256',token)
        
        const user = await User.findOne({refreshToken:hashToken})
        if(!user){
            throw ApiError.unauthorized("invalid refresh token")
        }
        
        let decode
        try {
            decode = Token.verifyRefreshToken(token)
        } catch(tokenError) {
            console.error("Refresh token verification error:", tokenError.message)
            throw ApiError.unauthorized(tokenError.message)
        }
        
        req.user={
            id:decode.id,
            name:decode.name
        }
        next()
    } catch(error) {
        console.error("Error in authenticateRefreshToken:", error.message)
        next(error)
    }
} 


export {authenticate , authenticateRefreshToken}