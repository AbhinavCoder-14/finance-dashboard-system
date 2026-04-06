import { Request, Response } from "express"
import { registerSchema, loginSchema } from "../../validator/auth.validator"
import { ApiError } from "../../utils/ApiError"
import { ApiResponse } from "../../utils/ApiResponse"
import { loginUser, registerUser } from "./auth.service"

export async function register(req: Request, res: Response) {
	try {
		const result = registerSchema.safeParse(req.body)

		if (!result.success) {
			return res.status(400).json(ApiResponse.error("Validation failed", "VALIDATION_ERROR"))
		}

		const data = await registerUser(result.data)
		res.cookie("token", data.token, { httpOnly: true })
		return res.status(201).json(ApiResponse.success("Registered successfully", { user: data.user }))
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error("Server error", "INTERNAL_SERVER_ERROR"))
	}
}

export async function login(req: Request, res: Response) {
	try {
		const result = loginSchema.safeParse(req.body)

		if (!result.success) {
			return res.status(400).json(ApiResponse.error("Validation failed", "VALIDATION_ERROR"))
		}

		const data = await loginUser(result.data)
		res.cookie("token", data.token, { httpOnly: true })
		return res.status(200).json(ApiResponse.success("Login successful", { user: data.user }))

	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json(ApiResponse.error(error.message, error.code))
		}

		return res.status(500).json(ApiResponse.error("Server error", "INTERNAL_SERVER_ERROR"))
	}
}
