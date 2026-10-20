import { asValue } from "@medusajs/framework/awilix"
import {
  createMedusaContainer,
  MedusaContext,
  MedusaContextType,
  MedusaModuleType,
} from "@medusajs/framework/utils"
import type { RunScope } from "@medusajs/workflow-engine"
import { contextualizeContainer } from "../medusa-context"

class ProductModule {
  static __type = MedusaModuleType
  calls: unknown[] = []

  async list(filters: unknown, @MedusaContext() context: any = {}) {
    this.calls.push(context)
    return filters
  }
}

const scope = (overrides: Partial<RunScope> = {}): RunScope => ({
  engineId: "e",
  runId: "run",
  rootRunId: "run",
  workflowId: "wf",
  transactionId: "trx",
  durability: "none",
  context: { eventGroupId: "group", manager: {}, transactionManager: {} },
  ...overrides,
})

describe("contextualizeContainer", () => {
  let module: ProductModule
  let current: RunScope | undefined

  const resolveModule = () => {
    const container = createMedusaContainer()
    container.register("product", asValue(module))
    container.register("plain", asValue({ list: () => "plain" }))
    return contextualizeContainer(container, () => current)
  }

  beforeEach(() => {
    module = new ProductModule()
    current = undefined
  })

  it("fills the context parameter with the run context and step key", async () => {
    current = scope({ stepId: "s1", action: "invoke" })

    await resolveModule().resolve<ProductModule>("product").list({})

    expect(module.calls[0]).toEqual({
      eventGroupId: "group",
      idempotencyKey: "wf:trx:s1:invoke",
      __type: MedusaContextType,
    })
  })

  it("keeps a context the caller passed", async () => {
    current = scope({ stepId: "s1", action: "invoke" })
    const own = { __type: MedusaContextType, eventGroupId: "mine" }

    await resolveModule().resolve<ProductModule>("product").list({}, own)

    expect(module.calls[0]).toBe(own)
  })

  it("puts a plain context the caller passed on top of the run context", async () => {
    current = scope({ stepId: "s1", action: "invoke" })
    const manager = {}

    await resolveModule()
      .resolve<ProductModule>("product")
      .list({}, { eventGroupId: "mine", manager } as any)

    expect(module.calls[0]).toEqual({
      eventGroupId: "mine",
      idempotencyKey: "wf:trx:s1:invoke",
      manager,
      __type: MedusaContextType,
    })
    expect((module.calls[0] as any).manager).toBe(manager)
  })

  it("does not drop the run's manager into a caller context", async () => {
    current = scope({ stepId: "s1", action: "invoke" })

    await resolveModule()
      .resolve<ProductModule>("product")
      .list({}, { foo: "bar" } as any)

    expect(module.calls[0]).not.toHaveProperty("manager")
    expect(module.calls[0]).not.toHaveProperty("transactionManager")
  })

  it("does not wrap the constructor", () => {
    const product = resolveModule().resolve<ProductModule>("product")

    expect(product.constructor).toBe(ProductModule)
    expect((product.constructor as any).__type).toBe(MedusaModuleType)
  })

  it("returns the same function for a method on every access", () => {
    const product = resolveModule().resolve<ProductModule>("product")

    expect(product.list).toBe(product.list)
  })

  it("leaves calls outside a run alone", async () => {
    await resolveModule().resolve<ProductModule>("product").list({})

    expect(module.calls[0]).toEqual({})
  })

  it("returns the same proxy for the same service", () => {
    const container = resolveModule()

    expect(container.resolve("product")).toBe(container.resolve("product"))
  })

  it("does not wrap values that are not module services", () => {
    current = scope({ stepId: "s1", action: "invoke" })
    const plain = resolveModule().resolve<{ list(): string }>("plain")

    expect(plain.list()).toEqual("plain")
  })
})
