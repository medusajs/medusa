import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { Return } from "../admin/return"
import { Client } from "../client"

const baseUrl = "https://someurl.com"
const returnId = "return_123"
const mockReturn = { id: returnId }

const server = setupServer(
  http.post(`${baseUrl}/admin/returns/${returnId}/cancel`, () => {
    return HttpResponse.json({ return: mockReturn })
  }),
  http.delete(`${baseUrl}/admin/returns/${returnId}/request`, () => {
    return HttpResponse.json({ return: mockReturn })
  }),
  http.all("*", ({ request }) => {
    return new HttpResponse(
      JSON.stringify({ message: `Unexpected request: ${request.method} ${request.url}` }),
      { status: 404 }
    )
  })
)

describe("Admin Return SDK", () => {
  let returnSdk: Return

  beforeAll(() => {
    const client = new Client({ baseUrl })
    returnSdk = new Return(client)
    server.listen()
  })
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe("cancel", () => {
    it("should call POST /admin/returns/:id/cancel", async () => {
      const result = await returnSdk.cancel(returnId)
      expect(result).toEqual({ return: mockReturn })
    })
  })

  describe("cancelRequest", () => {
    it("should call DELETE /admin/returns/:id/request", async () => {
      const result = await returnSdk.cancelRequest(returnId)
      expect(result).toEqual({ return: mockReturn })
    })
  })

  describe("cancel vs cancelRequest", () => {
    it("should call different endpoints and HTTP methods", async () => {
      const calls: string[] = []

      server.use(
        http.post(`${baseUrl}/admin/returns/${returnId}/cancel`, () => {
          calls.push("POST /cancel")
          return HttpResponse.json({ return: mockReturn })
        }),
        http.delete(`${baseUrl}/admin/returns/${returnId}/request`, () => {
          calls.push("DELETE /request")
          return HttpResponse.json({ return: mockReturn })
        })
      )

      await returnSdk.cancel(returnId)
      await returnSdk.cancelRequest(returnId)

      expect(calls).toEqual(["POST /cancel", "DELETE /request"])
    })
  })
})
