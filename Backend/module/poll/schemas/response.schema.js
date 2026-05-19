import mongoose, { Schema, model } from "mongoose"

const ResponseSchema = Schema({
    pollId: {
        type: mongoose.Types.ObjectId,
        ref: 'Poll',
        required: true
    },

    qid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    respondent: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    optionIndex: {
        type: Number,
        required: true
    },

}, { timestamps: true })

ResponseSchema.statics.getResult = async function (pollId) {
   
    const analytics = await this.aggregate([
        {
            $match: {
                pollId: new mongoose.Types.ObjectId(pollId)
            }
        },

        {
            $group: {

                _id: {
                    questionId: "$qid",
                    optionIndex: "$optionIndex"
                },

                count: {
                    $sum: 1
                }
            }
        }

    ])
    const result = {}
    
    analytics.forEach((item) => {
        const qid = item._id.questionId.toString()
        const option = item._id.optionIndex
        if (!result[qid]) {
            result[qid] = {}
        }

        result[qid][option] = item.count
    })

    return result
}

ResponseSchema.statics.getParticipants = async function (pollId) {
    const result = await this.aggregate([

        {
            $match: {
                pollId: new mongoose.Types.ObjectId(pollId)
            }
        },

        {
            $group: {
                _id: "$respondent"
            }
        },

        {
            $count: "participants"
        }

    ]) 

    return result[0]?.participants || 0 

}
ResponseSchema.statics.getAnalytics = async function (poll) {
    const analytics = await this.getResult(poll._id)

    const totalParticipants = await this.getParticipants(poll._id) 

    const result = {
        totalParticipants,
        questions: []
    } 

    poll.questions.forEach((question) => {
        const qid =
            question._id.toString() 

        const optionAnalysis =
            analytics[qid] || {} 

       

        const totalVotes =
            Object.values(optionAnalysis)
                .reduce(
                    (acc, val) => acc + val,
                    0
                ) 

        const formattedQuestion = {

            questionId: qid,

            content: question.content,

            results: []

        } 

        question.options.forEach(
            (optionText, index) => {

                const count =
                    optionAnalysis[index] || 0 

                const percentage =
                    totalVotes === 0
                        ? 0
                        : Number(
                            (
                                (count /totalVotes) *100
                            ).toFixed(2)
                        ) 

                formattedQuestion.results.push({

                    optionIndex: index,
                    optionText,
                    count,
                    percentage

                }) 

            }
        ) 

        result.questions.push(
            formattedQuestion
        ) 

    }) 

    return result 
}
ResponseSchema.statics.getUserSummary =async function (pollId) {
    return await this.aggregate([
        {
            $match: {
                pollId:
                    new mongoose.Types.ObjectId(pollId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "respondent",
                foreignField: "_id",
                as: "user"

            }
        },
        {
            $unwind: "$user"
        },
        {
            $lookup: {
                from: "polls",
                localField: "pollId",
                foreignField: "_id",
                as: "poll"
            }
        },
        {
            $unwind: "$poll"
        },
        {
            $addFields: {
                questionDetails: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$poll.questions",
                                as: "q",
                                cond: { $eq: ["$$q._id", "$qid"] }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            $group: {

                _id: "$respondent",

                name: {
                    $first: "$user.name"
                },

                responses_temp: {
                    $push: {
                        q: "$questionDetails.content",
                        o: { $arrayElemAt: ["$questionDetails.options", "$optionIndex"] }
                    }
                }
            }
        },
        {
            $addFields: {
                responses: {
                    $map: {
                        input: { $range: [0, { $size: "$responses_temp" }] },
                        as: "idx",
                        in: {
                            $let: {
                                vars: { resp: { $arrayElemAt: ["$responses_temp", "$$idx"] } },
                                in: {
                                    $concat: [
                                        { $toString: { $add: ["$$idx", 1] } },
                                        ". ",
                                        "$$resp.q",
                                        "\n",
                                        "$$resp.o"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {

                _id: 0,
                userId: "$_id",
                name: 1,
                responses: 1

            }
        }

    ]) 

}

const Response = model('Response', ResponseSchema)
export default Response