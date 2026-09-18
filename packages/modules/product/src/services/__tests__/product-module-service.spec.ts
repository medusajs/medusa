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

  it("should link newly added values to products using the existing option", async () => {
    const productOptionService = {
      list: jest.fn().mockResolvedValue([
        {
          id: "option_1",
          values: [
            {
              id: "value_1",
              value: "A",
            },
          ],
        },
      ]),
      upsertWithReplace: jest.fn().mockResolvedValue({
        entities: [
          {
            id: "option_1",
            values: [
              {
                id: "value_1",
                value: "A",
              },
              {
                id: "value_2",
                value: "B",
              },
            ],
          },
        ],
      }),
    }

    const productProductOptionService = {
      list: jest.fn().mockResolvedValue([
        {
          id: "product_option_1",
          product_id: "product_1",
          product_option_id: "option_1",
        },
      ]),
    }

    const productProductOptionValueService = {
      list: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue([]),
    }

    const service = new ProductModuleService(
      {
        productOptionService,
        productProductOptionService,
        productProductOptionValueService,
      } as any,
      {} as any
    )

    const context = {
      transactionManager: {},
    }

    await (service as any).updateOptions_(
      [
        {
          id: "option_1",
          values: ["A", "B"],
        },
      ],
      context
    )

    expect(productProductOptionValueService.create).toHaveBeenCalledWith(
      [
        {
          product_product_option_id: "product_option_1",
          product_option_value_id: "value_2",
        },
      ],
      context
    )
  })
})
