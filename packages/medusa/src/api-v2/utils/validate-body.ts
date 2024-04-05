import { MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { z, ZodError, ZodIssue } from "zod"
import { MedusaRequest, MedusaResponse } from "../../types/routing"

const reduceErrorMessages = (errs: ZodIssue[]): string[] => {
  return errs.reduce((acc: string[], next) => {
    acc.push(next.message)
    return acc
  }, [])
}

/**
 * On schema validation error, will throw 400 with error message:
 *  `Unrecognized key(s) in object: 'first_name', 'last_name'`
 */
export async function zodValidator<T>(
  zodSchema: z.ZodObject<any, any>,
  body: T,
  config: { strict?: boolean } = { strict: true }
): Promise<z.ZodRawShape> {
  try {
    let schema = zodSchema
    if (config.strict) {
      schema = schema.strict()
    }

    return await schema.parseAsync(body)
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessages = reduceErrorMessages(err.errors)

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        errorMessages.join(", ")
      )
    }

    throw err
  }
}

export function validateAndTransformBody(
  zodSchema: z.ZodObject<any, any>,
  config?: {
    strict?: boolean
  }
): (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => Promise<void> {
  return async (req: MedusaRequest, _: MedusaResponse, next: NextFunction) => {
    try {
      req.validatedBody = await zodValidator(zodSchema, req.body, config)
      next()
    } catch (e) {
      next(e)
    }
  }
}
