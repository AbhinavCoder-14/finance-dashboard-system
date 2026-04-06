import {z} from "zod"



export const isActiveSchema = z.object({
    isActive:z.boolean()
})