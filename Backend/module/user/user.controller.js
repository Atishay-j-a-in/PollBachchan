import ApiError from "../../common/utils/apiError.js" 
import ApiResponse from "../../common/utils/response.js" 
import Poll from "../poll/schemas/poll.schema.js" 
import Response from "../poll/schemas/response.schema.js" 


const submitPoll = async function (req, res) {
    const { id } = req.query
    const { responses } = req.body
    const poll = await Poll.findById(id)

    if (!poll) {
        throw ApiError.notFound("Poll not found")
    }
    if(poll.expiresAt < Date.now()){
        throw ApiError.forbidden("Poll expired")
    }
    const validQuestionIds = poll.questions.map(
        q => q._id.toString()
    )
    for (const r of responses) {
        if (!validQuestionIds.includes(r.questionId)) {
            throw ApiError.badRequest("Invalid question") 
        }
    }
    const payload = responses.map((ele)=> ({
        pollId: id,
        respondent: req.user.id,
        qid: ele.questionId,
        optionIndex: ele.selectedOption
    }))

    const saveResponses = await Response.insertMany(payload)

    return ApiResponse.created(res, "Response created ")
}
const createPoll = async function(req,res){
    const { title, description , isAnonymous , expiresAt , questions } = req.body

    const poll=await Poll.create({ownerId:req.user.id,title,description,isAnonymous,expiresAt, questions})

    return ApiResponse.created(res,"Poll created",{pollId:poll._id})

}

const delPoll = async function(req,res){
    const { id } = req.query
    
    const poll= await Poll.findByIdAndDelete(id)
    if(!poll){
        throw ApiError.notFound("Poll not found to delete")
    }
    await Response.deleteMany({pollId:id})

    return ApiResponse.ok(res,"Poll and it's responses are deleted")
}

const publish = async function(req,res){
    const {id} = req.query
    const { isPublished } = req.body
    const poll= await Poll.findByIdAndUpdate(id,{isResultPublished:isPublished})
    if(!poll){
        throw ApiError.notFound("Poll not found")
    }
   
    return ApiResponse.ok(res,"Result is published", {pollId:id})
}
export {submitPoll , createPoll , delPoll, publish}