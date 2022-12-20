import { NextFunction, Request, Response } from "express"
import { isDefined } from "medusa-core-utils"
import { IEventBusService } from "../../interfaces/services/event-bus"

export default (): ((
  req: Request,
  res: Response,
  next: NextFunction
) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const cacheKey = req.request_context.cache_key
    const eventBusService: IEventBusService =
      req.scope.resolve("eventBusService")

    res.on("finish", () => {
      // Upon finishing the request, we process the cached events
      // If they are already busted (due to an error), the processing
      // will return early.

      if (isDefined(cacheKey)) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        eventBusService.processCachedEvents(cacheKey)
      }
    })
  }
}
