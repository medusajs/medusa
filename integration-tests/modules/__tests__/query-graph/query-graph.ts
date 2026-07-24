import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import path from "path"

jest.setTimeout(100000)

import { createProductsWorkflow } from "@medusajs/core-flows"
import { Modules, QueryContext } from "@medusajs/utils"
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

      describe("cross-module filtering", () => {
        it("should filter variants by linked price set id", async () => {
          const container = getContainer()
          const query = container.resolve("query")

          const { data: variants } = await query.graph({
            entity: "variant",
            fields: ["id", "title", "price_set.id"],
          })

          const targetVariant = variants.find(
            (variant) => variant.title === "P1 Variant 1"
          )

          expect(targetVariant?.price_set?.id).toBeDefined()

          const { data: filteredVariants } = await query.graph({
            entity: "variant",
            fields: ["id", "title"],
            filters: {
              price_set: {
                id: targetVariant!.price_set!.id,
              },
            },
          })

          expect(filteredVariants).toHaveLength(1)
          expect(filteredVariants[0]).toEqual(
            expect.objectContaining({
              id: targetVariant!.id,
              title: "P1 Variant 1",
            })
          )
        })

        it("should filter products by linked translation key", async () => {
          const container = getContainer()
          const query = container.resolve("query")

          const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "translation.key"],
          })

          const targetProduct = products.find(
            (product) => product.title === "Product 2"
          )

          expect(targetProduct?.translation?.key).toBeDefined()

          const { data: filteredProducts } = await query.graph({
            entity: "product",
            fields: ["id", "title"],
            filters: {
              translation: {
                key: targetProduct!.translation!.key,
              },
            },
          })

          expect(filteredProducts).toHaveLength(1)
          expect(filteredProducts[0]).toEqual(
            expect.objectContaining({
              id: targetProduct!.id,
              title: "Product 2",
            })
          )
        })

        it("should filter price sets by linked variant id", async () => {
          const container = getContainer()
          const query = container.resolve("query")

          const { data: variants } = await query.graph({
            entity: "variant",
            fields: ["id", "title", "price_set.id"],
          })

          const targetVariant = variants.find(
            (variant) => variant.title === "P2 Variant 2"
          )

          expect(targetVariant?.price_set?.id).toBeDefined()

          const { data: filteredPriceSets } = await query.graph({
            entity: "price_set",
            fields: ["id"],
            filters: {
              variant: {
                id: targetVariant!.id,
              },
            },
          })

          expect(filteredPriceSets).toHaveLength(1)
          expect(filteredPriceSets[0]).toEqual(
            expect.objectContaining({
              id: targetVariant!.price_set!.id,
            })
          )
        })

        // Traverses a module-internal relation (cart -> items) before crossing
        // modules twice (line item -> product via read-only link, product ->
        // sales channel via link module).
        it("should filter carts by product sales channel", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const remoteLink: any = container.resolve("remoteLink")
          const cartService: any = container.resolve(Modules.CART)
          const salesChannelService: any = container.resolve(
            Modules.SALES_CHANNEL
          )

          const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title"],
          })

          const retailProduct = products.find(
            (product) => product.title === "Product 1"
          )
          const wholesaleProduct = products.find(
            (product) => product.title === "Product 2"
          )

          expect(retailProduct).toBeDefined()
          expect(wholesaleProduct).toBeDefined()

          const retailChannel = await salesChannelService.createSalesChannels({
            name: "Retail Store",
          })
          const wholesaleChannel =
            await salesChannelService.createSalesChannels({
              name: "Wholesale Store",
            })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: { product_id: retailProduct!.id },
              [Modules.SALES_CHANNEL]: { sales_channel_id: retailChannel.id },
            },
            {
              [Modules.PRODUCT]: { product_id: wholesaleProduct!.id },
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: wholesaleChannel.id,
              },
            },
          ])

          await cartService.createCarts([
            {
              currency_code: "usd",
              email: "retail-cart@test.com",
              items: [
                {
                  title: retailProduct!.title,
                  product_id: retailProduct!.id,
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
            {
              currency_code: "usd",
              email: "wholesale-cart@test.com",
              items: [
                {
                  title: wholesaleProduct!.title,
                  product_id: wholesaleProduct!.id,
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
          ])

          const { data: filteredCarts } = await query.graph({
            entity: "cart",
            fields: ["id", "email"],
            filters: {
              items: {
                product: {
                  sales_channels: {
                    name: "Retail Store",
                  },
                },
              },
            },
          })

          expect(filteredCarts).toHaveLength(1)
          expect(filteredCarts[0]).toEqual(
            expect.objectContaining({
              email: "retail-cart@test.com",
            })
          )
        })

        it("should filter by linked entity using operators", async () => {
          const container = getContainer()
          const query = container.resolve("query")

          const { data: variants } = await query.graph({
            entity: "variant",
            fields: ["id", "title", "price_set.id"],
          })

          const targetVariants = variants.filter((variant) =>
            ["P1 Variant 1", "P2 Variant 1"].includes(variant.title)
          )
          const priceSetIds = targetVariants.map(
            (variant) => variant.price_set!.id
          )

          expect(priceSetIds).toHaveLength(2)

          const { data: filteredVariants } = await query.graph({
            entity: "variant",
            fields: ["id", "title"],
            filters: {
              price_set: {
                id: { $in: priceSetIds },
              },
            },
          })

          expect(filteredVariants).toHaveLength(2)
          expect(
            filteredVariants.map((variant) => variant.title).sort()
          ).toEqual(["P1 Variant 1", "P2 Variant 1"])
        })

        it("should combine native and cross-module filters", async () => {
          const container = getContainer()
          const query = container.resolve("query")

          const { data: variants } = await query.graph({
            entity: "variant",
            fields: ["id", "title", "price_set.id"],
          })

          const p1Variant = variants.find(
            (variant) => variant.title === "P1 Variant 1"
          )
          const p2Variant = variants.find(
            (variant) => variant.title === "P2 Variant 1"
          )

          const { data: matching } = await query.graph({
            entity: "variant",
            fields: ["id", "title"],
            filters: {
              title: "P1 Variant 1",
              price_set: { id: p1Variant!.price_set!.id },
            },
          })

          expect(matching).toHaveLength(1)
          expect(matching[0].id).toEqual(p1Variant!.id)

          // Same native filter, but the linked filter points elsewhere: the
          // conditions must intersect, not union.
          const { data: disjoint } = await query.graph({
            entity: "variant",
            fields: ["id", "title"],
            filters: {
              title: "P1 Variant 1",
              price_set: { id: p2Variant!.price_set!.id },
            },
          })

          expect(disjoint).toHaveLength(0)
        })

        it("should return no rows when the linked filter matches nothing", async () => {
          const container = getContainer()
          const query = container.resolve("query")

          const { data: filteredVariants } = await query.graph({
            entity: "variant",
            fields: ["id"],
            filters: {
              price_set: { id: "pset_does_not_exist" },
            },
          })

          expect(filteredVariants).toHaveLength(0)
        })

        it("should return the linked relation while filtering by it", async () => {
          const container = getContainer()
          const query = container.resolve("query")

          const { data: variants } = await query.graph({
            entity: "variant",
            fields: ["id", "title", "price_set.id"],
          })

          const targetVariant = variants.find(
            (variant) => variant.title === "P3 Variant 2"
          )

          const { data: filteredVariants } = await query.graph({
            entity: "variant",
            fields: ["id", "title", "price_set.id"],
            filters: {
              price_set: { id: targetVariant!.price_set!.id },
            },
          })

          expect(filteredVariants).toHaveLength(1)
          expect(filteredVariants[0]).toEqual(
            expect.objectContaining({
              id: targetVariant!.id,
              price_set: expect.objectContaining({
                id: targetVariant!.price_set!.id,
              }),
            })
          )
        })

        it("should filter carts by a read-only link on the root entity", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const cartService: any = container.resolve(Modules.CART)
          const salesChannelService: any = container.resolve(
            Modules.SALES_CHANNEL
          )

          const retailChannel = await salesChannelService.createSalesChannels({
            name: "Retail Store",
          })
          const wholesaleChannel =
            await salesChannelService.createSalesChannels({
              name: "Wholesale Store",
            })

          await cartService.createCarts([
            {
              currency_code: "usd",
              email: "retail-cart@test.com",
              sales_channel_id: retailChannel.id,
            },
            {
              currency_code: "usd",
              email: "wholesale-cart@test.com",
              sales_channel_id: wholesaleChannel.id,
            },
          ])

          const { data: filteredCarts } = await query.graph({
            entity: "cart",
            fields: ["id", "email"],
            filters: {
              sales_channel: {
                name: "Retail Store",
              },
            },
          })

          expect(filteredCarts).toHaveLength(1)
          expect(filteredCarts[0]).toEqual(
            expect.objectContaining({
              email: "retail-cart@test.com",
            })
          )
        })

        // Order uses a custom find/findAndCount that bypasses the base
        // repository prepareFindOptions — this covers that those methods apply
        // cross-module join filters themselves.
        it("should filter orders by a read-only linked sales channel", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const orderService: any = container.resolve(Modules.ORDER)
          const salesChannelService: any = container.resolve(
            Modules.SALES_CHANNEL
          )

          const retailChannel = await salesChannelService.createSalesChannels({
            name: "Order Retail Channel",
          })
          const wholesaleChannel =
            await salesChannelService.createSalesChannels({
              name: "Order Wholesale Channel",
            })

          await orderService.createOrders([
            {
              currency_code: "usd",
              email: "retail-order@test.com",
              sales_channel_id: retailChannel.id,
              items: [
                {
                  title: "Retail item",
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
            {
              currency_code: "usd",
              email: "wholesale-order@test.com",
              sales_channel_id: wholesaleChannel.id,
              items: [
                {
                  title: "Wholesale item",
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
          ])

          const { data: filteredOrders } = await query.graph({
            entity: "order",
            fields: ["id", "email"],
            filters: {
              sales_channel: {
                name: "Order Retail Channel",
              },
            },
          })

          expect(filteredOrders).toHaveLength(1)
          expect(filteredOrders[0]).toEqual(
            expect.objectContaining({
              email: "retail-order@test.com",
            })
          )
        })

        it("should filter carts by a field of the read-only linked product", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const cartService: any = container.resolve(Modules.CART)

          const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "handle"],
          })

          const productOne = products.find(
            (product) => product.title === "Product 1"
          )
          const productTwo = products.find(
            (product) => product.title === "Product 2"
          )

          await cartService.createCarts([
            {
              currency_code: "usd",
              email: "cart-one@test.com",
              items: [
                {
                  title: productOne!.title,
                  product_id: productOne!.id,
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
            {
              currency_code: "usd",
              email: "cart-two@test.com",
              items: [
                {
                  title: productTwo!.title,
                  product_id: productTwo!.id,
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
          ])

          const { data: filteredCarts } = await query.graph({
            entity: "cart",
            fields: ["id", "email"],
            filters: {
              items: {
                product: {
                  handle: productOne!.handle,
                },
              },
            },
          })

          expect(filteredCarts).toHaveLength(1)
          expect(filteredCarts[0]).toEqual(
            expect.objectContaining({
              email: "cart-one@test.com",
            })
          )
        })

        it("should combine root and expand cross-module filters", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const cartService: any = container.resolve(Modules.CART)
          const salesChannelService: any = container.resolve(
            Modules.SALES_CHANNEL
          )

          const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "handle"],
          })

          const productOne = products.find(
            (product) => product.title === "Product 1"
          )
          const productTwo = products.find(
            (product) => product.title === "Product 2"
          )

          const retailChannel = await salesChannelService.createSalesChannels({
            name: "Retail Store",
          })
          const wholesaleChannel = await salesChannelService.createSalesChannels(
            {
              name: "Wholesale Store",
            }
          )

          const buildCart = (
            email: string,
            channelId: string,
            product: { title: string; id: string }
          ) => ({
            currency_code: "usd",
            email,
            sales_channel_id: channelId,
            items: [
              {
                title: product.title,
                product_id: product.id,
                quantity: 1,
                unit_price: 100,
              },
            ],
          })

          await cartService.createCarts([
            // Matches both filters.
            buildCart("match@test.com", retailChannel.id, productOne!),
            // Matches only the root filter (retail channel, other product).
            buildCart("root-only@test.com", retailChannel.id, productTwo!),
            // Matches only the expand filter (other channel, right product).
            buildCart("expand-only@test.com", wholesaleChannel.id, productOne!),
          ])

          // `sales_channel` is filtered at the root level (read-only link on
          // the cart itself), while `items.product` lands on an expand node —
          // both must be pushed down and intersect.
          const { data: filteredCarts } = await query.graph({
            entity: "cart",
            fields: ["id", "email"],
            filters: {
              sales_channel: {
                name: "Retail Store",
              },
              items: {
                product: {
                  handle: productOne!.handle,
                },
              },
            },
          })

          expect(filteredCarts).toHaveLength(1)
          expect(filteredCarts[0]).toEqual(
            expect.objectContaining({
              email: "match@test.com",
            })
          )
        })

        it("should filter through an inverse read-only link and an internal relation", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const cartService: any = container.resolve(Modules.CART)
          const salesChannelService: any = container.resolve(
            Modules.SALES_CHANNEL
          )

          const retailChannel = await salesChannelService.createSalesChannels({
            name: "Retail Store",
          })
          const wholesaleChannel = await salesChannelService.createSalesChannels(
            {
              name: "Wholesale Store",
            }
          )

          await cartService.createCarts([
            {
              currency_code: "usd",
              email: "retail-cart@test.com",
              sales_channel_id: retailChannel.id,
              items: [
                {
                  title: "Retail Item",
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
            {
              currency_code: "usd",
              email: "wholesale-cart@test.com",
              sales_channel_id: wholesaleChannel.id,
              items: [
                {
                  title: "Wholesale Item",
                  quantity: 1,
                  unit_price: 100,
                },
              ],
            },
          ])

          // Inverse read-only link: the join column (cart.sales_channel_id)
          // lives on the target table.
          const { data: channelsByCartEmail } = await query.graph({
            entity: "sales_channel",
            fields: ["id", "name"],
            filters: {
              carts: { email: "retail-cart@test.com" },
            },
          })

          expect(channelsByCartEmail).toHaveLength(1)
          expect(channelsByCartEmail[0]).toEqual(
            expect.objectContaining({ name: "Retail Store" })
          )

          // Internal relation chained after the inverse link must correlate
          // on the cart's PK, not the inverse join column.
          const { data: channelsByItemTitle } = await query.graph({
            entity: "sales_channel",
            fields: ["id", "name"],
            filters: {
              carts: {
                items: { title: "Wholesale Item" },
              },
            },
          })

          expect(channelsByItemTitle).toHaveLength(1)
          expect(channelsByItemTitle[0]).toEqual(
            expect.objectContaining({ name: "Wholesale Store" })
          )
        })

        it("should sort by a cross-module field", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const cartService: any = container.resolve(Modules.CART)
          const salesChannelService: any = container.resolve(
            Modules.SALES_CHANNEL
          )

          const alphaChannel = await salesChannelService.createSalesChannels({
            name: "Alpha Store",
          })
          const zuluChannel = await salesChannelService.createSalesChannels({
            name: "Zulu Store",
          })

          await cartService.createCarts([
            {
              currency_code: "usd",
              email: "alpha-cart@test.com",
              sales_channel_id: alphaChannel.id,
            },
            {
              currency_code: "usd",
              email: "zulu-cart@test.com",
              sales_channel_id: zuluChannel.id,
            },
          ])

          const { data: descendingCarts } = await query.graph({
            entity: "cart",
            fields: ["id", "email"],
            pagination: {
              order: {
                sales_channel: { name: "DESC" },
              },
            },
          })

          expect(descendingCarts.map((cart) => cart.email)).toEqual([
            "zulu-cart@test.com",
            "alpha-cart@test.com",
          ])

          const { data: ascendingCarts } = await query.graph({
            entity: "cart",
            fields: ["id", "email"],
            pagination: {
              order: {
                sales_channel: { name: "ASC" },
              },
            },
          })

          expect(ascendingCarts.map((cart) => cart.email)).toEqual([
            "alpha-cart@test.com",
            "zulu-cart@test.com",
          ])
        })

        it("should paginate and count correctly with cross-module filters", async () => {
          const container = getContainer()
          const query = container.resolve("query")
          const cartService: any = container.resolve(Modules.CART)
          const salesChannelService: any = container.resolve(
            Modules.SALES_CHANNEL
          )

          const retailChannel = await salesChannelService.createSalesChannels({
            name: "Retail Store",
          })
          const wholesaleChannel =
            await salesChannelService.createSalesChannels({
              name: "Wholesale Store",
            })

          await cartService.createCarts([
            ...[1, 2, 3].map((i) => ({
              currency_code: "usd",
              email: `retail-cart-${i}@test.com`,
              sales_channel_id: retailChannel.id,
            })),
            {
              currency_code: "usd",
              email: "wholesale-cart@test.com",
              sales_channel_id: wholesaleChannel.id,
            },
          ])

          const { data: filteredCarts, metadata } = await query.graph({
            entity: "cart",
            fields: ["id", "email"],
            filters: {
              sales_channel: {
                name: "Retail Store",
              },
            },
            pagination: {
              skip: 0,
              take: 2,
            },
          })

          expect(filteredCarts).toHaveLength(2)
          expect(metadata?.count).toEqual(3)
          expect(
            filteredCarts.every((cart) => cart.email.startsWith("retail-cart-"))
          ).toBe(true)
        })

        // Stage 2: filters that cannot be pushed down to SQL (unsupported
        // operators, computed fields) are completed in memory after the
        // fetch, with pagination applied to the filtered set.
        describe("residual (in-memory) filtering", () => {
          it("should complete unsupported-operator filters in memory", async () => {
            const container = getContainer()
            const query = container.resolve("query")

            const { data: products } = await query.graph({
              entity: "product",
              fields: ["id", "title", "translation.key"],
            })

            const targetProduct = products.find(
              (product) => product.title === "Product 2"
            )

            expect(targetProduct?.translation?.key).toBeDefined()

            // $re is not supported by the SQL pushdown, so the filter is
            // evaluated in memory against the loaded translations.
            const { data: filteredProducts } = await query.graph({
              entity: "product",
              fields: ["id", "title"],
              filters: {
                translation: {
                  key: { $re: `^${targetProduct!.translation!.key}$` },
                },
              },
            })

            expect(filteredProducts).toHaveLength(1)
            expect(filteredProducts[0]).toEqual(
              expect.objectContaining({
                id: targetProduct!.id,
                title: "Product 2",
              })
            )
            // The translation was loaded only for evaluation and is hidden
            // from the payload.
            expect(filteredProducts[0].translation).toBeUndefined()
          })

          it("should combine pushed-down and residual filters", async () => {
            const container = getContainer()
            const query = container.resolve("query")

            const { data: variants } = await query.graph({
              entity: "variant",
              fields: ["id", "title", "price_set.id", "translation.key"],
            })

            const targetVariant = variants.find(
              (variant) => variant.title === "P1 Variant 1"
            )
            const otherVariant = variants.find(
              (variant) => variant.title === "P2 Variant 1"
            )

            expect(targetVariant?.price_set?.id).toBeDefined()
            expect(targetVariant?.translation?.key).toBeDefined()

            // price_set.id is pushed down to SQL while translation.key with
            // $re stays residual — both must intersect.
            const { data: matching } = await query.graph({
              entity: "variant",
              fields: ["id", "title"],
              filters: {
                price_set: { id: targetVariant!.price_set!.id },
                translation: {
                  key: { $re: `^${targetVariant!.translation!.key}$` },
                },
              },
            })

            expect(matching).toHaveLength(1)
            expect(matching[0].id).toEqual(targetVariant!.id)

            // The pushed filter points at another variant: intersection is
            // empty even though the residual filter matches.
            const { data: disjoint } = await query.graph({
              entity: "variant",
              fields: ["id"],
              filters: {
                price_set: { id: otherVariant!.price_set!.id },
                translation: {
                  key: { $re: `^${targetVariant!.translation!.key}$` },
                },
              },
            })

            expect(disjoint).toHaveLength(0)
          })

          it("should filter by a computed field in memory", async () => {
            const container = getContainer()
            const query = container.resolve("query")

            // calculated_price is a computed field, so the filter cannot be
            // pushed down and is evaluated in memory against the computed
            // values (variant 1 of each product costs 10 usd, variant 2
            // costs 20 usd).
            const { data: filteredVariants } = await query.graph({
              entity: "variant",
              fields: ["id", "title"],
              filters: {
                price_set: {
                  calculated_price: { calculated_amount: { $gt: 15 } },
                },
              },
              context: {
                calculated_price: QueryContext({ currency_code: "usd" }),
              },
            })

            expect(filteredVariants).toHaveLength(3)
            expect(
              filteredVariants.every((variant) =>
                variant.title.endsWith("Variant 2")
              )
            ).toBe(true)
            expect(filteredVariants[0].price_set).toBeUndefined()
          })

          it("should filter and sort variants by calculated price", async () => {
            const container = getContainer()
            const query = container.resolve("query")

            // The seeded products all price their variants at 10/20 usd; add
            // one with distinct prices so the ordering is observable.
            await createProductsWorkflow(container).run({
              input: {
                products: [
                  {
                    title: "Product 4",
                    options: [{ title: "size", values: ["small", "large"] }],
                    variants: [
                      {
                        title: "P4 Variant 1",
                        options: { size: "small" },
                        prices: [{ amount: 5, currency_code: "usd" }],
                      },
                      {
                        title: "P4 Variant 2",
                        options: { size: "large" },
                        prices: [{ amount: 30, currency_code: "usd" }],
                      },
                    ],
                  },
                ],
              },
            })

            // Both the filter and the primary sort key target the computed
            // calculated_price, so filtering, sorting, and pagination all
            // complete in memory (title breaks ties between equal amounts).
            const { data: variants, metadata } = await query.graph({
              entity: "variant",
              fields: ["id", "title", "calculated_price.calculated_amount"],
              filters: {
                price_set: {
                  calculated_price: { calculated_amount: { $gt: 8 } },
                },
              },
              pagination: {
                order: {
                  price_set: {
                    calculated_price: { calculated_amount: "DESC" },
                  },
                  title: "ASC",
                },
                skip: 0,
                take: 4,
              },
              context: {
                calculated_price: QueryContext({ currency_code: "usd" }),
              },
            })

            // 5 usd is filtered out; 30, 20, 20, 20, 10, 10, 10 remain.
            expect(metadata?.count).toEqual(7)
            expect(variants.map((variant) => variant.title)).toEqual([
              "P4 Variant 2",
              "P1 Variant 2",
              "P2 Variant 2",
              "P3 Variant 2",
            ])
            expect(
              variants.map(
                (variant) => variant.calculated_price?.calculated_amount
              )
            ).toEqual([30, 20, 20, 20])
          })

          it("should paginate after in-memory filtering", async () => {
            const container = getContainer()
            const query = container.resolve("query")

            // Every product's translation key is its id, so the residual
            // regex matches all three products before pagination.
            const { data: filteredProducts, metadata } = await query.graph({
              entity: "product",
              fields: ["id", "title"],
              filters: {
                translation: { key: { $re: "^prod" } },
              },
              pagination: {
                skip: 1,
                take: 1,
                order: { title: "ASC" },
              },
            })

            expect(metadata?.count).toEqual(3)
            expect(filteredProducts).toHaveLength(1)
            expect(filteredProducts[0].title).toEqual("Product 2")
          })
        })
      })
    })
  },
})
