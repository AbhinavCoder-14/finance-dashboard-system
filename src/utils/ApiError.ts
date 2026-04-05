export class ApiError extends Error {
	statusCode: number
	code: string

	constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_SERVER_ERROR") {
		super(message)
		this.name = "ApiError"
		this.statusCode = statusCode
		this.code = code
	}
}

export default ApiError
