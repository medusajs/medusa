import ProductModuleService from "../product-module-service"

describe("ProductModuleService", () => {
  it("should merge variant metadata before replacing the entity", async () => {
    const productVariantService = {
      list: jest.fn().mockResolvedValue([
        {
          id: "variant_1",
          product_id: "product_1",
          metadata: {
            keep: "value",
            remove: "value",
          },
        },
      ]),
      upsertWithReplace: jest.fn().mockImplementation(async (input) => ({
        entities: input,
      })),
    }
    const service = new ProductModuleService(
      {
        productVariantService,
      } as any,
      {} as any
    )
    const context = {
      transactionManager: {},
    }

    await (service as any).updateVariants_(
      [
        {
          id: "variant_1",
          metadata: {
            remove: "",
          },
        },
      ],
      context
    )

    expect(productVariantService.upsertWithReplace).toHaveBeenCalledWith(
      [
        {
          id: "variant_1",
          product_id: "product_1",
          metadata: {
            keep: "value",
          },
        },
      ],
      {
        relations: [],
      },
      context
    )
  })
})
