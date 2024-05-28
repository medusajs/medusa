import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

import { Client, FetchError, PUBLISHABLE_KEY_HEADER } from "../client"

const baseUrl = "https://someurl.com"

// This is just a network-layer mocking, it doesn't start an actual server
const server = setupServer(
  http.get(`${baseUrl}/test`, ({ request, params, cookies }) => {
    return HttpResponse.json({
      test: "test",
    })
  }),
  http.get(`${baseUrl}/throw`, ({ request, params, cookies }) => {
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
  http.get(`${baseUrl}/header`, ({ request, params, cookies }) => {
    if (
      request.headers.get("X-custom-header") === "test" &&
      request.headers.get("Content-Type") === "application/json"
    ) {
      return HttpResponse.json({
        test: "test",
      })
    }
  }),
  http.get(`${baseUrl}/replaced-header`, ({ request, params, cookies }) => {
    request.headers
    if (request.headers.get("Content-Type") === "application/xml") {
      return HttpResponse.json({
        test: "test",
      })
    }
  }),
  http.get(`${baseUrl}/apikey`, ({ request, params, cookies }) => {
    if (request.headers.get("authorization")?.startsWith("Basic")) {
      return HttpResponse.json({
        test: "test",
      })
    }
  }),
  http.get(`${baseUrl}/pubkey`, ({ request, params, cookies }) => {
    if (request.headers.get(PUBLISHABLE_KEY_HEADER) === "test-pub-key") {
      return HttpResponse.json({
        test: "test",
      })
    }
  }),
  http.post(`${baseUrl}/create`, async ({ request, params, cookies }) => {
    return HttpResponse.json(await request.json())
  }),
  http.delete(`${baseUrl}/delete/123`, async ({ request, params, cookies }) => {
    return HttpResponse.json({ test: "test" })
  }),
  http.get(`${baseUrl}/jwt`, ({ request, params, cookies }) => {
    if (request.headers.get("authorization") === "Bearer token-123") {
      return HttpResponse.json({
        test: "test",
      })
    }
  }),
  http.all("*", ({ request, params, cookies }) => {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Not Found",
    })
  })
)

describe("Client", () => {
  let client: Client
  beforeAll(() => {
    client = new Client({
      baseUrl,
    })

    server.listen()
  })
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe("header configuration", () => {
    it("should allow passing custom request headers while the defaults are preserved", async () => {
      const resp = await client.fetch<any>("header", {
        headers: { "X-custom-header": "test" },
      })

      expect(resp).toEqual({ test: "test" })
    })

    it("should allow replacing a default header", async () => {
      const resp = await client.fetch<any>("replaced-header", {
        headers: { "content-Type": "application/xml" },
      })

      expect(resp).toEqual({ test: "test" })
    })

    it("should allow passing global headers", async () => {
      const headClient = new Client({
        baseUrl,
        globalHeaders: {
          "X-custom-header": "test",
        },
      })

      const resp = await headClient.fetch<any>("header")
      expect(resp).toEqual({ test: "test" })
    })

    it("should allow setting an API key", async () => {
      const authClient = new Client({
        baseUrl,
        apiKey: "test-api-key",
      })

      const resp = await authClient.fetch<any>("apikey")
      expect(resp).toEqual({ test: "test" })
    })

    it("should allow setting a publishable key", async () => {
      const pubClient = new Client({
        baseUrl,
        publishableKey: "test-pub-key",
      })

      const resp = await pubClient.fetch<any>("pubkey")
      expect(resp).toEqual({ test: "test" })
    })
  })

  describe("GET requests", () => {
    it("should fire a simple GET request and get back a JSON response by default", async () => {
      const resp = await client.fetch<{ test: string }>("test")
      expect(resp).toEqual({ test: "test" })
    })

    it("should throw an exception if a non-2xx status is received", async () => {
      const err: FetchError = await client.fetch<any>("throw").catch((e) => e)
      expect(err.status).toEqual(500)
      expect(err.message).toEqual("Internal Server Error")
    })
  })

  describe("POST requests", () => {
    it("should fire a simple POST request and get back a JSON response", async () => {
      const resp = await client.fetch<any>("create", {
        body: { test: "test" },
        method: "POST",
      })
      expect(resp).toEqual({ test: "test" })
    })
  })

  describe("DELETE requests", () => {
    it("should fire a simple DELETE request and get back a JSON response", async () => {
      const resp = await client.fetch<any>("delete/123", {
        method: "DELETE",
      })
      expect(resp).toEqual({ test: "test" })
    })
  })

  describe("Authrized requests", () => {
    it("should set the token in memory by default", async () => {
      const token = "token-123" // Eg. from a response after a successful authentication
      client.setToken(token)

      const resp = await client.fetch<any>("jwt")
      expect(resp).toEqual({ test: "test" })
    })

    it("should set the token in local storage if in browser", async () => {
      // We are mimicking a browser environment here
      global.window = {
        localStorage: { setItem: jest.fn(), getItem: () => token } as any,
      } as any

      const token = "token-123" // Eg. from a response after a successful authentication
      client.setToken(token)

      const resp = await client.fetch<any>("jwt")
      expect(resp).toEqual({ test: "test" })
      expect(global.window.localStorage.setItem).toHaveBeenCalledWith(
        "medusa_auth_token",
        token
      )

      // Cleaning up after this specific test
      global.window = undefined as any
    })
  })
})
