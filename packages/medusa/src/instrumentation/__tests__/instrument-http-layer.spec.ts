import { EventEmitter } from "events"

type MockRes = EventEmitter & {
  statusCode: number
  statusMessage: string
  writableFinished?: boolean
}

const createMockRes = (): MockRes => {
  return Object.assign(new EventEmitter(), {
    statusCode: 200,
    statusMessage: "OK",
  })
}

const createMockReq = () => ({
  url: "/store/products?limit=1",
  method: "GET",
  headers: {},
})

describe("instrumentHttpLayer | traceRequestHandler", () => {
  let spans: any[]
  let traceRequestHandler: (...args: any[]) => Promise<any>

  beforeAll(() => {
    const { Tracer } = jest.requireActual("@medusajs/framework/telemetry")
    // Capture every ended span so assertions can inspect the recorded status
    ;(Tracer.prototype as any).trace = async function (
      this: any,
      name: string,
      fn: (span: any) => Promise<any>
    ) {
      const span = {
        attributes: {} as any,
        status: undefined as any,
        setAttributes(attrs: any) {
          Object.assign(this.attributes, attrs)
        },
        setStatus(status: any) {
          this.status = status
        },
        end() {
          spans.push({ name, ...this })
        },
      }
      return await fn(span)
    }

    // Mock the start command module with a plain object so the production
    // assignment `startCommand.traceRequestHandler = ...` lands somewhere
    // we can read back (the real module compiles to getter-only exports
    // under jest's transformer)
    let startModule: any
    jest.doMock("../../commands/start", () => {
      startModule = {}
      return startModule
    })

    const { instrumentHttpLayer } = require("../index")
    instrumentHttpLayer()
    traceRequestHandler = startModule.traceRequestHandler
  })

  beforeEach(() => {
    spans = []
  })

  it("ends the span only after the response finishes, recording the final status code", async () => {
    const res = createMockRes()
    const req = createMockReq()

    // requestHandler mimics express app(req, res): returns at dispatch time,
    // long before the response is actually written
    const traced = traceRequestHandler(async () => {}, req, res)

    // Let the handler run to completion (dispatch done). The span must NOT
    // have ended here - the response is still pending.
    await new Promise((resolve) => setImmediate(resolve))
    expect(spans).toHaveLength(0)

    // The real response completes later with a non-200 code
    res.statusCode = 404
    res.statusMessage = "Not Found"
    res.emit("finish")

    await traced

    expect(spans).toHaveLength(1)
    expect(spans[0].attributes["http.statusCode"]).toBe(404)
    expect(spans[0].status).toBeUndefined()
  })

  it("sets the ERROR status when the finished response reports a server error", async () => {
    const res = createMockRes()
    const req = createMockReq()

    const traced = traceRequestHandler(
      async () => {},
      req,
      res,
      "GET /store/products"
    )

    await new Promise((resolve) => setImmediate(resolve))
    res.statusCode = 500
    res.statusMessage = "Internal Server Error"
    res.emit("finish")

    await traced

    expect(spans).toHaveLength(1)
    expect(spans[0].attributes["http.statusCode"]).toBe(500)
    expect(spans[0].status).toEqual({
      code: 2,
      message: "Failed with Internal Server Error",
    })
  })

  it("still ends the span when the client disconnects before the response is written", async () => {
    const res = createMockRes()
    const req = createMockReq()

    const traced = traceRequestHandler(async () => {}, req, res)

    await new Promise((resolve) => setImmediate(resolve))
    res.emit("close")

    await traced

    expect(spans).toHaveLength(1)
  })

  it("passes through without tracing when the resource is excluded", async () => {
    const res = createMockRes()
    const req = createMockReq()
    req.url = "/.vite/whatever.js"

    const requestHandler = jest.fn().mockResolvedValue(undefined)
    await traceRequestHandler(requestHandler, req, res)

    expect(requestHandler).toHaveBeenCalledTimes(1)
    expect(spans).toHaveLength(0)
  })

  it("still ends the span when the request handler throws before the response finishes", async () => {
    const res = createMockRes()
    const req = createMockReq()

    const traced = traceRequestHandler(
      async () => {
        throw new Error("boom")
      },
      req,
      res
    )

    await expect(traced).rejects.toThrow("boom")
    expect(spans).toHaveLength(1)
    // listeners are cleaned up once the span ends
    expect(res.listenerCount("finish")).toBe(0)
    expect(res.listenerCount("close")).toBe(0)
  })

  it("ends the span immediately when the handler already finished the response synchronously", async () => {
    const res = createMockRes()
    const req = createMockReq()

    const traced = traceRequestHandler(
      async () => {
        // a synchronous route that wrote and ended the response before
        // returning - "finish" was emitted before we could listen for it
        res.writableFinished = true
        res.statusCode = 201
      },
      req,
      res
    )

    await traced

    expect(spans).toHaveLength(1)
    expect(spans[0].attributes["http.statusCode"]).toBe(201)
  })
})
