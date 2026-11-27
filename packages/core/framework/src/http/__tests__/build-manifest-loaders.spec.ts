import {
  DeferredLoadError,
  resetDeferredLoadLog,
  setBuildManifest,
  setDeferredLoadLogger,
} from "@medusajs/utils"
import { mkdirSync, mkdtempSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { MiddlewareFileLoader } from "../middleware-file-loader"
import { RoutesLoader } from "../routes-loader"

const FAIL_KEY = "__FRAMEWORK_MANIFEST_SPEC_FAIL__"
const LOADS_KEY = "__FRAMEWORK_MANIFEST_SPEC_LOADS__"

describe("build manifest stand-ins for routes and middlewares", () => {
  let dir: string
  let loads: string[]

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "framework-manifest-"))
    loads = []
    ;(globalThis as any)[LOADS_KEY] = loads
    setDeferredLoadLogger({ error: jest.fn() })
    resetDeferredLoadLog()
  })

  afterEach(() => {
    setBuildManifest(undefined)
    setDeferredLoadLogger(console)
    delete (globalThis as any)[LOADS_KEY]
  })

  function writeFile(relative: string, body: string) {
    const file = join(dir, relative)
    mkdirSync(join(file, ".."), { recursive: true })
    writeFileSync(
      file,
      `globalThis.${LOADS_KEY}.push(${JSON.stringify(relative)});\n${body}`
    )
    return file
  }

  const res = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() })

  describe("routes", () => {
    const routeBody = `exports.GET = async (req) => "got " + req.id;`

    it("imports the route file when there is no manifest", async () => {
      writeFile("store/things/route.js", routeBody)
      const loader = new RoutesLoader()
      await loader.scanDir(dir)

      expect(loads).toEqual(["store/things/route.js"])
      expect(loader.getRoutes().map((r) => r.method)).toEqual(["GET"])
    })

    it("registers recorded methods and flags without importing, then imports on first request", async () => {
      const file = writeFile("admin/things/route.js", routeBody)
      setBuildManifest({
        routes: {
          [file]: {
            methods: ["GET", "POST"],
            authenticate: false,
            cors: false,
          },
        },
      })

      const loader = new RoutesLoader()
      await loader.scanDir(dir)

      expect(loads).toEqual([])
      const routes = loader.getRoutes()
      expect(routes.map((r) => r.method).sort()).toEqual(["GET", "POST"])
      expect(routes.every((r) => r.optedOutOfAuth)).toBe(true)
      expect(routes.every((r) => !r.shouldAppendAdminCors)).toBe(true)

      const get = routes.find((r) => r.method === "GET")!
      await expect(
        (get.handler as any)({ id: 1 }, res(), jest.fn())
      ).resolves.toBe("got 1")
      expect(loads).toEqual(["admin/things/route.js"])
    })

    it("keeps authentication and CORS defaults when the flags are not recorded", async () => {
      const file = writeFile("admin/things/route.js", routeBody)
      setBuildManifest({ routes: { [file]: { methods: ["GET"] } } })

      const loader = new RoutesLoader()
      await loader.scanDir(dir)

      const [route] = loader.getRoutes()
      expect(route.optedOutOfAuth).toBe(false)
      expect(route.shouldAppendAdminCors).toBe(true)
    })

    it("throws a DeferredLoadError naming the route when the import fails", async () => {
      const file = writeFile("store/broken/route.js", `throw new Error("boom")`)
      // Not evaluated at boot because of the manifest
      setBuildManifest({ routes: { [file]: { methods: ["GET"] } } })

      const loader = new RoutesLoader()
      await loader.scanDir(dir)
      const [route] = loader.getRoutes()

      const err = await (route.handler as any)({}, res(), jest.fn()).catch(
        (e) => e
      )
      expect(DeferredLoadError.isDeferredLoadError(err)).toBe(true)
      expect(err.kind).toBe("route")
      expect(err.target).toBe(`GET ${file}`)
      expect(err.cause.message).toBe("boom")
    })
  })

  describe("middlewares", () => {
    const middlewareBody = `
      const a = (req, res, next) => "a:" + req.id
      const b = (err, req, res, next) => "b:" + err
      exports.default = { routes: [
        { matcher: "/x", middlewares: [a] },
        { matcher: /^\\/y/i, methods: ["POST"], middlewares: [b, a] },
      ] }
    `

    it("preserves arity, rebuilds regex matchers and delegates by position", async () => {
      const file = writeFile("middlewares.js", middlewareBody)
      setBuildManifest({
        middlewares: {
          [file]: {
            routes: [
              { matcher: "/x", middlewareArity: [3] },
              {
                matcher: { regexp: "^\\/y", flags: "i" },
                methods: ["POST"],
                middlewareArity: [4, 3],
              },
            ],
          },
        },
      })

      const loader = new MiddlewareFileLoader()
      await loader.scanDir(dir)
      expect(loads).toEqual([])

      const middlewares = loader.getMiddlewares()
      expect(middlewares.map((m) => (m.handler as Function).length)).toEqual([
        3, 4, 3,
      ])
      expect(middlewares[0].matcher).toBe("/x")
      expect(middlewares[1].matcher).toEqual(/^\/y/i)
      expect(middlewares[1].methods).toEqual(["POST"])

      await expect(
        (middlewares[0].handler as any)({ id: 1 }, res(), jest.fn())
      ).resolves.toBe("a:1")
      await expect(
        (middlewares[1].handler as any)("e", {}, res(), jest.fn())
      ).resolves.toBe("b:e")
      await expect(
        (middlewares[2].handler as any)({ id: 2 }, res(), jest.fn())
      ).resolves.toBe("a:2")
      // The file is imported once for all of them
      expect(loads).toEqual(["middlewares.js"])
    })

    it("does not cache a failed load", async () => {
      // Fails to import (a missing package) until the flag is cleared
      ;(globalThis as any)[FAIL_KEY] = true
      const file = writeFile(
        "middlewares.js",
        `if (globalThis.${FAIL_KEY}) {
          throw Object.assign(new Error("gone"), { code: "MODULE_NOT_FOUND" })
        }
        ${middlewareBody}`
      )
      setBuildManifest({
        middlewares: {
          [file]: { routes: [{ matcher: "/x", middlewareArity: [3] }] },
        },
      })
      const loader = new MiddlewareFileLoader()
      await loader.scanDir(dir)
      const [{ handler }] = loader.getMiddlewares() as any

      const err = await handler({ id: 1 }, res(), jest.fn()).catch((e) => e)
      expect(DeferredLoadError.isDeferredLoadError(err)).toBe(true)
      expect(err.kind).toBe("middleware")
      expect(err.target).toBe(file)
      expect(err.hint).toContain("not part of this bundle")

      delete (globalThis as any)[FAIL_KEY]

      await expect(handler({ id: 1 }, res(), jest.fn())).resolves.toBe("a:1")
    })
  })
})
