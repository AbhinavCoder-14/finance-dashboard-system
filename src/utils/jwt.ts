import jwt from "jsonwebtoken"
import 'dotenv/config'


const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = '7d'

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set")
}


export function createTokenForUsers(payload:{id:string,role:string}){
    return jwt.sign({
        _id:payload.id,
        role:payload.role
    },JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})

}

export function validationToken(token:string){
    return jwt.verify(token, JWT_SECRET)
}