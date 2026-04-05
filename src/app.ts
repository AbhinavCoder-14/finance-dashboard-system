import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoute from './modules/auth/auth.routes'
import userRoute from "./modules/user/user.routes";



const app = express();

app.use(express.json())
app.use(cors())

app.use("/auth",authRoute)

app.use("/users",userRoute)

export default app