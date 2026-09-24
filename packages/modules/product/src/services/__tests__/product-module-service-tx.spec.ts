import ProductModuleService from "../product-module-service"

const tick = () => new Promise<void>((resolve) => setImmediate(resolve))

/**
 * Asserts the recorded events form strict start/end pairs with no
 * interleaving, i.e. [x:start, x:end, y:start, y:end].
 */
const expectSequential = (events: string[]) => {
  expect(events).toHaveLength(4)
  const pairs = [
    [events[0], events[1]],
    [events[2], events[3]],
  ]
  for (const [start, end] of pairs) {
    expect(start.endsWith(":start")).toBe(true)
    expect(end).toBe(start.replace(":start", ":end"))
  }
}

describe("ProductModuleService.createVariants_", () => {
  const setup = () => {
    const events: string[] = []
    const service = Object.create(ProductModuleService.prototype) as any

    service.productVariantService_ = {
      list: jest.fn(async () => {
        events.push("list:start")
        await tick()
        events.push("list:end")
        return []
      }),
      create: jest.fn(async (data: any) => data),
    }
    service.loadOptionsAndValuesByProductId_ = jest.fn(async () => {
      events.push("options:start")
      await tick()
      events.push("options:end")
      return { optionsByProductId: {}, valueIdsByProductId: {} }
    })

    const statics = ProductModuleService as any
    const originalAssign = statics.assignOptionsToVariants
    const originalCheck = statics.checkIfVariantWithOptionsAlreadyExists
    statics.assignOptionsToVariants = jest.fn((data: any) => data)
    statics.checkIfVariantWithOptionsAlreadyExists = jest.fn()

    return {
      service,
      events,
      restore: () => {
        statics.assignOptionsToVariants = originalAssign
        statics.checkIfVariantWithOptionsAlreadyExists = originalCheck
      },
    }
  }

  it("loads existing variants and options sequentially instead of interleaved", async () => {
    const { service, events, restore } = setup()
    try {
      await service.createVariants_([{ product_id: "prod_1" }], {})
      expectSequential(events)
    } finally {
      restore()
    }
  })
})
