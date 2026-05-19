
import mongoose, { Schema, model } from "mongoose" 

const PollSchema = Schema({
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: "",
        maxlength: 100,
        required:true
    },
    description: {
        type: String,
        default: "",
    },
    isAnonymous: {
        type: Boolean,
        default: false,
        required: true
    },
    isResultPublished: {
        type: Boolean,
        default: false,
    },
   questions: {
    type: [
        {
            content: {
                type: String,
                required: true,
                trim: true
            },

            options: {
                type: [String],

                validate: {
                    validator: function(arr) {
                        return arr.length >= 2 
                    },

                    message: "Each question needs at least 2 options"
                }
            },

            isOptional: {
                type: Boolean,
                default: false
            }
        }
    ],

    validate: {
        validator: function(arr) {
            return arr.length > 0 
        },

        message: "At least one question is required"
    }
} ,
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const Poll = model('Poll', PollSchema)
export default Poll