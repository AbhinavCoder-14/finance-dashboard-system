import { Request, Response } from "express"
import { ApiResponse } from "../../utils/ApiResponse"
import { ApiError } from "../../utils/ApiError"
import { isActiveSchema } from "../../validator/isactive.validator"
import { roleSchema } from "../../validator/role.validator"
import { fetchAllUsers, setUserActiveStatus, setUserRole } from "./user.service"

export async function getAllUsers(req: Request, res: Response) {
	try {
		const users = await fetchAllUsers()
		return res.status(200).json(ApiResponse.success("All users fetched", users))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error("Error while fetching users", "INTERNAL_SERVER_ERROR"))
	}
}

export async function updateUserRole(req: Request, res: Response) {
	try {
		const userId = String(req.params.id)
		const result = roleSchema.safeParse(req.body)

		if (!result.success) {
			return res.status(400).json(ApiResponse.error("Invalid role", "VALIDATION_ERROR"))
		}

		const user = await setUserRole(userId, result.data.role)
		return res.status(200).json(ApiResponse.success("User role updated", user))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error("Failed to update role", "INTERNAL_SERVER_ERROR"))
	}
}

export async function updateUserStatus(req: Request, res: Response) {
	try {
		const userId = String(req.params.id)
		const result = isActiveSchema.safeParse(req.body)

		if (!result.success) {
			return res.status(400).json(ApiResponse.error("Invalid status", "VALIDATION_ERROR"))
		}

		const user = await setUserActiveStatus(userId, result.data.isActive)
		return res.status(200).json(ApiResponse.success("User status updated", user))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error("Failed to update status", "INTERNAL_SERVER_ERROR"))
	}
}
