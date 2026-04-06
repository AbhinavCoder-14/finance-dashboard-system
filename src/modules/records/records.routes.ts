
import express from 'express'
import { requiredRole } from '../../middlewares/role.middleware'
import { checkForAuthCookie } from '../../middlewares/auth.middleware'
import 'dotenv/config'
import {
    createRecord,
    deleteRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
} from './records.controller'



const recordsRoute = express.Router()


const cookie = process.env.COOKIE_NAME
recordsRoute.use(checkForAuthCookie(cookie || 'token'))

recordsRoute.post('/', requiredRole('ADMIN'), createRecord)


recordsRoute.get('/', getAllRecords)

recordsRoute.get('/:id', getRecordById)


recordsRoute.patch('/:id', requiredRole('ADMIN'), updateRecord)


recordsRoute.delete('/:id', requiredRole('ADMIN'), deleteRecord)



export default recordsRoute