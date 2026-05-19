import Joi from "joi" 

import BaseDto from "../../common/dto/baseDto.js" 


class RegisterDto extends BaseDto{
    static schema = Joi.object({
        name:Joi.string().min(5).max(100).required(),
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(8).max(100).required()
    })
}
class LoginDto extends BaseDto{
    static schema = Joi.object({
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(8).max(100).required()
    })
}


export {RegisterDto , LoginDto}