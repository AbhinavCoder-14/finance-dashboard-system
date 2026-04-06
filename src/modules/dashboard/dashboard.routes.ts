
import express from 'express'

import { requiredRole } from '../../middlewares/role.middleware'
import { checkForAuthCookie } from '../../middlewares/auth.middleware'
import 'dotenv/config'
import {
    getSummary,
    getByCategory,
    getMonthlyTrends,
    getRecentRecords
} from './dashboard.controller'



const dashboardRoute = express.Router()


const cookie = process.env.COOKIE_NAME
dashboardRoute.use(checkForAuthCookie(cookie || 'token'))

dashboardRoute.get('/summary', requiredRole('ADMIN','ANALYST'), getSummary)


dashboardRoute.get('/by-category', requiredRole('ADMIN','ANALYST'),getByCategory)


dashboardRoute.get('/trends',requiredRole('ADMIN','ANALYST'),getMonthlyTrends)



dashboardRoute.get('/recent',requiredRole('ADMIN','ANALYST'), getRecentRecords)






export default dashboardRoute