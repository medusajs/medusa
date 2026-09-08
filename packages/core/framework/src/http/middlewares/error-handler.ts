import { ErrorRequestHandler, NextFunction, Response } from "express"
import createHttpError from "http-errors"
import { fromZodIssue } from "zod-validation-error"

import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import { MedusaRequest } from "../types"
import { formatException } from "./exception-formatter"

const QUERY_RUNNER_RELEASED = "QueryRunnerAlreadyReleasedError"
const TRANSACTION_STARTED = "TransactionAlreadyStartedError"
const TRANSACTION_NOT_STARTED = "TransactionNotStartedError"

const API_ERROR = "api_error"
const INVALID_REQUEST_ERROR = "invalid_request_error"
const INVALID_STATE_ERROR = "invalid_state_error"

export type ErrorHttpResponse = {
  statusCode: number
  body: { code?: string; type?: string; message?: string }
}

/**
 * Resolves the status code and the response body an error will be converted
 * into by the error handler.
 *
 * The error handler runs at the very end of the request lifecycle, whereas
 * instrumentation has to classify an error the moment it is thrown (eg. to
 * know whether a handled 4xx or an internal error is being reported to a
 * tracing backend). Exposing the mapping lets both agree on the outcome
 * without duplicating it.
 */
export function getHttpResponseFromError(err: any): ErrorHttpResponse {
  // errors from body-parser and other express internals
  if (createHttpError.isHttpError(err)) {
    return {
      statusCode: err.statusCode,
      body: {
        message:
          err.statusCode < 500 ? err.message : "An unknown error occurred.",
        type: mapStatusCodeToErrorType(err.statusCode),
      },
    }
  }

  const error = formatException(err)
  const errorType = error.type || error.name
  const body: ErrorHttpResponse["body"] = {
    code: error.code,
    type: error.type,
    message: error.message,
  }

  let statusCode = 500
  switch (errorType) {
    case QUERY_RUNNER_RELEASED:
    case TRANSACTION_STARTED:
    case TRANSACTION_NOT_STARTED:
    case MedusaError.Types.CONFLICT:
      statusCode = 409
      body.code = INVALID_STATE_ERROR
      body.message =
        "The request conflicted with another request. You may retry the request with the provided Idempotency-Key."
      break
    case MedusaError.Types.UNAUTHORIZED:
      statusCode = 401
      break
    case MedusaError.Types.FORBIDDEN:
      statusCode = 403
      break
    case MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR:
      statusCode = 422
      break
    case MedusaError.Types.DUPLICATE_ERROR:
      statusCode = 422
      body.code = INVALID_REQUEST_ERROR
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
      body.code = API_ERROR
      break
    case MedusaError.Types.UNEXPECTED_STATE:
    case MedusaError.Types.INVALID_ARGUMENT:
      break
    default:
      body.code = "unknown_error"
      body.message = "An unknown error occurred."
      body.type = "unknown_error"
      break
  }

  return { statusCode, body }
}

export function errorHandler() {
  return function coreErrorHandler(
    err: MedusaError,
    req: MedusaRequest,
    res: Response,
    _: NextFunction
  ) {
    const logger = req.scope
      ? req.scope.resolve(ContainerRegistrationKeys.LOGGER)
      : console

    if (!req.scope) {
      logger.error(
        "req.scope is missing unexpectedly. It should be defined in all the cases"
      )
    }

    const { statusCode, body } = getHttpResponseFromError(err)

    // handle errors from body-parser
    if (createHttpError.isHttpError(err)) {
      if (statusCode >= 500) {
        logger.error(`Error ${statusCode} at ${req.path}`, err)
      } else {
        logger.info(`Error ${statusCode} at ${req.path}: ${err.message}`)
      }

      res.status(statusCode).json(body)
      return
    }

    err = formatException(err)

    if (statusCode >= 500) {
      logger.error(err)
    } else {
      logger.info(err.message)
    }

    if ("issues" in err && Array.isArray(err.issues)) {
      const messages = err.issues.map((issue) => fromZodIssue(issue).toString())
      res.status(statusCode).json({
        type: MedusaError.Types.INVALID_DATA,
        message: messages.join("\n"),
      })
      return
    }

    res.status(statusCode).json(body)
  } as unknown as ErrorRequestHandler
}

// This is just to keep the promise of returning a type, but for bodyparse or other http errors,
// we probably don't need to return a type
const mapStatusCodeToErrorType = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return MedusaError.Types.INVALID_DATA
    case 401:
      return MedusaError.Types.UNAUTHORIZED
    case 403:
      return MedusaError.Types.FORBIDDEN
    case 404:
      return MedusaError.Types.NOT_FOUND
    case 409:
      return MedusaError.Types.CONFLICT
    default:
      return "unknown_error"
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
