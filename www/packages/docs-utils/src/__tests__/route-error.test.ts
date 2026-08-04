import { describe, expect, test, vi } from "vitest"
import {
  RouteError,
  throwErrorResponse,
  withRouteErrorHandling,
} from "../route-error.js"

describe("withRouteErrorHandling", () => {
  test("returns the handler's response when nothing throws", async () => {
    const handler = withRouteErrorHandling(async () =>
      Response.json({ ok: true })
    )

    const res = await handler()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  test("converts a thrown error response to JSON with its status", async () => {
    const handler = withRouteErrorHandling(async () => {
      throwErrorResponse(404, "Spec not found")
      return new Response()
    })

    const res = await handler()

    expect(res.status).toBe(404)
    expect(res.headers.get("Content-Type")).toBe("application/json")
    expect(await res.json()).toEqual({
      error: {
        status: 404,
        name: "NotFound",
        message: "Spec not found",
      },
    })
  })

  test("uses a custom error name when passed", async () => {
    const handler = withRouteErrorHandling(async () => {
      throwErrorResponse(418, "Nope", "Teapot")
      return new Response()
    })

    expect(await (await handler()).json()).toEqual({
      error: { status: 418, name: "Teapot", message: "Nope" },
    })
  })

  test("converts an unexpected error to a 500 JSON response", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const handler = withRouteErrorHandling(async () => {
      throw new Error("boom")
    })

    const res = await handler()

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      error: {
        status: 500,
        name: "InternalServerError",
        message: "boom",
      },
    })
    consoleError.mockRestore()
  })

  test("passes the handler's arguments through", async () => {
    const handler = withRouteErrorHandling(
      async (request: Request, ctx: { params: Promise<{ id: string }> }) =>
        Response.json({
          url: request.url,
          id: (await ctx.params).id,
        })
    )

    const res = await handler(new Request("https://docs.medusajs.com/x"), {
      params: Promise.resolve({ id: "1" }),
    })

    expect(await res.json()).toEqual({
      url: "https://docs.medusajs.com/x",
      id: "1",
    })
  })
})

describe("RouteError", () => {
  test("falls back to a generic name for unmapped statuses", () => {
    expect(new RouteError(499, "closed").body).toEqual({
      error: { status: 499, name: "Error", message: "closed" },
    })
  })
})
