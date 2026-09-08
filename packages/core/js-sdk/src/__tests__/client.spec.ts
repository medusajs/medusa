import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

import { Client, FetchError, PUBLISHABLE_KEY_HEADER } from "../client"

const baseUrl = "https://someurl.com"
const token = "token-123"
const jwtTokenStorageKey = "medusa_auth_token"

// This is just a network-layer mocking, it doesn't start an actual server
const server = setupServer(
  http.get(`${baseUrl}/test`, ({ request, params, cookies }) => {
    return HttpResponse.json({
      test: "test",
    })
  }),
  http.get(`${baseUrl}/some/path/test`, ({ request, params, cookies }) => {
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
  http.get(`${baseUrl}/header`, ({ request }) => {
    if (
      request.headers.get("X-custom-header") === "test" &&
      request.headers.get("Content-Type") === "application/json"
    ) {
      return HttpResponse.json({
        test: "test",
      })
    }
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
  http.get(`${baseUrl}/replaced-header`, ({ request }) => {
    if (request.headers.get("Content-Type") === "application/xml") {
      return HttpResponse.json({
        test: "test",
      })
    }
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
  http.get(`${baseUrl}/apikey`, ({ request }) => {
    if (request.headers.get("authorization")?.startsWith("Basic")) {
      return HttpResponse.json({
        test: "test",
      })
    }
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
  http.get(`${baseUrl}/pubkey`, ({ request }) => {
    if (request.headers.get(PUBLISHABLE_KEY_HEADER) === "test-pub-key") {
      return HttpResponse.json({
        test: "test",
      })
    }
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
  http.post(`${baseUrl}/create`, async ({ request, params, cookies }) => {
    return HttpResponse.json(await request.json())
  }),
  http.delete(`${baseUrl}/delete/123`, async ({ request, params, cookies }) => {
    return HttpResponse.json({ test: "test" })
  }),
  http.get(`${baseUrl}/jwt`, ({ request }) => {
    if (request.headers.get("authorization") === `Bearer ${token}`) {
      return HttpResponse.json({
        test: "test",
      })
    }
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
  http.get(`${baseUrl}/nostore`, ({ request }) => {
    if (!request.headers.get("authorization")) {
      return HttpResponse.json({
        test: "test",
      })
    }

    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }),
  http.get(`https://test.com/baseUrl`, ({ request, params, cookies }) => {
    return HttpResponse.json({
      test: "test",
    })
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

  describe("configuration", () => {
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

    it("should gracefully handle a root base URL", async () => {
      global.window = {
        location: {
          origin: "https://test.com",
        },
      } as any

      const pubClient = new Client({
        baseUrl: "/",
      })

      const resp = await pubClient.fetch<any>("baseUrl")
      expect(resp).toEqual({ test: "test" })

      global.window = undefined as any
    })

    it("should handle baseUrl with path correctly", async () => {
      const pathClient = new Client({
        baseUrl: `${baseUrl}/some/path`,
      })

      const resp = await pathClient.fetch<any>("test")
      expect(resp).toEqual({ test: "test" })
    })

    it("should handle baseUrl with trailing slash path correctly", async () => {
      const pathClient = new Client({
        baseUrl: `${baseUrl}/some/path/`,
      })

      const resp = await pathClient.fetch<any>("test")
      expect(resp).toEqual({ test: "test" })
    })

    it("should handle baseUrl with just origin", async () => {
      const originClient = new Client({
        baseUrl,
      })

      const resp = await originClient.fetch<any>("test")
      expect(resp).toEqual({ test: "test" })
    })

    it("should handle baseUrl with just origin and trailing slash", async () => {
      const originClient = new Client({
        baseUrl: `${baseUrl}/`,
      })

      const resp = await originClient.fetch<any>("test")
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

  describe("Authorized requests", () => {
    it("should not store the token by default", async () => {
      client.setToken(token)

      const resp = await client.fetch<any>("nostore")
      expect(resp).toEqual({ test: "test" })
    })

    it("should set the token in local storage if in browser", async () => {
      // We are mimicking a browser environment here
      global.window = {
        localStorage: { setItem: jest.fn(), getItem: () => token } as any,
      } as any

      client.setToken(token)

      const resp = await client.fetch<any>("jwt")
      expect(resp).toEqual({ test: "test" })
      expect(global.window.localStorage.setItem).toHaveBeenCalledWith(
        jwtTokenStorageKey,
        token
      )

      // Cleaning up after this specific test
      global.window = undefined as any
    })

    it("should fall back to no storage when browser storage access is blocked", async () => {
      global.window = {} as any

      Object.defineProperties(global.window, {
        localStorage: {
          get: () => {
            throw new Error("localStorage is blocked")
          },
        },
        sessionStorage: {
          get: () => {
            throw new Error("sessionStorage is blocked")
          },
        },
      })

      const blockedStorageClient = new Client({
        baseUrl,
      })

      await blockedStorageClient.setToken(token)

      const resp = await blockedStorageClient.fetch<any>("nostore")
      expect(resp).toEqual({ test: "test" })

      // Cleaning up after this specific test
      global.window = undefined as any
    })
  })

  describe("Custom Storage", () => {
    const mockSyncStorage = {
      storage: new Map<string, string>(),
      getItem: jest.fn(
        (key: string) => mockSyncStorage.storage.get(key) || null
      ),
      setItem: jest.fn((key: string, value: string) =>
        mockSyncStorage.storage.set(key, value)
      ),
      removeItem: jest.fn((key: string) => mockSyncStorage.storage.delete(key)),
    }

    const mockAsyncStorage = {
      storage: new Map<string, string>(),
      getItem: jest.fn(
        async (key: string) => mockAsyncStorage.storage.get(key) || null
      ),
      setItem: jest.fn(async (key: string, value: string) =>
        mockAsyncStorage.storage.set(key, value)
      ),
      removeItem: jest.fn(async (key: string) =>
        mockAsyncStorage.storage.delete(key)
      ),
    }

    describe("Synchronous Custom Storage", () => {
      let client: Client

      beforeEach(() => {
        mockSyncStorage.storage.clear()
        client = new Client({
          baseUrl,
          auth: {
            type: "jwt",
            jwtTokenStorageMethod: "custom",
            storage: mockSyncStorage,
          },
        })
      })

      it("should store and retrieve token", async () => {
        await client.setToken(token)
        expect(mockSyncStorage.setItem).toHaveBeenCalledWith(
          jwtTokenStorageKey,
          token
        )
        const resp = await client.fetch<any>("jwt")
        expect(resp).toEqual({ test: "test" })
        expect(mockSyncStorage.getItem).toHaveBeenCalledWith(jwtTokenStorageKey)
      })

      it("should clear token", async () => {
        await client.setToken(token)
        await client.clearToken()
        const resp = await client.fetch<any>("nostore")
        expect(resp).toEqual({ test: "test" })
      })
    })

    describe("Asynchronous Custom Storage", () => {
      let client: Client

      beforeEach(() => {
        mockAsyncStorage.storage.clear()
        jest.clearAllMocks()
        client = new Client({
          baseUrl,
          auth: {
            type: "jwt",
            jwtTokenStorageMethod: "custom",
            storage: mockAsyncStorage,
          },
        })
      })

      it("should store and retrieve token asynchronously", async () => {
        await client.setToken(token)

        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
          jwtTokenStorageKey,
          token
        )

        const resp = await client.fetch<any>("jwt")
        expect(resp).toEqual({ test: "test" })
        expect(mockAsyncStorage.getItem).toHaveBeenCalled()
      })

      it("should clear token asynchronously", async () => {
        await client.setToken(token)
        await client.clearToken()

        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
          jwtTokenStorageKey
        )

        const resp = await client.fetch<any>("nostore")
        expect(resp).toEqual({ test: "test" })
      })
    })
  })
})
