import { z } from 'zod'

const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const recordIdParamSchema = z.object({
    id: z.uuid(),
})

export const createRecordSchema = z.object({
    amount: z.number().positive(),
    type: transactionTypeSchema,
    category: z.string().min(2),
    date: z.coerce.date(),
    notes: z.string().trim().optional(),
})

export const updateRecordSchema = z
    .object({
        amount: z.number().positive().optional(),
        type: transactionTypeSchema.optional(),
        category: z.string().min(2).optional(),
        date: z.coerce.date().optional(),
        notes: z.string().trim().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
        message: 'At least one field is required for update',
    })
