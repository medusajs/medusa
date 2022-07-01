import { NextFunction, Request, Response } from "express"
import { Send } from "express-serve-static-core"
import { Interceptor } from "../../../interfaces"

export function useInterceptors(
  interceptors: Interceptor[]
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next) => {
    const originalResSend = res.send
    const originalResJson = res.json
    const consumedAfterInterceptors = new Set<string>()

    const resetResMethods = () => {
      res.send = originalResSend
      res.json = originalResJson
    }

    const resInterceptor = async <T = unknown>(data: T): Promise<void> => {
      try {
        if (res.statusCode >= 400) {
          // re assign the original response methods in case of an error
          resetResMethods()
          res.json(data)
          return
        }

        for (let i = 0; i < interceptors.length; ++i) {
          if (!(interceptors[i + 1] instanceof Interceptor)) {
            // re assign the original response methods
            // before the last interceptor is called
            resetResMethods()
          }

          const interceptor = interceptors[i]
          const interceptorName = interceptor.constructor.name
          if (consumedAfterInterceptors.has(interceptorName)) {
            // avoid to call multiple times the same interceptor
            // due to the res methods override
            continue
          }

          consumedAfterInterceptors.add(interceptorName)
          await interceptor.after(data, req, res)
        }

        consumedAfterInterceptors.clear()
      } catch (e) {
        next(e)
      }
    }

    res.send = resInterceptor as Send<unknown, never>
    res.json = resInterceptor as Send<unknown, never>

    try {
      for (const interceptor of interceptors) {
        await interceptor.before(req)
      }
      next()
    } catch (e) {
      next(e)
    }
  }
}
