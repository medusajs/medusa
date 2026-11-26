import express from "express"
import fs from "fs"
import { AddressInfo } from "net"
import os from "os"
import path from "path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { serve } from "../serve"

describe("serve", () => {
  let outDir: string

  beforeAll(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), "admin-serve-"))
    fs.writeFileSync(path.join(outDir, "index.html"), "<html></html>")
    fs.mkdirSync(path.join(outDir, "assets"))
    fs.writeFileSync(path.join(outDir, "assets", "index.js"), "export {}")
  })

  afterAll(() => {
    fs.rmSync(outDir, { recursive: true, force: true })
  })

  const start = async (options: Parameters<typeof serve>[0]) => {
    const app = express()
    // What the framework's applySecurityHeaders sets on every response.
    app.use((_req, res, next) => {
      res.setHeader("Content-Security-Policy", "frame-ancestors 'self'")
      next()
    })
    app.use("/app", await serve(options))

    const server = app.listen(0)
    await new Promise((resolve) => server.once("listening", resolve))
    const { port } = server.address() as AddressInfo

    return {
      get: (urlPath: string) => fetch(`http://localhost:${port}${urlPath}`),
      close: () => new Promise((resolve) => server.close(resolve)),
    }
  }

  it("adds the configured security headers to the HTML", async () => {
    const server = await start({
      outDir,
      securityHeaders: {
        contentSecurityPolicy: "script-src 'self'; form-action 'self'",
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    })

    try {
      for (const urlPath of ["/app", "/app/orders/123"]) {
        const response = await server.get(urlPath)

        expect(await response.text()).toBe("<html></html>")
        expect(response.headers.get("content-security-policy")).toBe(
          "frame-ancestors 'self'; script-src 'self'; form-action 'self'"
        )
        expect(response.headers.get("referrer-policy")).toBe(
          "strict-origin-when-cross-origin"
        )
      }

      const asset = await server.get("/app/assets/index.js")
      expect(asset.headers.get("content-security-policy")).toBe(
        "frame-ancestors 'self'"
      )
      expect(asset.headers.get("referrer-policy")).toBeNull()
    } finally {
      await server.close()
    }
  })

  it("leaves the headers unchanged without the option", async () => {
    const server = await start({ outDir })

    try {
      const response = await server.get("/app")

      expect(response.headers.get("content-security-policy")).toBe(
        "frame-ancestors 'self'"
      )
      expect(response.headers.get("referrer-policy")).toBeNull()
    } finally {
      await server.close()
    }
  })
})
