import { IAuditModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  LicenseFeature,
  Modules,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner, testLicense } from "@medusajs/test-utils"
import InMemoryProviderExports, {
  InMemoryAuditProvider,
} from "../__fixtures__/in-memory-provider"

jest.setTimeout(30000)

const MODULE_PATH = __dirname + "/../.."

const createLogger = () =>
  ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }) as any

const provider = (service: IAuditModuleService): InMemoryAuditProvider =>
  (service as any).defaultProvider_()

const hooks = (service: IAuditModuleService) => (service as any).__hooks

const memoryProvider = { resolve: InMemoryProviderExports, id: "memory" }

let logger = createLogger()

moduleIntegrationTestRunner<IAuditModuleService>({
  moduleName: Modules.AUDIT,
  resolve: MODULE_PATH,
  moduleOptions: {
    providers: [memoryProvider],
    // Large enough that nothing is written until a test flushes.
    buffer: { max_size: 1000, flush_interval_ms: 60_000 },
  },
  injectedDependencies: {
    [ContainerRegistrationKeys.LICENSE]: testLicense([LicenseFeature.AUDIT]),
    [ContainerRegistrationKeys.LOGGER]: {
      info: (...args) => logger.info(...args),
      warn: (...args) => logger.warn(...args),
      error: (...args) => logger.error(...args),
      debug: (...args) => logger.debug(...args),
    },
  },
  testSuite: ({ service }) => {
    beforeEach(() => {
      logger = createLogger()
    })

    describe("Audit Module", () => {
      it("buffers records until flushed, then lists and retrieves them", async () => {
        const result = service.record([
          {
            action: "order.cancel",
            actor_type: "user",
            actor_id: "user_1",
            resource_type: "order",
            resource_id: "order_1",
            started_at: new Date("2026-11-11T09:00:00.000Z"),
          },
          {
            action: "product.update",
            actor_type: "api_key",
            actor_id: "apk_1",
            resource_type: "product",
            resource_id: "prod_1",
            started_at: new Date("2026-11-11T10:00:00.000Z"),
          },
        ])

        expect(result).toBeUndefined()
        expect(provider(service).records).toHaveLength(0)

        await service.flush()

        const [records, count] = await service.listAndCount()
        expect(count).toBe(2)
        expect(records.map((r) => r.action)).toEqual([
          "product.update",
          "order.cancel",
        ])
        expect(records[0].id).toMatch(/^audlog_/)

        const filtered = await service.list({ resource_type: "order" })
        expect(filtered).toHaveLength(1)
        expect(filtered[0]).toEqual(
          expect.objectContaining({
            action: "order.cancel",
            actor_type: "user",
            actor_id: "user_1",
            resource_id: "order_1",
            outcome: "succeeded",
            request: null,
          })
        )

        const retrieved = await service.retrieve(filtered[0].id)
        expect(retrieved.id).toBe(filtered[0].id)
      })

      it("passes default pagination and newest-first order to the provider", async () => {
        const spy = jest.spyOn(provider(service), "listAndCount")

        await service.listAndCount({ actor_id: "user_1" })

        expect(spy).toHaveBeenCalledWith(
          { actor_id: "user_1" },
          { skip: 0, take: 20, order: { started_at: "DESC" } }
        )
      })

      it("throws not found when retrieving an unknown audit log", async () => {
        await expect(service.retrieve("audlog_missing")).rejects.toThrow(
          "Audit log with id: audlog_missing was not found"
        )
      })

      it("drops invalid records with a warning and keeps the valid ones", async () => {
        expect(() =>
          service.record([
            { action: "" },
            { action: "ok" },
            { action: "bad", outcome: "maybe" as any },
          ])
        ).not.toThrow()

        await service.flush()

        expect(provider(service).records.map((r) => r.action)).toEqual(["ok"])
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("dropped 2 invalid audit log(s)")
        )
      })

      it("never throws to the caller when the provider fails", async () => {
        const memory = provider(service)
        memory.failuresLeft = 10

        expect(() => service.record({ action: "order.cancel" })).not.toThrow()
        await expect(service.flush()).resolves.toBeUndefined()

        expect(memory.writes).toHaveLength(3)
        expect(memory.records).toHaveLength(0)
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining("dropped 1 audit log(s) after 3 failed")
        )
      })

      it("retries a failed write before giving up", async () => {
        const memory = provider(service)
        memory.failuresLeft = 1

        service.record({ action: "order.cancel" })
        await service.flush()

        expect(memory.writes).toHaveLength(2)
        expect(memory.records).toHaveLength(1)
        expect(logger.error).not.toHaveBeenCalled()
      })

      it("flushes the buffer on shutdown", async () => {
        service.record({ action: "order.cancel" })
        expect(provider(service).records).toHaveLength(0)

        await hooks(service).onApplicationPrepareShutdown()

        expect(provider(service).records).toHaveLength(1)
      })
    })
  },
})

moduleIntegrationTestRunner<IAuditModuleService>({
  moduleName: Modules.AUDIT,
  resolve: MODULE_PATH,
  moduleOptions: {
    enabled: false,
    providers: [memoryProvider],
  },
  injectedDependencies: {
    [ContainerRegistrationKeys.LICENSE]: testLicense([LicenseFeature.AUDIT]),
  },
  testSuite: ({ service }) => {
    describe("Audit Module with enabled: false", () => {
      it("records nothing and buffers nothing", async () => {
        service.record({ action: "order.cancel" })
        await service.flush()

        expect((service as any).buffer_).toBeUndefined()
        expect(provider(service).writes).toHaveLength(0)
        expect(await service.list()).toEqual([])
      })
    })
  },
})

moduleIntegrationTestRunner<IAuditModuleService>({
  moduleName: Modules.AUDIT,
  resolve: MODULE_PATH,
  moduleOptions: {
    enabled: false,
  },
  injectedDependencies: {
    [ContainerRegistrationKeys.LICENSE]: testLicense([LicenseFeature.AUDIT]),
  },
  testSuite: ({ service }) => {
    describe("Audit Module with enabled: false and no provider", () => {
      it("loads, and reads return nothing", async () => {
        service.record({ action: "order.cancel" })

        expect(await service.listAndCount()).toEqual([[], 0])
        await expect(service.retrieve("audlog_1")).rejects.toThrow(
          "was not found"
        )
      })
    })
  },
})

const cloudFetch = jest.fn(async (_url: string, _init?: RequestInit) => ({
  ok: true,
  status: 200,
  json: async () => ({ records: [], count: 0 }),
}))

moduleIntegrationTestRunner<IAuditModuleService>({
  moduleName: Modules.AUDIT,
  resolve: MODULE_PATH,
  moduleOptions: {
    providers: [memoryProvider],
    cloud: {
      api_key: "medusa_key",
      endpoint: "https://audit.medusa.example",
      environment_handle: "test-env",
      fetch: cloudFetch,
    },
  },
  injectedDependencies: {
    [ContainerRegistrationKeys.LICENSE]: testLicense([LicenseFeature.AUDIT]),
  },
  testSuite: ({ service }) => {
    describe("Audit Module with cloud options", () => {
      beforeEach(() => {
        cloudFetch.mockClear()
      })

      it("registers the Cloud provider and makes it the default", async () => {
        service.record({ action: "order.cancel" })
        await service.flush()

        expect(cloudFetch).toHaveBeenCalledTimes(1)
        const [url, init] = cloudFetch.mock.calls[0]
        expect(url).toBe("https://audit.medusa.example/records")
        expect(JSON.parse(init!.body as string).records).toEqual([
          expect.objectContaining({ action: "order.cancel" }),
        ])

        await service.list()
        expect(cloudFetch.mock.calls[1][0]).toContain(
          "https://audit.medusa.example/records?"
        )
      })
    })
  },
})
