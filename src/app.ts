import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoute from './modules/auth/auth.routes'
import userRoute from "./modules/user/user.routes";
import  recordsRoute  from "./modules/records/records.routes";
import dashboardRoute from "./modules/dashboard/dashboard.routes";



const app = express();

app.use(express.json())
app.use(cors({ credentials: true }))
app.use(cookieParser())

app.use("/auth",authRoute)

app.use("/users",userRoute)

app.use("/records",recordsRoute)

app.use("/dashboard",dashboardRoute)

export default app