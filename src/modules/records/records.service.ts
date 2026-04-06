import { TransactionType } from '@prisma/client'
import prisma from '../../config/prisma'
import { ApiError } from '../../utils/ApiError'

import { CreateFinancialRecordInput } from '../../types/records/CreateFinancialRecordInput'
import { UpdateFinancialRecordInput } from '../../types/records/UpdateFinancialRecordInput'


const financialRecordSelect = {
	id: true,
	amount: true,
	type: true,
	category: true,
	date: true,
	notes: true,
	createdById: true,
	createdAt: true,
	updatedAt: true,
} as const

export async function createFinancialRecord(data: CreateFinancialRecordInput, createdById: string) {
	return prisma.financialRecord.create({
		data: {
			...data,
			createdById,
		},
		select: financialRecordSelect,
	})
}

export async function getFinancialRecords() {
	return prisma.financialRecord.findMany({
		where: {
			deletedAt: null,
		},
		select: financialRecordSelect,
		orderBy: {
			date: 'desc',
		},
	})
}

export async function getFinancialRecordById(id: string) {
	const record = await prisma.financialRecord.findFirst({
		where: {
			id,
			deletedAt: null,
		},
		select: financialRecordSelect,
	})

	if (!record) {
		throw new ApiError('Record not found', 404, 'RECORD_NOT_FOUND')
	}

	return record
}

export async function updateFinancialRecord(id: string, data: UpdateFinancialRecordInput) {
	const existingRecord = await prisma.financialRecord.findFirst({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true,
		},
	})

	if (!existingRecord) {
		throw new ApiError('Record not found', 404, 'RECORD_NOT_FOUND')
	}

	return prisma.financialRecord.update({
		where: { id },
		data,
		select: financialRecordSelect,
	})
}

export async function softDeleteFinancialRecord(id: string) {
	const existingRecord = await prisma.financialRecord.findFirst({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true,
		},
	})

	if (!existingRecord) {
		throw new ApiError('Record not found', 404, 'RECORD_NOT_FOUND')
	}

	return prisma.financialRecord.update({
		where: { id },
		data: {
			deletedAt: new Date(),
		},
		select: financialRecordSelect,
	})
}
