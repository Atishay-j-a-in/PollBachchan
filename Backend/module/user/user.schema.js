import bcrypt from "bcryptjs" 
import {Schema, model} from "mongoose" 

const UserSchema = Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        minlength:5,
        maxlength:100
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minlength:6,
        trim: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 100,
        select:false,
    },
    refreshToken:{
        type:String,
        select:false
    }
}, { timestamps: true })

UserSchema.pre('save', async function () {
    if (!this.isModified("password")) {
        return
    }
    this.password=await bcrypt.hash(this.password,10)
})

UserSchema.methods.comparePassword= async function(password) {

    let isMatched= await bcrypt.compare(password,this.password)
    return isMatched
}


const User = model('User', UserSchema)


export default User
