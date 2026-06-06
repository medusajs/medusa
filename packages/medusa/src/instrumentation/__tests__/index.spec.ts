import { resolve } from "path"
import { errorHandlerMock } from "../__fixtures__/routers/middlewares"
import { createServer } from "../__fixtures__/server"
import { instrumentHttpLayer } from "../index"
import { MedusaError } from "@zjedene-medusa/framework/utils"

jest.setTimeout(30000)

jest.mock("../../commands/start", () => {
  return {}
})

describe("HTTP Instrumentation", () => {
  let request

  afterEach(function () {
    jest.clearAllMocks()
  })

  beforeAll(async function () {
    instrumentHttpLayer()

    const rootDir = resolve(__dirname, "../__fixtures__/routers")

    const { request: request_ } = await createServer(rootDir)

    request = request_
  })

  describe("traceRoute", () => {
    it("should be handled by the error handler when a route fails", async () => {
      const res = await request("GET", "/admin/fail", {
        adminSession: {
          jwt: {
            userId: "admin_user",
          },
        },
      })

      expect(res.status).toBe(400)
      expect(errorHandlerMock).toHaveBeenCalled()
      expect(errorHandlerMock).toHaveBeenCalledWith(
        new MedusaError(MedusaError.Types.INVALID_DATA, "Failed"),
        expect.anything(),
        expect.anything(),
        expect.anything()
      )
    })
  })
})
