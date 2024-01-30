import { NextFunction } from "express"
import { z, ZodError, ZodIssue } from "zod"
import { MedusaError } from "../common"

const reduceErrorMessages = (errs: ZodIssue[]): string[] => {
  return errs.reduce((acc: string[], next) => {
    acc.push(next.message)
    return acc
  }, [])
}

export async function zodValidator<T, V>(
  zodSchema: z.ZodType,
  body: V
): Promise<T> {
  try {
    return await zodSchema.parseAsync(body)
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

export function validateBody<T>(
  zodSchema: z.ZodType
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      req.validatedBody = await zodValidator(zodSchema, req.body)
      next()
    } catch (e) {
      next(e)
    }
  }
}
