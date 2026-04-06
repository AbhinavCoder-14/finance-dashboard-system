import bcrypt from "bcryptjs"
import prisma from "../../config/prisma"
import { ApiError } from "../../utils/ApiError"
import { createTokenForUsers } from "../../utils/jwt"
import { Role } from "@prisma/client"

type RegisterInput = {
	name: string
	email: string
	password: string
	role: Role
}

type LoginInput = {
	email: string
	password: string
}

export async function registerUser(input: RegisterInput) {
	const existingUser = await prisma.user.findUnique({
		where: { email: input.email },
	})

	if (existingUser) {
		throw new ApiError("Email already exists", 409, "EMAIL_ALREADY_EXISTS")
	}

	const hashedPassword = await bcrypt.hash(input.password, 10)

	const user = await prisma.user.create({
		data: {
			name: input.name,
			email: input.email,
			password: hashedPassword,
			role: input.role,
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isActive: true,
			createdAt: true,
		},
	})

	const token = createTokenForUsers({
		id: user.id,
		role: user.role,
	})

	return { user, token }
}

export async function loginUser(input: LoginInput) {
	const user = await prisma.user.findUnique({
		where: { email: input.email },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			password: true,
			isActive: true,
		},
	})

	if (!user) {
		throw new ApiError("Invalid email or password", 401, "INVALID_CREDENTIALS")
	}

	if (!user.isActive) {
		throw new ApiError("Account is inactive", 403, "ACCOUNT_INACTIVE")
	}

	const isPasswordValid = await bcrypt.compare(input.password, user.password)

	if (!isPasswordValid) {
		throw new ApiError("Invalid email or password", 401, "INVALID_CREDENTIALS")
	}

	const token = createTokenForUsers({
		id: user.id,
		role: user.role,
	})

	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			isActive: user.isActive,
		},
		token,
	}
}
