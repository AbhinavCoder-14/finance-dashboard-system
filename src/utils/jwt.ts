import jwt from "jsonwebtoken"
import { StripTypeScriptTypesOptions } from "node:module"
import 'dotenv/config'


const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = '7d'


export function createTokenForUsers(payload:{id:string,role:string}){
    return jwt.sign({
        _id:payload.id,
        role:payload.role
    },JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})

}

export  function validationToken(payload:{token:string}){
    return jwt.verify(payload.token, JWT_SECRET)
}