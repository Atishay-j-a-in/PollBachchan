import jwt from "jsonwebtoken" 

class Token{

    static generateAccessToken = (payload)=>{
        return jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
            expiresIn:process.env.JWT_ACCESS_EXPIRESIN || '30m'
        })
    }
    static verifyAccessToken = (token)=>{

      
        return jwt.verify(token,process.env.JWT_ACCESS_SECRET) 
    }
    
    static generateRefreshToken=(payload)=>{
        return jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
            expiresIn:process.env.JWT_REFRESH_EXPIRESIN || '7d'
        })
    }
    static verifyRefreshToken = (token )=>{
        return jwt.verify(token,process.env.JWT_REFRESH_SECRET)
    }
}

export default Token