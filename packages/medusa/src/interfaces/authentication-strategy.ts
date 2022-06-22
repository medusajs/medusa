import { Express, NextFunction, Request, Response } from "express"
import { TransactionBaseService } from "./index"
import { MedusaContainer } from "../types/global"

export interface IAuthenticationStrategy<
  T extends TransactionBaseService<never>
> extends TransactionBaseService<T> {
  afterInit(app: Express): Promise<void>
  authenticate(req: Request, res: Response): Promise<void>
  unAuthenticate(req: Request, res: Response): Promise<void>
  validate(req: Request, res: Response, next: NextFunction): Promise<void>
}

export default abstract class AbstractAuthStrategy<
    T extends TransactionBaseService<never>
  >
  extends TransactionBaseService<T>
  implements IAuthenticationStrategy<T>
{
  static identifier: string

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(app: Express): Promise<void> {
    return Promise.resolve()
  }

  abstract authenticate(req: Request, res: Response): Promise<void>

  abstract unAuthenticate(req: Request, res: Response): Promise<void>

  abstract validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>
}

export function isAuthStrategy(obj: unknown): boolean {
  return obj instanceof AbstractAuthStrategy
}
