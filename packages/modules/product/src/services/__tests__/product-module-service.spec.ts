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

  it("should get variant images without hydrating all variants across the product", async () => {
    const listProductImagesMock = jest.fn().mockResolvedValue([
      { id: "img_general", product_id: "prod_1", url: "general.jpg" },
      { id: "img_var1", product_id: "prod_1", url: "var1.jpg" },
      { id: "img_var2", product_id: "prod_1", url: "var2.jpg" },
    ])

    const productVariantProductImageListMock = jest
      .fn()
      .mockImplementation((filter) => {
        if (filter.image_id) {
          // img_var1 and img_var2 have variants, img_general has none
          return Promise.resolve([
            { id: "pvpi_1", image_id: "img_var1" },
            { id: "pvpi_2", image_id: "img_var2" },
          ])
        }
        if (filter.variant_id) {
          // only return links for requested variant
          const links = [{ variant_id: "var_1", image_id: "img_var1" }]
          return Promise.resolve(
            links.filter((l) => filter.variant_id.includes(l.variant_id))
          )
        }
        return Promise.resolve([])
      })

    const service = new ProductModuleService(
      {
        productVariantProductImageService: {
          list: productVariantProductImageListMock,
        },
      } as any,
      {} as any
    )
    ;(service as any).listProductImages = listProductImagesMock

    const variants = [{ id: "var_1", product_id: "prod_1" }]
    const result = await (service as any).getVariantImages(variants, {})

    // Verified listProductImages called with empty config (no relations: ['variants'])
    expect(listProductImagesMock).toHaveBeenCalledWith(
      { product_id: ["prod_1"] },
      {},
      {}
    )

    const var1Images = result.get("var_1")
    expect(var1Images).toHaveLength(2)
    // img_general is included as general image (variants: [])
    // img_var1 is included as variant-scoped image (variants: [{ id: 'var_1' }])
    expect(var1Images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "img_general", variants: [] }),
        expect.objectContaining({
          id: "img_var1",
          variants: [{ id: "var_1" }],
        }),
      ])
    )
    // img_var2 belongs to another variant and should NOT be included
    expect(
      var1Images?.find((img: any) => img.id === "img_var2")
    ).toBeUndefined()
  })
})
