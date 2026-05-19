import bcrypt from "bcryptjs" 
import crypto from "crypto"

import ApiError from "../../common/utils/apiError.js" 
import ApiResponse from "../../common/utils/response.js" 
import User from "../user/user.schema.js" 
import Token from "../../common/utils/jwt.utility.js" 


const register = async function(req,res) {
    const {name, email , password} = req.body

    const find = await User.findOne({email})
   
    if(find){
        throw ApiError.conflict("user already exists")
    }
    const user =await User.create({name, email, password})
    
 

    return ApiResponse.created(res,"user created",user)
}

const login = async function(req,res){
    const {email , password} = req.body
    const user = await User.findOne({email}).select("+password")
    if(!user){
        throw ApiError.unauthorized("Email or password incorrect")
    }

    

    const isMatched = await user.comparePassword(password)
  
    if(!isMatched){
        throw ApiError.unauthorized("Email or password incorrect")
    }

    const refreshToken = Token.generateRefreshToken({id:user._id,name:user.name})
    const accessToken = Token.generateAccessToken({id:user._id,name:user.name})
    const hashrefreshToken= crypto.hash('sha256',refreshToken)
    user.refreshToken= hashrefreshToken
    await user.save()
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true, 
        maxAge:1000 * 60 * 60 * 24 * 7,
        sameSite: "none"
    })
    return ApiResponse.ok(res,"User logged!",{name:user.name,accessToken})
}
const logout = async function(req,res) {
    const {id} = req.user
      
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true, 
        sameSite: "none"
    })
    await User.findByIdAndUpdate(id,{
        $unset: {
      refreshToken: 1
    }
    })
    ApiResponse.ok(res,"logged out successfully")
}

const refreshAccessToken = async function(req,res){
    const {id, name }= req.user
  
    const accessToken = Token.generateAccessToken({id,name})
    const refreshToken = Token.generateRefreshToken({id,name})
    const hashtoken = crypto.hash('sha256',refreshToken)
    await User.findByIdAndUpdate(id,{ refreshToken:hashtoken})
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        maxAge:1000 * 60 * 60 * 24 * 7,
        sameSite:"none"
    })
    ApiResponse.created(res,"access token is refreshed",{accessToken})
}

export {register , login , logout , refreshAccessToken}
