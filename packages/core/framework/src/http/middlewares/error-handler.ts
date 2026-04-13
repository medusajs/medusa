import { ErrorRequestHandler, NextFunction, Response } from "express"
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

    err = formatException(err)

    // 🔥 FIX: Handle malformed JSON
    if (
      err instanceof SyntaxError &&
      "body" in err &&
      (err as any).type === "entity.parse.failed"
    ) {
      return res.status(400).json({
        code: INVALID_REQUEST_ERROR,
        message: "Invalid JSON in request body",
        type: INVALID_REQUEST_ERROR,
      })
    }

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
      case MedusaError.Types.FORBIDDEN:
        statusCode = 403
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

    if (statusCode >= 500) {
      logger.error(err)
    } else {
      logger.info(err.message)
    }

    if ("issues" in err && Array.isArray(err.issues)) {
      const messages = err.issues.map((issue) =>
        fromZodIssue(issue).toString()
      )
      res.status(statusCode).json({
        type: MedusaError.Types.INVALID_DATA,
        message: messages.join("\n"),
      })
      return
    }

    res.status(statusCode).json(errObj)
  } as unknown as ErrorRequestHandler
}