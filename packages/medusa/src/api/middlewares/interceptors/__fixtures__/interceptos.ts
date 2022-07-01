import { Interceptor } from "../../../../interfaces"
import { Request, Response } from "express"

export const buildFakeText = (name: string) => {
  return `by ${name} interceptor`
}

export class TestInterceptor extends Interceptor {
  async before(req: Request): Promise<void> {
    req.body = {
      ...req.body,
      [TestInterceptor.name + "body"]: buildFakeText(TestInterceptor.name),
    }
  }

  async after<TData = unknown>(
    data: TData,
    req: Request,
    res: Response
  ): Promise<void> {
    data[TestInterceptor.name] = buildFakeText(TestInterceptor.name)
    res.json(data)
  }
}

export class Test2Interceptor extends Interceptor {
  async before(req: Request): Promise<void> {
    req.body = {
      ...req.body,
      [Test2Interceptor.name + "body"]: buildFakeText(Test2Interceptor.name),
    }
  }

  async after<TData = unknown>(
    data: TData,
    req: Request,
    res: Response
  ): Promise<void> {
    data[Test2Interceptor.name] = buildFakeText(Test2Interceptor.name)
    res.json(data)
  }
}
