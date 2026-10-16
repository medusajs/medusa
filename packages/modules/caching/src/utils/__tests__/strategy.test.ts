import { Modules } from "@medusajs/framework/utils"
import { buildSchema, GraphQLSchema } from "graphql"
import { DefaultCacheStrategy } from "../strategy"

const schemaDefinition = `
  type Product {
    id: ID!
    title: String
    handle: String
    variants: [ProductVariant!]
  }

  type ProductVariant {
    id: ID!
    sku: String
    product: Product!
  }
`

const joinerConfigs = [
  {
    idPrefixToEntityName: {
      prod: "Product",
      variant: "ProductVariant",
    },
  },
] as any

type ClearCall = { tags?: string[] }

const buildStrategy = ({
  onClear,
}: {
  onClear?: (call: ClearCall) => Promise<void> | void
} = {}) => {
  const clearCalls: ClearCall[] = []
  const interceptors: Function[] = []
  let subscriber!: (data: any) => Promise<void>

  const eventBus = {
    subscribe: (_event: string, handler: (data: any) => Promise<void>) => {
      subscriber = handler
    },
    addInterceptor: (interceptor: Function) => {
      interceptors.push(interceptor)
    },
  }

  const cacheModule = {
    clear: async (call: ClearCall) => {
      clearCalls.push(call)
      await onClear?.(call)
    },
  }

  const container = {
    hasher: (data: string) => data,
    logger: { error: jest.fn(), warn: jest.fn() },
    [Modules.EVENT_BUS]: eventBus,
  }

  const strategy = new DefaultCacheStrategy(
    container as any,
    cacheModule as any
  )

  return {
    strategy,
    clearCalls,
    interceptors,
    start: async () => {
      const schema: GraphQLSchema = buildSchema(schemaDefinition)
      await strategy.onApplicationStart(schema, joinerConfigs)
      return subscriber
    },
  }
}

const updatedEvent = (id: string) => ({
  name: "product.updated",
  data: { id },
})

describe("DefaultCacheStrategy", () => {
  describe("invalidation dispatch", () => {
    it("should not register the invalidation handler as an event bus interceptor", async () => {
      const { interceptors, start } = buildStrategy()

      await start()

      // Interceptors run in whichever process emits the event, including a
      // `worker_mode: "server"` process that is documented as not processing
      // events, and are redundant with the "*" subscriber.
      expect(interceptors).toHaveLength(0)
    })

    it("should not start a new clear while one is in flight", async () => {
      let inFlight = 0
      let maxInFlight = 0

      const { clearCalls, start } = buildStrategy({
        onClear: async () => {
          inFlight++
          maxInFlight = Math.max(maxInFlight, inFlight)
          await new Promise((resolve) => setTimeout(resolve, 5))
          inFlight--
        },
      })

      const handleEvent = await start()

      await Promise.all(
        Array.from({ length: 50 }, (_, i) =>
          handleEvent(updatedEvent(`prod_${i}`))
        )
      )

      expect(maxInFlight).toBe(1)
      expect(clearCalls.length).toBeGreaterThan(0)
    })

    it("should coalesce a burst of events into a bounded number of clears", async () => {
      const { clearCalls, start } = buildStrategy({
        onClear: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5))
        },
      })

      const handleEvent = await start()

      const events = Array.from({ length: 50 }, (_, i) =>
        updatedEvent(`prod_${i}`)
      )

      await Promise.all(events.map((event) => handleEvent(event)))

      // Without batching this is one clear per event.
      expect(clearCalls.length).toBeLessThan(events.length)

      // Every event still gets invalidated: each id appears in some batch.
      const clearedTags = new Set(clearCalls.flatMap((call) => call.tags ?? []))
      for (const event of events) {
        expect(clearedTags).toContain(`Product:${event.data.id}`)
      }
    })

    it("should cap the number of tags handed to a single clear", async () => {
      const { clearCalls, start } = buildStrategy({
        onClear: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5))
        },
      })

      const handleEvent = await start()

      await Promise.all(
        Array.from({ length: 500 }, (_, i) =>
          handleEvent(updatedEvent(`prod_${i}`))
        )
      )

      for (const call of clearCalls) {
        expect(call.tags!.length).toBeLessThanOrEqual(100)
      }
    })

    it("should resolve only once the queued tags have been cleared", async () => {
      let cleared = false

      const { start } = buildStrategy({
        onClear: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          cleared = true
        },
      })

      const handleEvent = await start()

      await handleEvent(updatedEvent("prod_1"))

      expect(cleared).toBe(true)
    })

    it("should keep draining when a clear fails", async () => {
      let call = 0

      const { clearCalls, start } = buildStrategy({
        onClear: async () => {
          if (++call === 1) {
            throw new Error("redis is down")
          }
        },
      })

      const handleEvent = await start()

      await expect(handleEvent(updatedEvent("prod_1"))).resolves.toBeUndefined()

      await handleEvent(updatedEvent("prod_2"))

      expect(clearCalls.length).toBe(2)
    })
  })
})
