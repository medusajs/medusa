import { GraphQLSchema } from "graphql"

// Matches the Modules.EVENT_BUS container key used by the strategy.
const EVENT_BUS_KEY = "event_bus"
import { CachingModuleService } from "../cache-module"
import { DefaultCacheStrategy } from "../../utils/strategy"
import {
  CachingDefaultProvider,
  CachingProviderRegistrationPrefix,
} from "../../types"

/**
 * performCacheSet/performCacheClear dispatched provider calls with
 * `void`, so the method resolved before the provider did anything and the
 * ongoingRequests coalescing deleted the in-flight entry almost immediately —
 * N concurrent identical operations each hit the provider, unbounded.
 */
describe("CachingModuleService provider dispatch", () => {
  const makeService = (provider: any) => {
    const container = {
      cacheProviderService: {
        retrieveProvider: (id: string) =>
          id === "fake" ? provider : undefined,
      },
      logger: console,
      [CachingDefaultProvider]: "fake",
      [`${CachingProviderRegistrationPrefix}fake`]: provider,
      strategy: DefaultCacheStrategy,
    } as any
    return new CachingModuleService(container, { options: {} })
  }

  it("clear_ coalesces concurrent identical clears into one provider call", async () => {
    let inFlight = 0
    let maxInFlight = 0
    let calls = 0
    const provider = {
      identifier: "fake",
      clear: async () => {
        calls++
        inFlight++
        maxInFlight = Math.max(maxInFlight, inFlight)
        await new Promise((r) => setTimeout(r, 20))
        inFlight--
      },
      set: async () => {},
      get: async () => null,
      invalidate: async () => {},
    }
    const service = makeService(provider)

    // Staggered, not simultaneous: with `void` dispatch the in-flight entry
    // was deleted while the provider was still working, so the second call
    // re-invoked the provider — the reported shape (events keep arriving
    // while a slow clear runs). With awaited dispatch the entry lives until
    // the provider finishes, so the second call coalesces.
    const first = service.clear({ tags: ["Product:list:*"] })
    await new Promise((r) => setTimeout(r, 5)) // clear still running (20ms)
    await Promise.all([first, service.clear({ tags: ["Product:list:*"] })])

    expect(calls).toBe(1)
    expect(maxInFlight).toBe(1)
  })

  it("set_ coalesces concurrent identical sets into one provider call", async () => {
    let calls = 0
    const provider = {
      identifier: "fake",
      set: async () => {
        calls++
        await new Promise((r) => setTimeout(r, 20))
      },
      clear: async () => {},
      get: async () => null,
      invalidate: async () => {},
    }
    const service = makeService(provider)

    const first = service.set({ key: "k", tags: ["t"], data: { a: 1 } })
    await new Promise((r) => setTimeout(r, 5)) // set still running (20ms)
    await Promise.all([first, service.set({ key: "k", tags: ["t"], data: { a: 1 } })])

    expect(calls).toBe(1)
  })

  it("distinct operations are not coalesced", async () => {
    const cleared: string[] = []
    const provider = {
      identifier: "fake",
      clear: async ({ tags }: any) => {
        cleared.push(tags.join(","))
        await new Promise((r) => setTimeout(r, 10))
      },
      set: async () => {},
      get: async () => null,
      invalidate: async () => {},
    }
    const service = makeService(provider)

    await Promise.all([
      service.clear({ tags: ["A"] }),
      service.clear({ tags: ["B"] }),
    ])

    expect(cleared.sort()).toEqual(["A", "B"])
  })
})

/**
 * The invalidation handler was registered BOTH as a wildcard
 * subscriber and as an event-bus interceptor. Interceptors run wherever an
 * event is emitted, so a workerMode: "server" process ran full invalidation
 * inline for every write it served — OOMing the API container under bulk
 * writes — and in a server/worker split every event was invalidated twice.
 */
describe("DefaultCacheStrategy invalidation registration", () => {
  it("subscribes to the wildcard but registers no interceptor", async () => {
    const subscriptions: string[] = []
    const interceptors: number[] = []
    const eventBus = {
      subscribe: (name: string) => subscriptions.push(name),
      addInterceptor: () => interceptors.push(1),
    }
    const container = {
      [EVENT_BUS_KEY]: eventBus,
      logger: console,
    } as any

    const strategy = new DefaultCacheStrategy(
      container,
      { clear: async () => {} } as any
    )
    await strategy.onApplicationStart(
      new GraphQLSchema({}),
      []
    )

    expect(subscriptions).toEqual(["*"])
    expect(interceptors).toEqual([])
  })
})

