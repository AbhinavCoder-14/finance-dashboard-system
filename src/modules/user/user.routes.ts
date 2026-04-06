import express from "express"
import "dotenv/config"
import { checkForAuthCookie } from "../../middlewares/auth.middleware"
import { requiredRole } from "../../middlewares/role.middleware"
import { getAllUsers, updateUserRole, updateUserStatus } from "./user.controller"


const userRoute = express.Router()


const cookie = process.env.COOKIE_NAME
userRoute.use(checkForAuthCookie(cookie || "token"), requiredRole("ADMIN"))


userRoute.get("/", getAllUsers)

userRoute.patch("/:id/role", updateUserRole)

userRoute.patch("/:id/isActive", updateUserStatus)



export default userRoute;