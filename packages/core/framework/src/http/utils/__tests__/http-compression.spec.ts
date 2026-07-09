import { ContainerRegistrationKeys } from "@medusajs/utils"
import express from "express"
import supertest from "supertest"
import type { ProjectConfigOptions } from "../../../config"
import {
  compressionOptions,
  createCompressionMiddleware,
} from "../http-compression"

const LARGE_BODY = "a".repeat(5000)

function createTestApp(
  config: ProjectConfigOptions,
  { withScope = true }: { withScope?: boolean } = {}
) {
  const app = express()

  const middleware = createCompressionMiddleware(config)
  if (middleware) {
    app.use(middleware)
  }

  if (withScope) {
    app.use((req: any, _res, next) => {
      req.scope = {
        resolve: (key: string) =>
          key === ContainerRegistrationKeys.CONFIG_MODULE
            ? { projectConfig: config }
            : undefined,
      }
      next()
    })
  }

  app.get("/", (_req, res) => {
    res.type("text/plain").send(LARGE_BODY)
  })

  return supertest(app)
}

describe("compressionOptions", () => {
  it("applies defaults when compression is not configured", () => {
    expect(compressionOptions({} as ProjectConfigOptions)).toEqual({
      enabled: false,
      level: 6,
      memLevel: 8,
      threshold: 1024,
    })
  })
})

describe("createCompressionMiddleware", () => {
  it("returns null when compression is disabled", () => {
    expect(
      createCompressionMiddleware({
        http: { compression: { enabled: false } },
      } as ProjectConfigOptions)
    ).toBeNull()
  })

  it("returns a middleware when compression is enabled", () => {
    expect(
      typeof createCompressionMiddleware({
        http: { compression: { enabled: true } },
      } as ProjectConfigOptions)
    ).toBe("function")
  })

  it("gzip-compresses responses above the threshold when enabled", async () => {
    const request = createTestApp({
      http: { compression: { enabled: true, threshold: 0 } },
    } as ProjectConfigOptions)

    const res = await request
      .get("/")
      .set("Accept-Encoding", "gzip")
      .expect(200)

    expect(res.headers["content-encoding"]).toBe("gzip")
  })

  it("does not compress when the client sends x-no-compression", async () => {
    const request = createTestApp({
      http: { compression: { enabled: true, threshold: 0 } },
    } as ProjectConfigOptions)

    const res = await request
      .get("/")
      .set("Accept-Encoding", "gzip")
      .set("x-no-compression", "1")
      .expect(200)

    expect(res.headers["content-encoding"]).toBeUndefined()
  })

  it("does not throw or compress when the request has no scope", async () => {
    const request = createTestApp(
      {
        http: { compression: { enabled: true, threshold: 0 } },
      } as ProjectConfigOptions,
      { withScope: false }
    )

    const res = await request
      .get("/")
      .set("Accept-Encoding", "gzip")
      .expect(200)

    expect(res.headers["content-encoding"]).toBeUndefined()
    expect(res.text).toBe(LARGE_BODY)
  })
})
