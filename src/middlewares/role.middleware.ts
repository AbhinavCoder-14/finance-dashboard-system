import { NextFunction, Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse"


export const requiredRole = (...roles:string[]) => {
    return (req:Request, res:Response,next:NextFunction) => {
        const role = req.user?.role

        if (!role) {
            return res.status(401).json(ApiResponse.error("Unauthorized", "UNAUTHORIZED"))
        }
        
        if (!roles.includes(role)){
            return res.status(403).json(ApiResponse.error('Access denied', 'FORBIDDEN'))
        }

        return next()
        




    }
}