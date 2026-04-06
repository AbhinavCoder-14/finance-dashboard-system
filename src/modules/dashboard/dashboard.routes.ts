
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
} from './dashboard.controller'



const dashboardRoute = express.Router()


const cookie = process.env.COOKIE_NAME
dashboardRoute.use(checkForAuthCookie(cookie || 'token'))

dashboardRoute.post('/', requiredRole('ADMIN'), createRecord)


dashboardRoute.get('/', getAllRecords)

dashboardRoute.get('/:id', getRecordById)


dashboardRoute.patch('/:id', requiredRole('ADMIN'), updateRecord)


dashboardRoute.delete('/:id', requiredRole('ADMIN'), deleteRecord)



export default dashboardRoute