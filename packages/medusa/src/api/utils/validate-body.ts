import { NextFunction } from "express"
import { z } from "zod"
import { MedusaRequest, MedusaResponse } from "../../types/routing"
import { zodValidator } from "./zod-helper"

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
