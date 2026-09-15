import FulfillmentModuleService from "../fulfillment-module-service"

/**
 * Regression coverage for the case where FulfillmentModuleService.createFulfillment
 * invoked the provider with the raw MikroORM entity items, whose `quantity` column
 * is a non-enumerable accessor (the BigNumber property descriptor set in
 * @medusajs/utils big-number-field.ts does not include `enumerable: true`). A
 * provider that copies an item to build an outbound payload — `{ ...item }`,
 * Object.assign, structuredClone — would silently drop the quantity and send
 * a 0 to the third-party API.
 *
 * The fix is to serialize the items before the provider call, which gives
 * the provider the DTO shape (plain object, `quantity` enumerable, `typeof
 * quantity === "number"`).
 *
 * These tests exercise the production call site (createFulfillment) by
 * instantiating the service with mocked dependencies, so they run without
 * a database and assert on what reaches the provider.
 */
describe("FulfillmentModuleService - createFulfillment item serialization", () => {
  const buildItem = (id: string, quantity: number) => {
    // Mimic the BigNumber property shape installed by MikroOrmBigNumberProperty:
    // the column accessor (`quantity`) is non-enumerable so spread/Object.keys
    // only sees `raw_quantity`. The accessor reads the numeric value from a
    // private `__helper.__data` map.
    const data: Record<string, unknown> = {
      __data: { [id]: quantity },
    }
    const item: Record<string, unknown> = {
      id,
      title: `item-${id}`,
      sku: `sku-${id}`,
      barcode: `barcode-${id}`,
      line_item_id: null,
      inventory_item_id: null,
      raw_quantity: { value: String(quantity), precision: 20 },
    }
    Object.defineProperty(item, "quantity", {
      get() {
        return (data.__data as Record<string, unknown>)[id]
      },
      configurable: true,
    })
    return item
  }

  const buildService = (providerSpy: jest.Mock) => {
    const items = [buildItem("fulit_1", 3), buildItem("fulit_2", 5)]

    const fulfillment = {
      id: "ful_1",
      provider_id: "test-provider",
      data: {},
      items,
    }

    const fulfillmentService = {
      create: jest.fn().mockResolvedValue(fulfillment),
      update: jest.fn().mockResolvedValue(fulfillment),
    }

    const fulfillmentProviderService = {
      createFulfillment: jest.fn(async (..._args: unknown[]) => {
        providerSpy(..._args)
        return { data: {}, labels: [] }
      }),
    }

    const baseRepository = {
      getFreshManager: jest.fn().mockReturnValue({}),
      serialize: jest.fn((value: unknown) => {
        // Mirror the real repository's serialization contract: walk the input
        // and replace non-enumerable accessors with their current value as
        // plain enumerable properties. The real MikroORM serializer does the
        // same thing — it materializes the bigNumber accessor into a normal
        // numeric `quantity` field on the resulting DTO.
        const serializeOne = (input: unknown): unknown => {
          if (Array.isArray(input)) {
            return input.map(serializeOne)
          }
          if (input !== null && typeof input === "object") {
            const source = input as Record<string, unknown>
            const out: Record<string, unknown> = {}
            for (const key of Object.keys(source)) {
              out[key] = serializeOne(source[key])
            }
            // Capture non-enumerable accessors (e.g. bigNumber `quantity`)
            for (const key of Object.getOwnPropertyNames(source)) {
              if (key in out) {
                continue
              }
              const descriptor = Object.getOwnPropertyDescriptor(source, key)
              if (descriptor && typeof descriptor.get === "function") {
                out[key] = serializeOne(descriptor.get.call(source))
              }
            }
            return out
          }
          return input
        }
        return serializeOne(value)
      }),
    }

    const service = new FulfillmentModuleService(
      {
        baseRepository,
        fulfillmentService,
        fulfillmentProviderService,
      } as any,
      {} as any
    )

    return { service, items, fulfillment }
  }

  it("passes serialized items to the provider so bigNumber quantity is enumerable", async () => {
    const providerSpy = jest.fn()
    const { service, items } = buildService(providerSpy)

    await service.createFulfillment({
      provider_id: "test-provider",
      shipping_option_id: "so_1",
      items: items.map((item) => ({
        id: item.id as string,
        title: item.title as string,
        sku: item.sku as string,
        barcode: item.barcode as string,
        quantity: item.quantity as number,
      })),
    } as any)

    expect(providerSpy).toHaveBeenCalledTimes(1)
    const providerItems = providerSpy.mock.calls[0][2] as Array<
      Record<string, unknown>
    >

    // Copy the items exactly the way a provider would build an outbound
    // payload. The spread must preserve quantity — if it does not, the
    // vendor receives a silent 0.
    const copied = providerItems.map((item) => ({ ...item }))

    for (const original of providerItems) {
      expect(original).toHaveProperty("quantity")
    }
    for (const shadow of copied) {
      expect(shadow).toHaveProperty("quantity")
      expect(typeof shadow.quantity).toBe("number")
      expect(shadow.quantity).not.toBe(0)
    }
  })

  it("reaches the provider with the items the service created", async () => {
    const providerSpy = jest.fn()
    const { service, items } = buildService(providerSpy)

    await service.createFulfillment({
      provider_id: "test-provider",
      shipping_option_id: "so_1",
      items: items.map((item) => ({
        id: item.id as string,
        title: item.title as string,
        sku: item.sku as string,
        barcode: item.barcode as string,
        quantity: item.quantity as number,
      })),
    } as any)

    expect(providerSpy).toHaveBeenCalledTimes(1)
    const providerItems = providerSpy.mock.calls[0][2] as Array<
      Record<string, unknown>
    >

    expect(Array.isArray(providerItems)).toBe(true)
    expect(providerItems).toHaveLength(2)

    // The first item originally had quantity 3; the second 5. The provider
    // must receive the same values, not silently-different ones.
    expect(providerItems[0].quantity).toBe(3)
    expect(providerItems[1].quantity).toBe(5)
  })
})
