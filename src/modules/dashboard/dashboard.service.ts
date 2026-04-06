import prisma from '../../config/prisma'


export async function getSummary() {

    const income  = await prisma.financialRecord.aggregate({
        where:{type:"INCOME",deletedAt:null},
        _sum:{amount:true}
    })

    const expense  = await prisma.financialRecord.aggregate({
        where:{type:"EXPENSE",deletedAt:null},
        _sum:{amount:true}
    })

    const totalIncome = income._sum.amount || 0 
    const totalExpense = expense._sum.amount || 0 


    return{
        totalIncome,totalExpense,netBalance:totalIncome-totalExpense
    }





}



export const getByCategory = async () => {
  const result = await prisma.financialRecord.groupBy({
    by: ['category', 'type'],
    where: { deletedAt: null },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }
  })

  return result.map((item: { category: string; type: string; _sum: { amount: number | null } }) => ({
    category: item.category,
    type: item.type,
    total: item._sum.amount || 0
  }))
}



export const getMonthlyTrends = async () => {
  const result = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(date, 'YYYY-MM') as month,
      type,
      SUM(amount) as total
    FROM "FinancialRecord"
    WHERE "deletedAt" IS NULL
    GROUP BY TO_CHAR(date, 'YYYY-MM'), type
    ORDER BY month DESC
  `
  return result
}




export const getRecentRecords = async () => {
  return await prisma.financialRecord.findMany({
    where: { deletedAt: null },
    orderBy: { date: 'desc' },
    take: 10,  
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true
    }
  })
}