class CustomError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export const badRequestError = new CustomError(400, 'Bad request error')
export const unauthorizedError = new CustomError(401, 'Unauthorized error')
export const forbiddenError = new CustomError(403, 'Forbidden error')
export const notFoundError = new CustomError(404, 'Not found error')
export const methodNotAllowedError = new CustomError(
  405,
  'Method not allowed error',
)
export const internalServerError = new CustomError(500, 'Internal server error')
