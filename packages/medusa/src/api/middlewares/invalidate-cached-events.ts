import { NextFunction, Request, Response } from "express"
import { MedusaError } from "medusa-core-utils"
import { IEventBusService } from "../../interfaces/services/event-bus"

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
    const cacheKey = req.request_context.cache_key
    const eventBusService: IEventBusService =
      req.scope.resolve("eventBusService")

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    eventBusService.destroyCachedEvents(cacheKey)

    next(err)
  }
}
