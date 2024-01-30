import { ValidatorOptions } from "class-validator"
import { NextFunction, Request, Response } from "express"
import { ClassConstructor } from "../../types/global"
import { validator } from "../../utils/validator"

export function transformBody<T>(
  plainToClass: ClassConstructor<T>,
  config: ValidatorOptions = {
    forbidUnknownValues: false,
  }
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedBody = await validator(plainToClass, req.body, config)
      next()
    } catch (e) {
      next(e)
    }
  }
}
