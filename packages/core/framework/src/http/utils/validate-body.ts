import { z } from "zod"
import { NextFunction } from "express"
import { MedusaRequest, MedusaResponse } from "../types"
import { zodValidator } from "../../zod/zod-helpers"

export function validateAndTransformBody(
  zodSchema:
    | z.ZodObject<any, any>
    | ((
        customSchema?: z.ZodOptional<z.ZodNullable<z.ZodObject<any, any>>>
      ) => z.ZodObject<any, any> | z.ZodEffects<any, any>)
): (
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) => Promise<void> {
  return async function validateBody(
    req: MedusaRequest,
    _: MedusaResponse,
    next: NextFunction
  ) {
    try {
      let schema: z.ZodObject<any, any> | z.ZodEffects<any, any>
      if (typeof zodSchema === "function") {
        schema = zodSchema(req.additionalDataValidator)
      } else {
        schema = zodSchema
      }

      req.validatedBody = await zodValidator(schema, req.body)
      next()
    } catch (e) {
      next(e)
    }
  }
}
