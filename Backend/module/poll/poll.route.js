import { Router } from "express" 

import {authenticate } from "../auth/auth.middleware.js"
import { getAllPolls, getPoll, totalParticipants, userSummary, viewAnalytics, getPollDetails } from "./poll.controller.js" 
import validate from "../../common/dto/validate.middleware.js" 



const router = Router()



router.get('/form',authenticate,getPoll)
router.get('/participants',authenticate,totalParticipants)
router.get('/analytics',authenticate,viewAnalytics)
router.get('/summary',authenticate,userSummary)
router.get('/details',authenticate,getPollDetails)
router.get('/getAll', authenticate, getAllPolls)

export default router