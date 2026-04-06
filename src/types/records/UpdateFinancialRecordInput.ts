import { TransactionType } from '@prisma/client'


export type UpdateFinancialRecordInput = {
    amount?: number
    type?: TransactionType
    category?: string
    date?: Date
    notes?: string
}
