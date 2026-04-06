import { validationToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse";


export function checkForAuthCookie(cookieName:string){
    return (req:Request,res:Response,next:NextFunction)=>{
        const tokenCookievalue = req.cookies[cookieName]

        if(!tokenCookievalue) return res.status(401).json(ApiResponse.error("No token provided"))
        try{
            const userPayload = validationToken(tokenCookievalue)
            if (typeof userPayload === "string") {
                return res.status(401).json(ApiResponse.error("Invalid token payload", "INVALID_TOKEN"))
            }
            req.user = userPayload
            return next()

        }catch(error){
            return res.status(401).json(ApiResponse.error("Invalid token", "INVALID_TOKEN"))
        }
            
    }
}
