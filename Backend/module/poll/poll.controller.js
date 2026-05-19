import ApiError from "../../common/utils/apiError.js" 
import ApiResponse from "../../common/utils/response.js" 

import Poll from "./schemas/poll.schema.js"
import Response from "./schemas/response.schema.js" 


const getPoll= async function (req,res) {
    const {id} = req.query

    const poll = await Poll.findById(id)
    if(!poll){
        throw ApiError.notFound("Poll not found")
    }
   
    if(poll.expiresAt < Date.now()){
        if(poll.isResultPublished){
            const result = await Response.getResult(poll._id)
            
            return ApiResponse.ok(res,"Public analytics",{result,poll})
        }
        throw ApiError.forbidden("The poll has expired")
    }
    const response = await Response.findOne({pollId:poll.id , respondent:req.user.id})
   
    if(response){
        throw ApiError.conflict("User has already filled the poll")
    }
    return ApiResponse.ok(res,"Poll is ready to be filled",poll)
}

const getAllPolls = async function(req,res){
    
    try {
        
        const {id} = req.user
       
        const polls  = await Poll.find({ownerId:id})
        if(polls.length===0){
            throw ApiError.notFound("Polls are not found")
        }
       
        const formatPolls= polls.map((ele)=>{
            const poll={}
            poll.id=ele._id
            poll.title=ele.title
            poll.isAnonymous=ele.isAnonymous
            poll.isResultPublished=ele.isResultPublished
            return poll
        })
       
        return ApiResponse.ok(res,"Polls retrieved", {polls:formatPolls})
    } catch (error) {
        throw new Error("Internal Server Error")
    }
}

const totalParticipants = async function(req,res){
    const {id}  = req.query
    const poll = await Poll.findById(id).lean()
    if(!poll){
        throw ApiError.notFound("Poll not found")

    }
    const totalRespondents = await Response.getParticipants(id)

    return ApiResponse.ok(res,"total participants calculated", {totalParticipants:totalRespondents})
}
const viewAnalytics = async function(req , res){
    const {id} = req.query
    const poll = await Poll.findById(id)
    if(!poll){
        throw ApiError.notFound("Poll not found")

    }
    const analytics = await Response.getAnalytics(poll)

    return ApiResponse.ok(res, "Analytsis completed" , {analytics})
}

const userSummary =  async function(req,res){
    const {id} = req.query
    const poll = await Poll.findById(id)
    if(!poll){
        throw ApiError.notFound("Poll not found")

    }
    const summary = await Response.getUserSummary(id)

    return ApiResponse.created(res, "User summary created",{summary})
}

const getPollDetails = async function(req, res){
    const {id} = req.query
    const poll = await Poll.findById(id)
    if(!poll){
        throw ApiError.notFound("Poll not found")
    }
    return ApiResponse.ok(res, "Poll details retrieved", {
        id: poll._id,
        title: poll.title,
        isAnonymous: poll.isAnonymous,
        questions: poll.questions
    })
}

export { getPoll , totalParticipants, viewAnalytics , userSummary ,getAllPolls, getPollDetails}