import Joi from "joi" 

import BaseDto from "../../common/dto/baseDto.js" 

class PollDto extends BaseDto{
    static schema = Joi.object({
        title:Joi.string().max(100).required(),
        description:Joi.string(),
        isAnonymous:Joi.boolean().default(false).required(),
        expiresAt:Joi.date().required(),
        questions: Joi.array().min(1).items(
            Joi.object({

                content: Joi.string()
                    .required(),

                options: Joi.array()
                    .items(
                        Joi.string()
                            .required()
                    )
                    .min(2)
                    .required(),

                isOptional: Joi.boolean()
                    .default(false)

            })

        )
        .required()

    })
}
class ResponseDto extends BaseDto{
    static schema = Joi.object({
        responses: Joi.array().items(
            Joi.object({

                questionId: Joi.string()
                    .length(24)
                    .required(),

                selectedOption: Joi.number()
                    .integer()
                    .min(0)
                    .required()

            })

        )
        .required()
    })
}
export  {PollDto , ResponseDto}