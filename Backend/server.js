import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"

import conn from "./common/db/db.js"
import authRouter from "./module/auth/auth.route.js"
import pollRouter from "./module/poll/poll.route.js"
import userRouter from "./module/user/user.route.js"

const port = process.env.PORT 
const app= new express()
app.use(cookieParser())
app.use(cors({credentials:true, origin:process.env.FRONTEND_URL}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


await conn()

app.use("/api/auth",authRouter)

app.use("/api/poll",pollRouter)

app.use("/api/user",userRouter)

app.use((err, req, res, next) => {

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong"
  })
})

app.get("/health",(req,res)=>{
    res.status(200).json({message:"healthy"})
})

app.listen(port, () => console.log("Server starting on port: " + port)) 


