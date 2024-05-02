import { MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { z, ZodError } from "zod"
import { MedusaRequest, MedusaResponse } from "../../types/routing"

export async function zodValidator<T>(
  zodSchema: z.ZodObject<any, any> | z.ZodEffects<any, any>,
  body: T
): Promise<z.ZodRawShape> {
  try {
    return await zodSchema.parseAsync(body)
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
  zodSchema: z.ZodObject<any, any> | z.ZodEffects<any, any>
): (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => Promise<void> {
  return async (req: MedusaRequest, _: MedusaResponse, next: NextFunction) => {
    try {
      req.validatedBody = await zodValidator(zodSchema, req.body)
      next()
    } catch (e) {
      next(e)
    }
  }
}
