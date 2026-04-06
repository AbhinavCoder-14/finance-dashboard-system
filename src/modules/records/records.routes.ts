


import express from 'express'
import { requiredRole } from '../../middlewares/role.middleware'
import { checkForAuthCookie } from '../../middlewares/auth.middleware'
import {Request, Response} from "express"
import prisma from "../../config/prisma"
import { ApiResponse } from '../../utils/ApiResponse'
import ApiError from '../../utils/ApiError'
import { updateUserRole } from '../user/user.controller'



const recordsRoute = express.Router()


recordsRoute.use(checkForAuthCookie)
//admin only
recordsRoute.post("/",requiredRole("ADMIN"),(req: Request, res: Response)=>{


})

recordsRoute.get("/",async (req: Request, res: Response)=>{
    try{
        const getAllRecord = await prisma.financialRecord.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        })

        res.status(200).json(ApiResponse.success("All the records data",getAllRecord))

    }

    catch{
        res.status(500).json(ApiResponse.error("Error while fetching users", "INTERNAL_SERVER_ERROR"))
    }


    
    

})

recordsRoute.get("/:id",async (req: Request, res: Response)=>{


    try{
        const userId = String(req.params.id)

        const getRecordsById = await prisma.financialRecord.findFirst({
            where:{
                id:userId
            },  
        })

        res.status(200).json(ApiResponse.success("All the records data",getRecordsById))
    }catch{

        res.status(500).json(ApiResponse.success("can't find with the userId"))
    }

})

// admin only
recordsRoute.patch("/:id",requiredRole("ADMIN"),async(req: Request, res: Response)=>{
  
    try{

        const id = String(req.params.id)
        const data = req.body
        
        const record = await prisma.financialRecord.findFirst({
            where: { id, deletedAt: null }
        })
  if (!record) res.status(404).json(ApiResponse.error('Record not found'))
    
    const updatedRecords = await prisma.financialRecord.update({
        where: { id },
        data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined
        }
    })
    
    res.status(200).json(ApiResponse.success("Record updated", updatedRecords))
}catch{
    res.status(500).json(ApiResponse.success("can't update due to db error"))
}



})

//admin only
recordsRoute.delete("/:id",requiredRole("ADMIN"),(req: Request, res: Response)=>{


})



export default recordsRoute