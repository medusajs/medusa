import { ValidatorOptions } from "class-validator"
import { NextFunction, Request, Response } from "express"
import { validator } from "medusa-core-utils"
import { ClassConstructor } from "../../types/global"

export function transformBody<T>(
  plainToClass: ClassConstructor<T>,
  config: ValidatorOptions = {}
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
