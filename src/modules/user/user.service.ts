import { Role } from "@prisma/client"
import prisma from "../../config/prisma"
import { ApiError } from "../../utils/ApiError"

export async function fetchAllUsers() {
	return prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isActive: true,
			createdAt: true,
		},
	})
}

export async function setUserRole(userId: string, role: Role) {
	try {
		return await prisma.user.update({
			where: { id: userId },
			data: { role },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isActive: true,
			},
		})
	} catch {
		throw new ApiError("User not found", 404, "USER_NOT_FOUND")
	}
}

export async function setUserActiveStatus(userId: string, isActive: boolean) {
	try {
		return await prisma.user.update({
			where: { id: userId },
			data: { isActive },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isActive: true,
			},
		})
	} catch {
		throw new ApiError("User not found", 404, "USER_NOT_FOUND")
	}
}
