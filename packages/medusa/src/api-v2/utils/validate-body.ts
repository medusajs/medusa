import { MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { z, ZodError } from "zod"
import { MedusaRequest, MedusaResponse } from "../../types/routing"

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
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid request body: ${JSON.stringify(err.errors)}`
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
