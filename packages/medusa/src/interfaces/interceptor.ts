import { Request, Response } from "express"

export interface IInterceptor {
  before(req: Request): Promise<void>
  after<TData = unknown>(
    data: TData,
    rea: Request,
    res: Response
  ): Promise<void>
}

export abstract class Interceptor implements IInterceptor {
  abstract before(req: Request): Promise<void>
  abstract after<TData = unknown>(
    data: TData,
    rea: Request,
    res: Response
  ): Promise<void>
}
