import { NextFunction, Request, Response } from "express"

import { MedusaError } from "medusa-core-utils"
import { Logger } from "../../types/global"
import { formatException } from "../../utils"

const QUERY_RUNNER_RELEASED = "QueryRunnerAlreadyReleasedError"
const TRANSACTION_STARTED = "TransactionAlreadyStartedError"
const TRANSACTION_NOT_STARTED = "TransactionNotStartedError"

const API_ERROR = "api_error"
const INVALID_REQUEST_ERROR = "invalid_request_error"
const INVALID_STATE_ERROR = "invalid_state_error"

export default () => {
  return (
    err: MedusaError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const logger: Logger = req.scope.resolve("logger")

    err = formatException(err)

    logger.error(err)

    const errorType = err.type || err.name

    const errObj = {
      code: err.code,
      type: err.type,
      message: err.message,
    }

    let statusCode = 500
    switch (errorType) {
      case QUERY_RUNNER_RELEASED:
      case TRANSACTION_STARTED:
      case TRANSACTION_NOT_STARTED:
      case MedusaError.Types.CONFLICT:
        statusCode = 409
        errObj.code = INVALID_STATE_ERROR
        errObj.message =
          "The request conflicted with another request. You may retry the request with the provided Idempotency-Key."
        break
      case MedusaError.Types.UNAUTHORIZED:
        statusCode = 401
        break
      case MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR:
        statusCode = 422
        break
      case MedusaError.Types.DUPLICATE_ERROR:
        statusCode = 422
        errObj.code = INVALID_REQUEST_ERROR
        break
      case MedusaError.Types.NOT_ALLOWED:
      case MedusaError.Types.INVALID_DATA:
        statusCode = 400
        break
      case MedusaError.Types.NOT_FOUND:
        statusCode = 404
        break
      case MedusaError.Types.DB_ERROR:
        statusCode = 500
        errObj.code = API_ERROR
        break
      case MedusaError.Types.UNEXPECTED_STATE:
      case MedusaError.Types.INVALID_ARGUMENT:
        break
      default:
        errObj.code = "unknown_error"
        errObj.message = "An unknown error occurred."
        errObj.type = "unknown_error"
        break
    }

    res.status(statusCode).json(errObj)
  }
}

/**
 * @schema Error
 * title: "Response Error"
 * type: object
 * properties:
 *  code:
 *    type: string
 *    description: A slug code to indicate the type of the error.
 *    enum: [invalid_state_error, invalid_request_error, api_error, unknown_error]
 *  message:
 *    type: string
 *    description: Description of the error that occurred.
 *    example: "first_name must be a string"
 *  type:
 *    type: string
 *    description: A slug indicating the type of the error.
 *    enum: [QueryRunnerAlreadyReleasedError, TransactionAlreadyStartedError, TransactionNotStartedError, conflict, unauthorized, payment_authorization_error, duplicate_error, not_allowed, invalid_data, not_found, database_error, unexpected_state, invalid_argument, unknown_error]
 */
