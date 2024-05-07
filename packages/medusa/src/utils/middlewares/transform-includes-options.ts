import { NextFunction, Request, Response } from "express"
import { MedusaError } from "medusa-core-utils"

/**
 * Retrieve the includes options from the fields query param.
 * If the include option is present then assigned it to includes on req
 * @param allowedIncludes The list of fields that can be passed and assign to req.includes
 * @param expectedIncludes The list of fields that the consumer can pass to the end point using this middleware. It is a subset of `allowedIncludes`
 */
export function transformIncludesOptions(
  allowedIncludes: string[] = [],
  expectedIncludes: string[] = []
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedIncludes.length || !req.query.expand) {
      return next()
    }

    const expand = (req.query.expand as string).split(",") ?? []

    for (const includes of allowedIncludes) {
      const fieldIndex = expand.indexOf(includes) ?? -1

      const isPresent = fieldIndex !== -1

      if (isPresent) {
        expand.splice(fieldIndex, 1)

        if (!expectedIncludes.includes(includes)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `The field "${includes}" is not supported by this end point. ${
              expectedIncludes.length
                ? `The includes fields can be one of entity properties or in [${expectedIncludes.join(
                    ", "
                  )}]`
                : ""
            }`
          )
        }

        req.includes = req.includes ?? {}
        req.includes[includes] = true
      }
    }

    if (req.query.expand) {
      if (expand.length) {
        req.query.expand = expand.join(",")
      } else {
        delete req.query.expand
      }
    }

    next()
  }
}
