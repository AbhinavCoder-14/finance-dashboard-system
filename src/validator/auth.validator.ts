import { z} from "zod"



export const registerSchema = z.object({
    name:z.string().min(5),
    email:z.string().email(),
    password:z.string().min(6),
    role:z.enum(["VIEWER","ANALYST","ADMIN"])
})

export const loginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6)
})

