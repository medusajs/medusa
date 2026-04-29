import CustomerModule from "@medusajs/customer"
import ProductModule from "@medusajs/product"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { RemoteQueryFunction } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  defaultCurrencies,
  defineLink,
  Modules,
  promiseAll,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { fetchAndRetry } from "../../../helpers/retry"
import { waitForIndexedEntities } from "../../../helpers/wait-for-index"

jest.setTimeout(300000)

// NOTE: In this tests, both API are used to query, we use object pattern and string pattern

async function populateData(api: any) {
  const shippingProfile = (
    await api.post(
      `/admin/shipping-profiles`,
      { name: "Test", type: "default" },
      adminHeaders
    )
  ).data.shipping_profile

  const payload = [
    {
      title: "Test Product",
      status: "published",
      description: "test-product-description",
      origin_country: "USA",
      shipping_profile_id: shippingProfile.id,
      options: [{ title: "Denominations", values: ["100"] }],
      material: "test-material",
      variants: [
        {
          title: `Test variant 1`,
          sku: `test-variant-1`,
          prices: [
            {
              currency_code: Object.values(defaultCurrencies)[0].code,
              amount: 30,
            },
            {
              currency_code: Object.values(defaultCurrencies)[2].code,
              amount: 50,
            },
          ],
          options: {
            Denominations: "100",
          },
        },
      ],
    },
    {
      title: "Extra product",
      description: "extra description",
      status: "published",
      shipping_profile_id: shippingProfile.id,
      options: [{ title: "Colors", values: ["Red"] }],
      material: "extra-material",
      variants: new Array(2).fill(0).map((_, i) => ({
        title: `extra variant ${i}`,
        sku: `extra-variant-${i}`,
        prices: [
          {
            currency_code: Object.values(defaultCurrencies)[1].code,
            amount: 20,
          },
          {
            currency_code: Object.values(defaultCurrencies)[0].code,
            amount: 80,
          },
        ],
        options: {
          Colors: "Red",
        },
      })),
    },
  ]

  const response = await api.post(
    "/admin/products/batch",
    { create: payload },
    adminHeaders
  )
  const products = response.data.created

  return products
}

process.env.ENABLE_INDEX_MODULE = "true"

medusaIntegrationTestRunner({
  hooks: {
    beforeServerStart: async () => {
      const customer = CustomerModule.linkable.customer
      const product = ProductModule.linkable.product

      defineLink(customer, {
        linkable: product,
        filterable: ["origin_country"],
      })
    },
  },
  testSuite: ({ getContainer, dbConnection, api, dbConfig }) => {
    let appContainer

    describe("Index engine - Query.index", () => {
      beforeAll(() => {
        appContainer = getContainer()
      })

      afterAll(() => {
        process.env.ENABLE_INDEX_MODULE = "false"
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should use query.index to query the index module and hydrate the data", async () => {
        const products = await populateData(api)

        const brandModule = appContainer.resolve("brand")
        const link = appContainer.resolve(ContainerRegistrationKeys.LINK)
        const brand = await brandModule.createBrands({
          name: "Medusa Brand",
        })

        const [createdLink] = await link.create({
          [Modules.PRODUCT]: {
            product_id: products.find((p) => p.title === "Extra product").id,
          },
          brand: {
            brand_id: brand.id,
          },
        })

        const query = appContainer.resolve(
          ContainerRegistrationKeys.QUERY
        ) as RemoteQueryFunction

        await promiseAll([
          waitForIndexedEntities(
            dbConnection,
            "Product",
            products.map((p) => p.id)
          ),
          waitForIndexedEntities(
            dbConnection,
            "ProductVariant",
            products.flatMap((p) => p.variants.map((v) => v.id))
          ),
          waitForIndexedEntities(
            dbConnection,
            "Price",
            products.flatMap((p) =>
              p.variants.flatMap((v) => v.prices.map((p) => p.id))
            )
          ),
          waitForIndexedEntities(dbConnection, "Brand", [brand.id]),
          waitForIndexedEntities(
            dbConnection,
            "ProductProductBrandBrand",
            [createdLink.id],
            {
              isLink: true,
            }
          ),
        ])

        const resultset = await fetchAndRetry(
          async () =>
            await query.index({
              entity: "product",
              fields: [
                "id",
                "description",
                "status",
                "title",
                "brand.name",
                "brand.id",
                "variants.sku",
                "variants.barcode",
                "variants.material",
                "variants.options.value",
                "variants.prices.amount",
                "variants.prices.currency_code",
                "variants.inventory_items.inventory.sku",
                "variants.inventory_items.inventory.description",
              ],
              filters: {
                $and: [
                  { status: "published" },
                  { material: { $ilike: "%material%" } },
                  {
                    $or: [
                      {
                        brand: {
                          name: { $ilike: "%brand" },
                        },
                      },
                      { title: { $ilike: "%duct%" } },
                    ],
                  },
                  {
                    variants: {
                      $and: [
                        { sku: { $like: "%-1" } },
                        { "prices.amount": { $gt: 30 } },
                      ],
                    },
                  },
                ],
              },
              pagination: {
                take: 10,
                skip: 0,
                order: {
                  "variants.prices.amount": "DESC",
                },
              },
            }),
          ({ data }) => data.length > 0
        )

        expect(resultset.metadata).toEqual({
          estimate_count: expect.any(Number),
          skip: 0,
          take: 10,
        })
        expect(resultset.data).toEqual([
          {
            id: expect.any(String),
            description: "extra description",
            title: "Extra product",
            status: "published",
            brand: {
              id: expect.any(String),
              name: "Medusa Brand",
            },
            variants: [
              {
                sku: "extra-variant-0",
                barcode: null,
                material: null,
                id: expect.any(String),
                options: [
                  {
                    value: "Red",
                  },
                ],
                inventory_items: [
                  {
                    variant_id: expect.any(String),
                    inventory_item_id: expect.any(String),
                    inventory: {
                      sku: "extra-variant-0",
                      description: "extra variant 0",
                      id: expect.any(String),
                    },
                  },
                ],
                prices: expect.arrayContaining([
                  {
                    currency_code: "cad",
                    amount: 20,
                    id: expect.any(String),
                  },
                  {
                    currency_code: "usd",
                    amount: 80,
                    id: expect.any(String),
                  },
                ]),
              },
              {
                sku: "extra-variant-1",
                barcode: null,
                material: null,
                id: expect.any(String),
                options: [
                  {
                    value: "Red",
                  },
                ],
                prices: expect.arrayContaining([
                  {
                    amount: 20,
                    currency_code: "cad",
                    id: expect.any(String),
                  },
                  {
                    amount: 80,
                    currency_code: "usd",
                    id: expect.any(String),
                  },
                ]),
                inventory_items: [
                  {
                    variant_id: expect.any(String),
                    inventory_item_id: expect.any(String),
                    inventory: {
                      sku: "extra-variant-1",
                      description: "extra variant 1",
                      id: expect.any(String),
                    },
                  },
                ],
              },
            ],
          },
          {
            id: expect.any(String),
            description: "test-product-description",
            title: "Test Product",
            status: "published",
            brand: undefined,
            variants: [
              {
                sku: "test-variant-1",
                barcode: null,
                material: null,
                id: expect.any(String),
                options: [
                  {
                    value: "100",
                  },
                ],
                prices: expect.arrayContaining([
                  {
                    amount: 30,
                    currency_code: "usd",
                    id: expect.any(String),
                  },
                  {
                    amount: 50,
                    currency_code: "eur",
                    id: expect.any(String),
                  },
                ]),
                inventory_items: [
                  {
                    variant_id: expect.any(String),
                    inventory_item_id: expect.any(String),
                    inventory: {
                      sku: "test-variant-1",
                      description: "Test variant 1",
                      id: expect.any(String),
                    },
                  },
                ],
              },
            ],
          },
        ])
      })

      it("should use query.index to query the index module sorting by price desc", async () => {
        const products = await populateData(api)

        const query = appContainer.resolve(
          ContainerRegistrationKeys.QUERY
        ) as RemoteQueryFunction

        await promiseAll([
          waitForIndexedEntities(
            dbConnection,
            "Product",
            products.map((p) => p.id)
          ),
          waitForIndexedEntities(
            dbConnection,
            "ProductVariant",
            products.flatMap((p) => p.variants.map((v) => v.id))
          ),
          waitForIndexedEntities(
            dbConnection,
            "Price",
            products.flatMap((p) =>
              p.variants.flatMap((v) => v.prices.map((p) => p.id))
            )
          ),
        ])

        const resultset = await fetchAndRetry(
          async () =>
            await query.index({
              entity: "product",
              fields: [
                "id",
                "variants.prices.amount",
                "variants.prices.currency_code",
              ],
              filters: {
                "variants.prices.currency_code": "usd",
              },
              pagination: {
                take: 1,
                skip: 0,
                order: {
                  "variants.prices.amount": "DESC",
                },
              },
            }),
          ({ data }) => data.length > 0
        )

        // Limiting to 1 on purpose to keep it simple and check the correct order is maintained
        expect(resultset.data).toEqual([
          {
            id: expect.any(String),
            variants: expect.arrayContaining([
              expect.objectContaining({
                prices: expect.arrayContaining([
                  {
                    amount: 20,
                    currency_code: "cad",
                    id: expect.any(String),
                  },
                  {
                    amount: 80,
                    currency_code: "usd",
                    id: expect.any(String),
                  },
                ]),
              }),
            ]),
          },
        ])

        const resultset2 = await fetchAndRetry(
          async () =>
            query.index({
              entity: "product",
              fields: [
                "id",
                "variants.prices.amount",
                "variants.prices.currency_code",
              ],
              filters: {
                variants: {
                  prices: {
                    currency_code: "usd",
                  },
                },
              },
              pagination: {
                take: 1,
                skip: 0,
                order: {
                  variants: {
                    prices: {
                      amount: "ASC",
                    },
                  },
                },
              },
            }),
          ({ data }) => data.length > 0
        )

        // Limiting to 1 on purpose to keep it simple and check the correct order is maintained
        expect(resultset2.data).toEqual([
          {
            id: expect.any(String),
            variants: [
              expect.objectContaining({
                prices: expect.arrayContaining([
                  {
                    amount: 30,
                    currency_code: "usd",
                    id: expect.any(String),
                  },
                  {
                    amount: 50,
                    currency_code: "eur",
                    id: expect.any(String),
                  },
                ]),
              }),
            ],
          },
        ])
      })

      it("should use query.index to get products by an array of handles", async () => {
        const products = await populateData(api)

        await promiseAll([
          waitForIndexedEntities(
            dbConnection,
            "Product",
            products.map((p) => p.id)
          ),
          waitForIndexedEntities(
            dbConnection,
            "ProductVariant",
            products.flatMap((p) => p.variants.map((v) => v.id))
          ),
          waitForIndexedEntities(
            dbConnection,
            "Price",
            products.flatMap((p) =>
              p.variants.flatMap((v) => v.prices.map((p) => p.id))
            )
          ),
        ])

        const query = appContainer.resolve(
          ContainerRegistrationKeys.QUERY
        ) as RemoteQueryFunction

        const resultset = await fetchAndRetry(
          async () =>
            await query.index({
              entity: "product",
              fields: ["id"],
              filters: {
                handle: ["extra-product", "test-product"],
              },
              pagination: {
                take: 10,
                skip: 0,
                order: {
                  "variants.prices.amount": "DESC",
                },
              },
            }),
          ({ data }) => data.length > 0
        )

        expect(resultset.data.length).toEqual(2)
      })

      it("should query by custom linkable field and default field using query.index", async () => {
        const products = await populateData(api)

        await promiseAll([
          waitForIndexedEntities(
            dbConnection,
            "Product",
            products.map((p) => p.id)
          ),
          waitForIndexedEntities(
            dbConnection,
            "ProductVariant",
            products.flatMap((p) => p.variants.map((v) => v.id))
          ),
          waitForIndexedEntities(
            dbConnection,
            "Price",
            products.flatMap((p) =>
              p.variants.flatMap((v) => v.prices.map((p) => p.id))
            )
          ),
        ])

        const query = appContainer.resolve(
          ContainerRegistrationKeys.QUERY
        ) as RemoteQueryFunction

        const resultset = await fetchAndRetry(
          async () =>
            await query.index({
              entity: "product",
              fields: ["id", "origin_country"],
              filters: {
                origin_country: ["USA"],
              },
            }),
          ({ data }) => data.length > 0
        )

        expect(resultset.data.length).toEqual(1)
        expect(resultset.data[0].origin_country).toEqual("USA")
      })

      it("should use query.index to filter enum field", async () => {
        const products = await populateData(api)

        const brandModule = appContainer.resolve("brand")
        const link = appContainer.resolve(ContainerRegistrationKeys.LINK)
        const brand = await brandModule.createBrands({
          name: "Medusa Brand",
        })

        const [createdLink] = await link.create({
          [Modules.PRODUCT]: {
            product_id: products.find((p) => p.title === "Extra product").id,
          },
          brand: {
            brand_id: brand.id,
          },
        })

        const query = appContainer.resolve(
          ContainerRegistrationKeys.QUERY
        ) as RemoteQueryFunction

        await promiseAll([
          waitForIndexedEntities(
            dbConnection,
            "Product",
            products.map((p) => p.id)
          ),
          waitForIndexedEntities(
            dbConnection,
            "ProductVariant",
            products.flatMap((p) => p.variants.map((v) => v.id))
          ),
          waitForIndexedEntities(
            dbConnection,
            "Price",
            products.flatMap((p) =>
              p.variants.flatMap((v) => v.prices.map((p) => p.id))
            )
          ),
          waitForIndexedEntities(dbConnection, "Brand", [brand.id]),
          waitForIndexedEntities(
            dbConnection,
            "ProductProductBrandBrand",
            [createdLink.id],
            {
              isLink: true,
            }
          ),
        ])

        const resultset = await fetchAndRetry(
          async () =>
            await query.index({
              entity: "product",
              fields: ["id"],
              filters: {
                status: "published",
                brand: {
                  status: "active",
                },
              },
            }),
          ({ data }) => data.length > 0,
          {
            retries: 5,
            waitSeconds: 1.5,
          }
        )

        expect(resultset.data.length).toEqual(1)
      })
    })
  },
})
