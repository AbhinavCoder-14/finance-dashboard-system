import { Request, Response } from 'express'
import * as dashboardService from './dashboard.service'
import { ApiResponse } from '../../utils/ApiResponse'


export async function getSummary(req:Request,res:Response) {
  try {
    const data = await dashboardService.getSummary()
    return res.status(200).json(ApiResponse.success('Summary fetched', data))
  } catch {
    return res.status(500).json(ApiResponse.error('Failed to fetch summary', 'INTERNAL_SERVER_ERROR'))
  }
}

export const getByCategory = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getByCategory()
    return res.status(200).json(ApiResponse.success('Category breakdown fetched', data))
  } catch {
    return res.status(500).json(ApiResponse.error('Failed to fetch category breakdown', 'INTERNAL_SERVER_ERROR'))
  }
}


export const getMonthlyTrends = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getMonthlyTrends()
    return res.status(200).json(ApiResponse.success('Monthly trends fetched', data))
  } catch {
    return res.status(500).json(ApiResponse.error('Failed to fetch monthly trends', 'INTERNAL_SERVER_ERROR'))
  }
}

export const getRecentRecords = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getRecentRecords()
    return res.status(200).json(ApiResponse.success('Recent records fetched', data))
  } catch {
    return res.status(500).json(ApiResponse.error('Failed to fetch recent records', 'INTERNAL_SERVER_ERROR'))
  }
}