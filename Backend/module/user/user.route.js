import { Router } from "express"

import { authenticate } from "../auth/auth.middleware.js"
import { ResponseDto,PollDto } from "../poll/poll.dto.js"
import { submitPoll, createPoll, delPoll, publish } from "./user.controller.js"
import validate from "../../common/dto/validate.middleware.js"

const router = Router()

router.post('/create',authenticate,validate(PollDto),createPoll)
router.post('/submit',authenticate,validate(ResponseDto),submitPoll)
router.post('/delete',authenticate,delPoll)
router.post('/publish',authenticate,publish)



export default router