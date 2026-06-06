import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import path from "path"

jest.setTimeout(100000)

import { createProductsWorkflow } from "@zjedene-medusa/core-flows"
import { Modules } from "@zjedene-medusa/utils"
import { TranslationModule } from "../__fixtures__/translation-test/src/modules/translation/service"

const createTranslations = async (container, inputs) => {
  const translationModule: any = container.resolve("translation")

  const created = await translationModule.createTranslations(inputs as any)
  return Array.isArray(created) ? created : [created]
}

const attachTranslationToProduct = async (
  container,
  { productId, translation }
) => {
  const [created] = await createTranslations(container, [translation])

  const remoteLink: any = container.resolve("remoteLink")
  await remoteLink.create({
    [Modules.PRODUCT]: { product_id: productId },
    translation: { translation_id: created.id },
  })

  return created
}

const attachTranslationToVariant = async (
  container,
  { variantId, translation }
) => {
  const [created] = await createTranslations(container, [translation])

  const remoteLink: any = container.resolve("remoteLink")
  await remoteLink.create({
    [Modules.PRODUCT]: { product_variant_id: variantId },
    translation: { translation_id: created.id },
  })

  return created
}

const attachTranslationToOption = async (
  container,
  { optionId, translation }
) => {
  const [created] = await createTranslations(container, [translation])

  const remoteLink: any = container.resolve("remoteLink")
  await remoteLink.create({
    [Modules.PRODUCT]: { product_option_id: optionId },
    translation: { translation_id: created.id },
  })

  return created
}

const attachTranslationToProductCategory = async (
  container,
  { categoryId, translation }
) => {
  const [created] = await createTranslations(container, [translation])

  const remoteLink: any = container.resolve("remoteLink")
  await remoteLink.create({
    [Modules.PRODUCT]: { product_category_id: categoryId },
    translation: { translation_id: created.id },
  })

  return created
}

medusaIntegrationTestRunner({
  cwd: path.join(__dirname, "../__fixtures__/translation-test"),
  testSuite: ({ getContainer }) => {
    describe("query.graph()", () => {
      beforeEach(async () => {
        const container = getContainer()
        const productService: any = container.resolve("product")

        const categories = await Promise.all(
          [1, 2, 3].map((i) =>
            productService.createProductCategories({
              name: `Category ${i}`,
            })
          )
        )

        const buildProduct = (i: number, categoryId: string) => ({
          title: `Product ${i}`,
          category_ids: [categoryId],
          options: [
            {
              title: "size",
              values: ["small", "large"],
            },
          ],
          variants: [
            {
              title: `P${i} Variant 1`,
              options: { size: "small" },
              prices: [
                {
                  amount: 10,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: `P${i} Variant 2`,
              options: { size: "large" },
              prices: [
                {
                  amount: 20,
                  currency_code: "usd",
                },
              ],
            },
          ],
        })

        const createdProducts = await Promise.all(
          [1, 2, 3].map(
            async (i) =>
              await createProductsWorkflow(container).run({
                input: {
                  products: [buildProduct(i, categories[i - 1].id)],
                },
              })
          )
        )

        const productsWithRels = await Promise.all(
          createdProducts.map((p) =>
            productService.retrieveProduct(p.result[0].id, {
              relations: [
                "variants",
                "options",
                "options.values",
                "categories",
              ],
            })
          )
        )

        await Promise.all(
          productsWithRels.map(async (p, idx) => {
            const i = idx + 1
            await attachTranslationToProduct(getContainer(), {
              productId: p.id,
              translation: {
                key: p.id,
                value: {
                  pt: { title: `Produto ${i}` },
                  fr: { title: `Produit ${i}` },
                },
              },
            })

            const cat = p.categories?.[0]
            if (cat) {
              await attachTranslationToProductCategory(getContainer(), {
                categoryId: cat.id,
                translation: {
                  key: cat.id,
                  value: {
                    pt: { name: `Categoria ${i}` },
                    fr: { name: `Catégorie ${i}` },
                  },
                },
              })
            }

            const opt = p.options?.[0]
            if (opt) {
              await attachTranslationToOption(getContainer(), {
                optionId: opt.id,
                translation: {
                  key: opt.id,
                  value: {
                    pt: { title: "Tamanho" },
                    fr: { title: "Taille" },
                  },
                },
              })
            }

            await Promise.all(
              (p.variants || []).map((v, vi) => {
                const variantNumber = v.title.split("").pop()
                return attachTranslationToVariant(getContainer(), {
                  variantId: v.id,
                  translation: {
                    key: v.id,
                    value: {
                      pt: { title: `Variante ${variantNumber}` },
                      fr: { title: `Variante ${variantNumber}` },
                    },
                  },
                })
              })
            )
          })
        )
      })

      it("should call same entity in different levels (variant)", async () => {
        const container = getContainer()
        const query = container.resolve("query")
        const productService = container.resolve(Modules.PRODUCT)
        const inventoryService = container.resolve(Modules.INVENTORY)

        const productServiceSpy = jest.spyOn(
          productService,
          "listProductVariants"
        )
        const inventoryServiceSpy = jest.spyOn(
          inventoryService,
          "listInventoryItems"
        )

        const result = await query.graph({
          entity: "variants",
          fields: [
            "id",
            "manage_inventory",
            "inventory.id",
            "inventory.variants.id",
          ],
        })

        expect(productServiceSpy).toHaveBeenCalledTimes(2)
        expect(inventoryServiceSpy).toHaveBeenCalledTimes(1)
      })

      it("should call services in correct order with parallel execution where possible", async () => {
        const container = getContainer()

        const query = container.resolve("query")
        const productService = container.resolve(Modules.PRODUCT)
        const priceService = container.resolve(Modules.PRICING)
        const translationService = container.resolve(
          "translation"
        ) as TranslationModule

        const productServiceSpy = jest.spyOn(productService, "listProducts")
        const translationServiceSpy = jest.spyOn(
          translationService,
          "listTranslations"
        )
        const priceServiceSpy = jest.spyOn(priceService, "listPriceSets")

        // Execute the query
        const result = await query.graph({
          entity: "product",
          fields: [
            "sales_channels.name",
            "title",
            "translation.*",
            "categories.name",
            "categories.translation.*",
            "variants.title",
            "variants.translation.*",
            "options.title",
            "options.translation.*",
            "variants.prices.amount",
            "variants.prices.currency_code",
          ],
        })

        expect(productServiceSpy.mock.calls[0][1]).toEqual({
          select: [
            "title",
            "variants_id",
            "id",
            "categories.name",
            "categories.id",
            "variants.title",
            "variants.id",
            "options.title",
            "options.id",
          ],
          relations: ["categories", "variants", "options"],
          args: {},
        })

        expect(translationServiceSpy.mock.calls[0][0].id).toHaveLength(3)
        expect(translationServiceSpy.mock.calls[1][0].id).toHaveLength(12)
        expect(priceServiceSpy.mock.calls[0][0].id).toHaveLength(6)

        expect(result.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: "Product 3",
              categories: [
                expect.objectContaining({
                  name: "Category 3",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        name: "Catégorie 3",
                      },
                      pt: {
                        name: "Categoria 3",
                      },
                    },
                  }),
                }),
              ],
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "P3 Variant 2",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Variante 2",
                      },
                      pt: {
                        title: "Variante 2",
                      },
                    },
                  }),
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 20,
                      currency_code: "usd",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "P3 Variant 1",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Variante 1",
                      },
                      pt: {
                        title: "Variante 1",
                      },
                    },
                  }),
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 10,
                      currency_code: "usd",
                    }),
                  ]),
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "size",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Taille",
                      },
                      pt: {
                        title: "Tamanho",
                      },
                    },
                  }),
                }),
              ]),
              sales_channels: [],
              translation: expect.objectContaining({
                value: {
                  fr: {
                    title: "Produit 3",
                  },
                  pt: {
                    title: "Produto 3",
                  },
                },
              }),
            }),
            expect.objectContaining({
              title: "Product 1",
              categories: [
                expect.objectContaining({
                  name: "Category 1",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        name: "Catégorie 1",
                      },
                      pt: {
                        name: "Categoria 1",
                      },
                    },
                  }),
                }),
              ],
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "P1 Variant 2",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Variante 2",
                      },
                      pt: {
                        title: "Variante 2",
                      },
                    },
                  }),
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 20,
                      currency_code: "usd",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "P1 Variant 1",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Variante 1",
                      },
                      pt: {
                        title: "Variante 1",
                      },
                    },
                  }),
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 10,
                      currency_code: "usd",
                    }),
                  ]),
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "size",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Taille",
                      },
                      pt: {
                        title: "Tamanho",
                      },
                    },
                  }),
                }),
              ]),
              sales_channels: [],
              translation: expect.objectContaining({
                value: {
                  fr: {
                    title: "Produit 1",
                  },
                  pt: {
                    title: "Produto 1",
                  },
                },
              }),
            }),
            expect.objectContaining({
              title: "Product 2",
              categories: [
                expect.objectContaining({
                  name: "Category 2",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        name: "Catégorie 2",
                      },
                      pt: {
                        name: "Categoria 2",
                      },
                    },
                  }),
                }),
              ],
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "P2 Variant 1",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Variante 1",
                      },
                      pt: {
                        title: "Variante 1",
                      },
                    },
                  }),
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 10,
                      currency_code: "usd",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "P2 Variant 2",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Variante 2",
                      },
                      pt: {
                        title: "Variante 2",
                      },
                    },
                  }),
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 20,
                      currency_code: "usd",
                    }),
                  ]),
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "size",
                  translation: expect.objectContaining({
                    value: {
                      fr: {
                        title: "Taille",
                      },
                      pt: {
                        title: "Tamanho",
                      },
                    },
                  }),
                }),
              ]),
              sales_channels: [],
              translation: expect.objectContaining({
                value: {
                  fr: {
                    title: "Produit 2",
                  },
                  pt: {
                    title: "Produto 2",
                  },
                },
              }),
            }),
          ])
        )
      })
    })
  },
})
