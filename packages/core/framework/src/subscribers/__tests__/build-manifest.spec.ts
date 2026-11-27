import {
  ContainerRegistrationKeys,
  DeferredLoadError,
  Modules,
  setBuildManifest,
  setDeferredLoadLogger,
} from "@medusajs/utils"
import { mkdirSync, mkdtempSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { asValue } from "../../deps/awilix"
import { container } from "../../container"
import { logger } from "../../logger"
import { SubscriberLoader } from "../subscriber-loader"

const LOADS_KEY = "__SUBSCRIBER_MANIFEST_SPEC_LOADS__"

describe("SubscriberLoader with a build manifest", () => {
  let dir: string
  let loads: string[]
  const eventBus = { subscribe: jest.fn() }

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "subscriber-manifest-"))
    loads = []
    ;(globalThis as any)[LOADS_KEY] = loads
    eventBus.subscribe.mockClear()
    container.register(Modules.EVENT_BUS, asValue(eventBus))
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))
    setDeferredLoadLogger({ error: jest.fn() })
  })

  afterEach(() => {
    setBuildManifest(undefined)
    setDeferredLoadLogger(console)
    delete (globalThis as any)[LOADS_KEY]
  })

  function writeSubscriber(name: string, body: string) {
    const file = join(dir, name)
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      file,
      `globalThis.${LOADS_KEY}.push(${JSON.stringify(name)});\n${body}`
    )
    return file
  }

  const body = `
    exports.default = async function orderPlacedHandler(args) { return args.event.name }
    exports.config = { event: "order.placed" }
  `

  it("imports the subscriber at boot when there is no manifest", async () => {
    writeSubscriber("order-placed.js", body)
    await new SubscriberLoader(dir, {}, container).load()

    expect(loads).toEqual(["order-placed.js"])
    expect(eventBus.subscribe).toHaveBeenCalledTimes(1)
  })

  it("registers from the recorded config without importing, and imports on the first event", async () => {
    const file = writeSubscriber("order-placed.js", body)
    setBuildManifest({
      subscribers: {
        [file]: {
          config: { event: ["order.placed", "order.updated"] },
          handlerName: "orderPlacedHandler",
        },
      },
    })

    const paths = await new SubscriberLoader(dir, {}, container).load()

    expect(loads).toEqual([])
    expect(paths).toEqual([file])
    expect(eventBus.subscribe).toHaveBeenCalledTimes(2)
    expect(eventBus.subscribe.mock.calls.map((c) => c[0])).toEqual([
      "order.placed",
      "order.updated",
    ])
    // The recorded handler name is the id fallback
    expect(eventBus.subscribe.mock.calls[0][2]).toEqual({
      subscriberId: "order-placed-handler",
    })

    const subscriber = eventBus.subscribe.mock.calls[1][1]
    await expect(subscriber({})).resolves.toBe("order.updated")
    expect(loads).toEqual(["order-placed.js"])
  })

  it("falls back to the file name when no handler name is recorded", async () => {
    const file = writeSubscriber("order-placed.js", body)
    setBuildManifest({
      subscribers: { [file]: { config: { event: "order.placed" } } },
    })

    await new SubscriberLoader(dir, {}, container).load()

    expect(eventBus.subscribe.mock.calls[0][2]).toEqual({
      subscriberId: "order-placed",
    })
  })

  it("wraps a failing import in a DeferredLoadError", async () => {
    const file = writeSubscriber("broken.js", `throw new Error("boom")`)
    setBuildManifest({
      subscribers: { [file]: { config: { event: "order.placed" } } },
    })

    await new SubscriberLoader(dir, {}, container).load()
    const subscriber = eventBus.subscribe.mock.calls[0][1]

    const err = await subscriber({}).catch((e) => e)
    expect(DeferredLoadError.isDeferredLoadError(err)).toBe(true)
    expect(err.kind).toBe("subscriber")
    expect(err.target).toBe(file)
  })
})
