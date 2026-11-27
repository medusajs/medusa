import {
  DeferredLoadError,
  deferredLoad,
  deferredLoadSync,
  resetDeferredLoadLog,
  setDeferredLoadLogger,
} from "../deferred-load"

describe("deferred load", () => {
  const logger = { error: jest.fn() }

  beforeEach(() => {
    logger.error.mockClear()
    resetDeferredLoadLog()
    setDeferredLoadLogger(logger)
  })

  afterAll(() => {
    setDeferredLoadLogger(console)
  })

  it("returns what the load returns, sync and async", async () => {
    expect(deferredLoadSync({ kind: "route", target: "a" }, () => 1)).toBe(1)
    await expect(
      deferredLoad({ kind: "route", target: "a" }, async () => 2)
    ).resolves.toBe(2)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("wraps an async failure, keeping the cause", async () => {
    const cause = new Error("boom")
    const err = await deferredLoad(
      { kind: "route", target: "GET /a.ts", file: "/a.ts" },
      async () => {
        throw cause
      }
    ).catch((e) => e)

    expect(DeferredLoadError.isDeferredLoadError(err)).toBe(true)
    expect(err).toBeInstanceOf(DeferredLoadError)
    expect(err.kind).toBe("route")
    expect(err.target).toBe("GET /a.ts")
    expect(err.file).toBe("/a.ts")
    expect(err.cause).toBe(cause)
    expect(err.message).toContain("route")
    expect(err.message).toContain("GET /a.ts")
    expect(err.message).toContain(err.hint)
  })

  it("wraps a sync failure", () => {
    expect(() =>
      deferredLoadSync({ kind: "workflow", target: "wf" }, () => {
        throw new Error("boom")
      })
    ).toThrow(DeferredLoadError)
  })

  it.each(["MODULE_NOT_FOUND", "ERR_MODULE_NOT_FOUND"])(
    "explains a %s as not part of the bundle",
    (code) => {
      const cause = Object.assign(new Error("Cannot find module"), { code })
      const err = (() => {
        try {
          deferredLoadSync({ kind: "module", target: "m" }, () => {
            throw cause
          })
        } catch (e) {
          return e
        }
      })()

      expect(err.hint).toContain("not part of this bundle")
      expect(err.hint).toContain("rebuild")
      expect(err.hint).not.toContain("--bundle")
    }
  )

  it("explains a module failure that is not a missing module", () => {
    const err = (() => {
      try {
        deferredLoadSync({ kind: "module", target: "m" }, () => {
          throw new Error("bad options")
        })
      } catch (e) {
        return e
      }
    })()

    expect(err.hint).toContain("failed to start on first use")
    expect(err.hint).toContain("--bundle")
    expect(err.hint).toContain("options")
  })

  it("uses a generic hint otherwise", () => {
    const err = (() => {
      try {
        deferredLoadSync({ kind: "route", target: "r" }, () => {
          throw new Error("syntax")
        })
      } catch (e) {
        return e
      }
    })()

    expect(err.hint).toBe("It failed to load on first use.")
  })

  it("does not wrap or log again an error that is already a DeferredLoadError", async () => {
    const inner = await deferredLoad({ kind: "module", target: "m" }, () => {
      throw new Error("inner")
    }).catch((e) => e)
    logger.error.mockClear()

    const outer = await deferredLoad(
      { kind: "workflow", target: "w" },
      async () => {
        throw inner
      }
    ).catch((e) => e)

    expect(outer).toBe(inner)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("recognizes errors from a duplicated copy by marker", () => {
    const foreign = Object.assign(new Error("x"), {
      __medusaDeferredLoadError: true,
    })
    expect(DeferredLoadError.isDeferredLoadError(foreign)).toBe(true)
    expect(DeferredLoadError.isDeferredLoadError(new Error("x"))).toBe(false)
    expect(DeferredLoadError.isDeferredLoadError(undefined)).toBe(false)
  })

  it("logs the first failure in full and repeats briefly", () => {
    const cause = Object.assign(new Error("boom"), { code: "E_X" })
    const run = (target: string) =>
      expect(() =>
        deferredLoadSync({ kind: "route", target, file: "/f.ts" }, () => {
          throw cause
        })
      ).toThrow()

    run("GET /f.ts")
    expect(logger.error).toHaveBeenCalledTimes(1)
    const [message, stack] = logger.error.mock.calls[0]
    expect(message.startsWith("deferred_load_failed ")).toBe(true)
    const payload = JSON.parse(message.slice("deferred_load_failed ".length))
    expect(Object.keys(payload).sort()).toEqual(
      ["cause", "event", "file", "hint", "kind", "target"].sort()
    )
    expect(payload).toMatchObject({
      event: "deferred_load_failed",
      kind: "route",
      target: "GET /f.ts",
      file: "/f.ts",
      cause: { name: "Error", message: "boom", code: "E_X" },
    })
    expect(stack).toBe(cause)

    run("GET /f.ts")
    run("GET /f.ts")
    expect(logger.error).toHaveBeenCalledTimes(3)
    expect(logger.error.mock.calls[1]).toEqual([
      "deferred_load_failed kind=route target=GET /f.ts repeat=2",
    ])
    expect(logger.error.mock.calls[2][0]).toContain("repeat=3")

    // A different target logs in full again
    run("POST /f.ts")
    expect(logger.error.mock.calls[3][0]).toContain('"event"')
  })
})
