export class ApiResponse {
  static success(message: string, data: any = null) {
    return {
      success: true,
      message,
      data,
      error: null,
    }
  }

  static error(message: string, code: string = "BAD_REQUEST") {
    return {
      success: false,
      message,
      data: null,
      error: { code },
    }
  }
}