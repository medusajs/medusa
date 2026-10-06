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

  describe("updateOptions_ (#16863)", () => {
    it("should link newly added option values to product_product_option_value when option is linked to a product", async () => {
      const productOptionService = {
        list: jest.fn().mockResolvedValue([
          {
            id: "opt_1",
            title: "Type",
            values: [{ id: "val_A", value: "A" }],
          },
        ]),
        upsertWithReplace: jest.fn().mockImplementation(async (input) => ({
          entities: [
            {
              id: "opt_1",
              title: "Type",
              values: [
                { id: "val_A", value: "A" },
                { id: "val_B", value: "B" },
              ],
            },
          ],
        })),
      }
      const productProductOptionService = {
        list: jest.fn().mockResolvedValue([
          {
            id: "ppo_1",
            product_id: "prod_1",
            product_option_id: "opt_1",
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
      const context = { transactionManager: {} }

      await (service as any).updateOptions_(
        [
          {
            id: "opt_1",
            values: ["A", "B"],
          },
        ],
        context
      )

      expect(productProductOptionValueService.create).toHaveBeenCalledWith(
        [
          {
            product_product_option_id: "ppo_1",
            product_option_value_id: "val_B",
          },
        ],
        context
      )
    })
  })
})
