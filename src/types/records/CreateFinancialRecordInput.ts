import { TransactionType } from '@prisma/client'

export type CreateFinancialRecordInput = {
    amount: number
    type: TransactionType
    category: string
    date: Date
    notes?: string
}


