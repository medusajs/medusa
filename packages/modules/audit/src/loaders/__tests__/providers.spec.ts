import {
  AbstractAuditProviderService,
  createMedusaContainer,
  ModuleProvider,
  Modules,
} from "@medusajs/framework/utils"
import { asValue } from "@medusajs/framework/awilix"
import providersLoader from "../providers"

class MemoryProvider extends AbstractAuditProviderService {
  static identifier = "audit-memory"

  constructor(
    _: unknown,
    public options: Record<string, unknown>
  ) {
    super()
  }
}

const memory = ModuleProvider(Modules.AUDIT, { services: [MemoryProvider] })

const cloud = {
  api_key: "key",
  endpoint: "https://audit.medusa.example",
  environment_handle: "env",
}

const load = async (options: Record<string, unknown>) => {
  const container = createMedusaContainer()
  container.register({
    auditLogService: asValue({}),
    baseRepository: asValue({}),
    logger: asValue(console),
  })
  await providersLoader({ container, options } as any)
  return container
}

describe("audit providers loader", () => {
  it("makes the only provider the default and passes it its options", async () => {
    const container = await load({
      providers: [{ resolve: memory, id: "memory", options: { a: 1 } }],
    })

    expect(container.resolve("audit_default_provider")).toBe("memory")
    expect(container.resolve<MemoryProvider>("aud_memory").options).toEqual({
      a: 1,
    })
  })

  it("registers the Cloud provider from the cloud option and makes it the default", async () => {
    const container = await load({
      cloud,
      providers: [{ resolve: memory, id: "memory" }],
    })

    expect(container.resolve("audit_default_provider")).toBe("cloud")
    expect(container.resolve<MemoryProvider>("aud_cloud").identifier).toBe(
      "audit-medusa"
    )
  })

  it("does not register the Cloud provider without an endpoint", async () => {
    const container = await load({
      cloud: { api_key: "key", environment_handle: "env" },
      providers: [{ resolve: memory, id: "memory" }],
    })

    expect(container.resolve("audit_default_provider")).toBe("memory")
  })

  it("rejects Cloud options without credentials", async () => {
    await expect(
      load({ cloud: { endpoint: "https://audit.medusa.example" } })
    ).rejects.toThrow('"api_key"')
  })

  it("lets default_provider override the Cloud default", async () => {
    const container = await load({
      cloud,
      providers: [{ resolve: memory, id: "memory" }],
      default_provider: "memory",
    })

    expect(container.resolve("audit_default_provider")).toBe("memory")
  })

  it("requires default_provider when several providers are registered", async () => {
    await expect(
      load({
        providers: [
          { resolve: memory, id: "a" },
          { resolve: memory, id: "b" },
        ],
      })
    ).rejects.toThrow('"default_provider" must be set')
  })

  it("rejects an unknown default_provider and duplicate ids", async () => {
    await expect(
      load({
        providers: [{ resolve: memory, id: "a" }],
        default_provider: "b",
      })
    ).rejects.toThrow('"b" is not registered')

    await expect(
      load({
        providers: [
          { resolve: memory, id: "a" },
          { resolve: memory, id: "a" },
        ],
      })
    ).rejects.toThrow("registered twice")
  })

  it("falls back to the built-in Postgres storage", async () => {
    const container = await load({ retention_days: 30 })

    expect(container.resolve("audit_default_provider")).toBe("postgres")
    expect(container.resolve<MemoryProvider>("aud_postgres").identifier).toBe(
      "audit-postgres"
    )

    await expect(load({ retention_days: -1 })).rejects.toThrow("retention_days")
  })

  it("does not register the Postgres storage beside other providers", async () => {
    const container = await load({
      providers: [{ resolve: memory, id: "memory" }],
    })

    expect(container.hasRegistration("aud_postgres")).toBe(false)
  })
})
