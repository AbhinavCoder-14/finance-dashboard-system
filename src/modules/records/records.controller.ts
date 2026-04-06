import { Request, Response } from 'express'
import { ApiError } from '../../utils/ApiError'
import { ApiResponse } from '../../utils/ApiResponse'
import {
	createRecordSchema,
	recordIdParamSchema,
	updateRecordSchema,
} from '../../validator/record.validator'
import {
	createFinancialRecord,
	getFinancialRecordById,
	getFinancialRecords,
	softDeleteFinancialRecord,
	updateFinancialRecord,
} from './records.service'

export async function createRecord(req: Request, res: Response) {
	try {
		const payloadResult = createRecordSchema.safeParse(req.body)
		if (!payloadResult.success) {
			return res.status(400).json(ApiResponse.error('Invalid record payload', 'VALIDATION_ERROR'))
		}

		const userId = req.user?._id
		if (!userId) {
			return res.status(401).json(ApiResponse.error('Unauthorized', 'UNAUTHORIZED'))
		}

		const record = await createFinancialRecord(payloadResult.data, userId)
		return res.status(201).json(ApiResponse.success('Record created', record))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error('Failed to create record', 'INTERNAL_SERVER_ERROR'))
	}
}

export async function getAllRecords(req: Request, res: Response) {
	try {
		const records = await getFinancialRecords()
		return res.status(200).json(ApiResponse.success('All records data', records))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error('Error while fetching records', 'INTERNAL_SERVER_ERROR'))
	}
}

export async function getRecordById(req: Request, res: Response) {
	try {
		const idResult = recordIdParamSchema.safeParse(req.params)
		if (!idResult.success) {
			return res.status(400).json(ApiResponse.error('Invalid record id', 'VALIDATION_ERROR'))
		}

		const record = await getFinancialRecordById(idResult.data.id)
		return res.status(200).json(ApiResponse.success('Record data', record))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error('Error while fetching record', 'INTERNAL_SERVER_ERROR'))
	}
}

export async function updateRecord(req: Request, res: Response) {
	try {
		const idResult = recordIdParamSchema.safeParse(req.params)
		if (!idResult.success) {
			return res.status(400).json(ApiResponse.error('Invalid record id', 'VALIDATION_ERROR'))
		}

		const payloadResult = updateRecordSchema.safeParse(req.body)
		if (!payloadResult.success) {
			return res.status(400).json(ApiResponse.error('Invalid record payload', 'VALIDATION_ERROR'))
		}

		const updatedRecord = await updateFinancialRecord(idResult.data.id, payloadResult.data)
		return res.status(200).json(ApiResponse.success('Record updated', updatedRecord))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error('Failed to update record', 'INTERNAL_SERVER_ERROR'))
	}
}

export async function deleteRecord(req: Request, res: Response) {
	try {
		const idResult = recordIdParamSchema.safeParse(req.params)
		if (!idResult.success) {
			return res.status(400).json(ApiResponse.error('Invalid record id', 'VALIDATION_ERROR'))
		}

		const deletedRecord = await softDeleteFinancialRecord(idResult.data.id)
		return res.status(200).json(ApiResponse.success('Record deleted', deletedRecord))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error('Failed to delete record', 'INTERNAL_SERVER_ERROR'))
	}
}
