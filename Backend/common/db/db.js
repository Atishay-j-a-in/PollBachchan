import mongoose from "mongoose" 
import ApiError from "../utils/apiError.js" 

async function conn(){
    try{

        const connection= await mongoose.connect(process.env.DB_URL)
        console.log("server connected")
    }
    catch(err){
        throw ApiError.serverFailed()
    }
} 

    

export default conn