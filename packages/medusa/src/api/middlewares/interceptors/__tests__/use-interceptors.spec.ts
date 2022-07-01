import express, { NextFunction, Request, Response } from "express"
import supertest from "supertest"
import { useInterceptors } from "../use-interceptors"
import middlewares from "../../index"
import {
  buildFakeText,
  Test2Interceptor,
  TestInterceptor,
} from "../__fixtures__/interceptos"
import errorHandler from "../../error-handler"
import { asValue, createContainer } from "awilix"
import Logger from "../../../../loaders/logger"

jest.setTimeout(100000)

type Route = { path: string; method: string; handlers: any }

const setup = (routes: Route[]) => {
  const app = express()

  const container = createContainer()
  container.register({
    logger: asValue(Logger)
  })

  app.use((req: Request, res: Response, next: NextFunction) => {
    (req as any).scope = container.createScope()
    next()
  })

  for (const route of routes) {
    app[route.method](route.path, route.handlers)
  }

  app.use(errorHandler())

  return supertest(app)
}

const fakeHandler1 = jest.fn().mockImplementation((req, res) => {
  res.status(200).json({
    handler: "fakeHandler1",
    data: { prop: "fakeProp" },
    ...req.body,
    ...req.query,
  })
})

const fakeHandler2 = jest.fn().mockRejectedValue(new Error("fake error"))

const fakeHandler3 = jest.fn().mockImplementation((req, res) => {
  res.status(200).json({
    handler: "fakeHandler3",
    data: { prop: "fakeProp" },
    ...req.body,
  })
})

describe("useInterceptors", () => {
  let superTest!: supertest.SuperTest<supertest.Test>
  const routes: Route[] = [{
    path: "/intercepted",
    method: "get",
    handlers: [
      useInterceptors([
        new TestInterceptor()
      ]),
      fakeHandler1,
    ]
  }, {
    path: "/intercepted-twice",
    method: "get",
    handlers: [
      useInterceptors([
        new TestInterceptor(),
        new Test2Interceptor()
      ]),
      fakeHandler1,
    ]
  }, {
    path: "/intercepted-twice-error",
    method: "get",
    handlers: [
      useInterceptors([
        new TestInterceptor(),
        new Test2Interceptor()
      ]),
      middlewares.wrap(fakeHandler2),
      middlewares.wrap(fakeHandler3),
    ]
  }]

  beforeAll(() => {
    superTest = setup(routes)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should intercept fakeHandler1 incoming request and outgoing response", async () => {
    const req = superTest[routes[0].method](routes[0].path)
    const subject = await req.send()

    expect(subject).toBeTruthy()
    expect(subject.status).toBe(200)
    expect(subject.body).toEqual({
      handler: "fakeHandler1",
      data: { prop: "fakeProp" },
      [TestInterceptor.name + "body"]: buildFakeText(TestInterceptor.name),
      [TestInterceptor.name]: buildFakeText(TestInterceptor.name),
    })
    expect(subject.req).toBeTruthy()

    expect(fakeHandler1).toHaveBeenCalledTimes(1)
  })

  it("should intercept fakeHandler1 incoming request and outgoing response in chain", async () => {
    const req = superTest[routes[1].method](routes[1].path)
    const subject = await req.send()

    expect(subject).toBeTruthy()
    expect(subject.status).toBe(200)
    expect(subject.body).toEqual({
      handler: "fakeHandler1",
      data: { prop: "fakeProp" },
      [TestInterceptor.name + "body"]: buildFakeText(TestInterceptor.name),
      [Test2Interceptor.name + "body"]: buildFakeText(Test2Interceptor.name),
      [TestInterceptor.name]: buildFakeText(TestInterceptor.name),
      [Test2Interceptor.name]: buildFakeText(Test2Interceptor.name),
    })

    expect(fakeHandler1).toHaveBeenCalledTimes(1)
  })

  it("should manage error cases", async () => {
    const req = superTest[routes[2].method](routes[2].path)
    const subject = await req.send()

    expect(subject).toBeTruthy()
    expect(subject.status).toBe(500)
    expect(subject.body).toEqual({
      "code": "unknown_error",
      "type": "unknown_error",
      "message": "An unknown error occurred.",
    })

    expect(fakeHandler2).toHaveBeenCalledTimes(1)
    expect(fakeHandler3).toHaveBeenCalledTimes(0)
  })

  it("should handle concurrent requests and intercept incoming request and outgoing response in chain", async () => {
    const req1 = superTest[routes[0].method](routes[0].path + "?from=query1")
    const req2 = superTest[routes[1].method](routes[1].path + "?from=query2")

    const [subject1, subject2] = await Promise.all([
      req1.send(),
      req2.send()
    ])

    expect(subject1).toBeTruthy()
    expect(subject1.status).toBe(200)
    expect(subject1.body).toEqual({
      handler: "fakeHandler1",
      data: { prop: "fakeProp" },
      [TestInterceptor.name + "body"]: buildFakeText(TestInterceptor.name),
      [TestInterceptor.name]: buildFakeText(TestInterceptor.name),
      from: "query1",
    })
    
    expect(subject2).toBeTruthy()
    expect(subject2.status).toBe(200)
    expect(subject2.body).toEqual({
      handler: "fakeHandler1",
      data: { prop: "fakeProp" },
      [TestInterceptor.name + "body"]: buildFakeText(TestInterceptor.name),
      [Test2Interceptor.name + "body"]: buildFakeText(Test2Interceptor.name),
      [TestInterceptor.name]: buildFakeText(TestInterceptor.name),
      [Test2Interceptor.name]: buildFakeText(Test2Interceptor.name),
      from: "query2",
    })

    expect(fakeHandler1).toHaveBeenCalledTimes(2)
  })
})
