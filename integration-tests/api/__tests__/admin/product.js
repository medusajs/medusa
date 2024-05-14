const {
  createAdminUser,
  adminHeaders,
} = require("../../../helpers/create-admin-user")
const { breaking } = require("../../../helpers/breaking")
const { IdMap, medusaIntegrationTestRunner } = require("medusa-test-utils")
const { ModuleRegistrationName, Modules } = require("@medusajs/modules-sdk")
const {
  createVariantPriceSet,
} = require("../../../modules/helpers/create-variant-price-set")
const { PriceListStatus, PriceListType } = require("@medusajs/types")

let {
  ProductOptionValue,
  MoneyAmount,
  DiscountConditionType,
  DiscountConditionOperator,
  DiscountRuleType,
  AllocationType,
} = {}
let {
  simpleDiscountFactory,
  simpleSalesChannelFactory,
  simplePriceListFactory,
} = {}

jest.setTimeout(50000)

const getProductFixture = (overrides) => ({
  title: "Test fixture",
  description: "test-product-description",
  status: "draft",
  images: breaking(
    () => ["test-image.png", "test-image-2.png"],
    () => [{ url: "test-image.png" }, { url: "test-image-2.png" }]
  ),
  tags: [{ value: "123" }, { value: "456" }],
  options: breaking(
    () => [{ title: "size" }, { title: "color" }],
    () => [
      { title: "size", values: ["large", "small"] },
      { title: "color", values: ["green"] },
    ]
  ),
  variants: [
    {
      title: "Test variant",
      inventory_quantity: 10,
      prices: [
        {
          currency_code: "usd",
          amount: 100,
        },
        {
          currency_code: "eur",
          amount: 45,
        },
        {
          currency_code: "dkk",
          amount: 30,
        },
      ],
      options: breaking(
        () => [{ value: "large" }, { value: "green" }],
        () => ({
          size: "large",
          color: "green",
        })
      ),
    },
  ],
  ...(overrides ?? {}),
})

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_PRODUCT_CATEGORIES: true, MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseProduct
    let proposedProduct
    let publishedProduct
    let deletedProduct

    let baseCollection
    let publishedCollection

    let baseType
    let baseRegion

    let pricingService
    let container

    beforeAll(() => {
      // Note: We have to lazily load everything because there are weird ordering issues when doing `require` of `@medusajs/medusa`
      ;({
        ProductOptionValue,
        MoneyAmount,
        DiscountConditionType,
        DiscountConditionOperator,
        DiscountRuleType,
        AllocationType,
      } = require("@medusajs/medusa"))
      ;({
        simpleDiscountFactory,
        simpleSalesChannelFactory,
        simplePriceListFactory,
      } = require("../../../factories"))
    })

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "base-collection" },
          adminHeaders
        )
      ).data.collection

      publishedCollection = (
        await api.post(
          "/admin/collections",
          { title: "proposed-collection" },
          adminHeaders
        )
      ).data.collection

      baseType = await breaking(
        async () => {},
        async () => {
          return (
            await api.post(
              "/admin/product-types",
              { value: "test-type" },
              adminHeaders
            )
          ).data.product_type
        }
      )

      baseRegion = (
        await api.post(
          "/admin/regions",
          {
            name: "Test region",
            currency_code: "USD",
            ...breaking(
              () => ({
                tax_rate: 0,
                payment_providers: [],
                fulfillment_providers: [],
                countries: ["us"],
              }),
              () => ({})
            ),
          },
          adminHeaders
        )
      ).data.region

      baseProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Base product",
            collection_id: baseCollection.id,
            ...breaking(
              () => ({ type: { value: "test-type" } }),
              () => ({ type_id: baseType.id })
            ),
          }),
          adminHeaders
        )
      ).data.product

      baseType = breaking(
        () => baseProduct.type,
        () => baseType
      )

      proposedProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Proposed product",
            status: "proposed",
            tags: [{ value: "new-tag" }],
            ...breaking(
              () => ({ type: { value: "test-type" } }),
              () => ({ type_id: baseType.id })
            ),
          }),
          adminHeaders
        )
      ).data.product
      publishedProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Published product",
            status: "published",
            collection_id: publishedCollection.id,
          }),
          adminHeaders
        )
      ).data.product
      deletedProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({ title: "Deleted product" }),
          adminHeaders
        )
      ).data.product
      await api.delete(`/admin/products/${deletedProduct.id}`, adminHeaders)

      pricingService = container.resolve(ModuleRegistrationName.PRICING)
    })

    describe("/admin/products", () => {
      describe("GET /admin/products", () => {
        it("returns a list of products with all statuses when no status or invalid status is provided", async () => {
          const res = await api
            .get("/admin/products", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(res.status).toEqual(200)
          expect(res.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
                status: baseProduct.status,
              }),
              expect.objectContaining({
                id: proposedProduct.id,
                status: proposedProduct.status,
              }),
            ])
          )
        })

        it("returns a list of all products when no query is provided", async () => {
          const res = await api
            .get("/admin/products?q=", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(res.status).toEqual(200)
          expect(res.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
              }),
              expect.objectContaining({
                id: proposedProduct.id,
              }),
            ])
          )
        })

        // TODO: replace factory with API call
        it.skip("should return prices not in price list for list product endpoint", async () => {
          await simplePriceListFactory(dbConnection, {
            prices: [
              {
                variant_id: "test-variant",
                amount: 100,
                currency_code: "usd",
              },
            ],
          })

          const res = await api.get(
            "/admin/products?id=test-product",
            adminHeaders
          )

          const prices = res.data.products[0].variants
            .map((v) => v.prices)
            .flat()

          expect(res.status).toEqual(200)
          expect(res.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "test-product",
                status: "draft",
              }),
            ])
          )
          expect(prices).toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({ price_list_id: expect.any(String) }),
            ])
          )
        })

        it("returns a list of products where status is proposed", async () => {
          const payload = {
            status: "proposed",
          }

          await api
            .post(`/admin/products/${baseProduct.id}`, payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          const response = await api
            .get("/admin/products?status[]=proposed", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
                status: "proposed",
              }),
            ])
          )
        })

        it("returns a list of products where status is proposed or published", async () => {
          const notExpected = [
            expect.objectContaining({ status: "draft" }),
            expect.objectContaining({ status: "rejected" }),
            expect.objectContaining({
              id: baseProduct.id,
            }),
          ]

          const response = await api
            .get("/admin/products?status[]=published,proposed", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(2)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: proposedProduct.id,
                status: "proposed",
              }),
              expect.objectContaining({
                id: publishedProduct.id,
                status: "published",
              }),
            ])
          )

          for (const notExpect of notExpected) {
            expect(response.data.products).toEqual(
              expect.not.arrayContaining([notExpect])
            )
          }
        })

        it("returns a list of products where type_id is filtered", async () => {
          const response = await api
            .get(`/admin/products?type_id[]=${baseType.id}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(2)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type_id: baseType.id,
              }),
            ])
          )
        })

        it("returns a list of products where id is a list", async () => {
          const response = await api
            .get(
              `/admin/products?id[]=${baseProduct.id},${proposedProduct.id}`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(2)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
              }),
              expect.objectContaining({
                id: proposedProduct.id,
              }),
            ])
          )
        })

        // TODO: Decide how this should be handled in v2
        it.skip("returns a list of products filtered by discount condition id", async () => {
          const resProd = await api.get("/admin/products", adminHeaders)

          const prod1 = resProd.data.products[0]
          const prod2 = resProd.data.products[2]

          const buildDiscountData = (code, conditionId, products) => {
            return {
              code,
              rule: {
                type: DiscountRuleType.PERCENTAGE,
                value: 10,
                allocation: AllocationType.TOTAL,
                conditions: [
                  {
                    id: conditionId,
                    type: DiscountConditionType.PRODUCTS,
                    operator: DiscountConditionOperator.IN,
                    product_tags: products,
                  },
                ],
              },
            }
          }

          const discountConditionId = IdMap.getId("discount-condition-prod-1")
          await simpleDiscountFactory(
            dbConnection,
            buildDiscountData("code-1", discountConditionId, [prod1.id])
          )

          const discountConditionId2 = IdMap.getId("discount-condition-prod-2")
          await simpleDiscountFactory(
            dbConnection,
            buildDiscountData("code-2", discountConditionId2, [prod2.id])
          )

          let res = await api.get(
            `/admin/products?discount_condition_id=${discountConditionId}`,
            adminHeaders
          )

          expect(res.status).toEqual(200)
          expect(res.data.products).toHaveLength(1)
          expect(res.data.products).toEqual(
            expect.arrayContaining([expect.objectContaining({ id: prod1.id })])
          )

          res = await api.get(
            `/admin/products?discount_condition_id=${discountConditionId2}`,
            adminHeaders
          )

          expect(res.status).toEqual(200)
          expect(res.data.products).toHaveLength(1)
          expect(res.data.products).toEqual(
            expect.arrayContaining([expect.objectContaining({ id: prod2.id })])
          )

          res = await api.get(`/admin/products`, adminHeaders)

          expect(res.status).toEqual(200)
          expect(res.data.products).toHaveLength(5)
          expect(res.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: prod1.id }),
              expect.objectContaining({ id: prod2.id }),
            ])
          )
        })

        it("doesn't expand collection and types", async () => {
          const notExpected = [
            expect.objectContaining({
              collection: expect.any(Object),
              type: expect.any(Object),
            }),
          ]

          const response = await api
            .get(
              `/admin/products?status[]=published,proposed&${breaking(
                () => "expand=tags",
                () => "fields=id,status,*tags"
              )}`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(2)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: proposedProduct.id,
                status: "proposed",
              }),
              expect.objectContaining({
                id: publishedProduct.id,
                status: "published",
              }),
            ])
          )

          for (const notExpect of notExpected) {
            expect(response.data.products).toEqual(
              expect.not.arrayContaining([notExpect])
            )
          }
        })

        it("returns a list of deleted products with free text query", async () => {
          const response = await api
            .get(
              `/admin/products?deleted_at[${breaking(
                () => "gt",
                () => "$gt"
              )}]=01-26-1990&q=test`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.products).toHaveLength(1)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: deletedProduct.id,
              }),
            ])
          )
        })

        it("returns a list of products with free text query and limit", async () => {
          const response = await api
            .get("/admin/products?q=t&limit=2", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products.length).toEqual(2)
        })

        it("returns a list of products with free text query including variant prices", async () => {
          const response = await api
            .get(`/admin/products?q=${baseProduct.description}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          const expectedVariantPrices = response.data.products[0].variants
            .map((v) => v.prices)
            .flat(1)

          expect(response.status).toEqual(200)
          expect(expectedVariantPrices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: breaking(
                  () => expect.stringMatching(/^ma_*/),
                  () => expect.stringMatching(/^price_*/)
                ),
              }),
              expect.objectContaining({
                id: breaking(
                  () => expect.stringMatching(/^ma_*/),
                  () => expect.stringMatching(/^price_*/)
                ),
              }),
              expect.objectContaining({
                id: breaking(
                  () => expect.stringMatching(/^ma_*/),
                  () => expect.stringMatching(/^price_*/)
                ),
              }),
            ])
          )
        })

        it("returns a list of products with free text query and offset", async () => {
          const response = await api
            .get("/admin/products?q=t&offset=1", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products.length).toEqual(2)
        })

        it("returns a list of deleted products", async () => {
          const response = await api
            .get(
              `/admin/products?deleted_at[${breaking(
                () => "gt",
                () => "$gt"
              )}]=01-26-1990`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(1)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: deletedProduct.id,
              }),
            ])
          )
        })

        it("returns a list of products in collection", async () => {
          const notExpected = [
            expect.objectContaining({ collection_id: publishedCollection.id }),
          ]

          const response = await api
            .get(
              `/admin/products?collection_id[]=${baseCollection.id}`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(1)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
                collection_id: baseCollection.id,
              }),
            ])
          )

          for (const notExpect of notExpected) {
            expect(response.data.products).toEqual(
              expect.not.arrayContaining([notExpect])
            )
          }
        })

        it("returns a list of products with tags", async () => {
          const response = await api.get(
            `/admin/products?tags[]=${baseProduct.tags[0].id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(2)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
                tags: expect.arrayContaining([
                  expect.objectContaining({ id: baseProduct.tags[0].id }),
                ]),
              }),
              expect.objectContaining({
                id: publishedProduct.id,
                // It should be the same tag instance in both products
                tags: expect.arrayContaining([
                  expect.objectContaining({ id: baseProduct.tags[0].id }),
                ]),
              }),
            ])
          )
        })

        it("returns a list of products with tags in a collection", async () => {
          const response = await api.get(
            `/admin/products?collection_id[]=${baseCollection.id}&tags[]=${baseProduct.tags[0].id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.products).toHaveLength(1)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
                collection_id: baseCollection.id,
                tags: expect.arrayContaining([
                  expect.objectContaining({ id: baseProduct.tags[0].id }),
                ]),
              }),
            ])
          )
        })

        it("returns a list of products with only giftcard in list", async () => {
          const payload = {
            title: "Test Giftcard",
            is_giftcard: true,
            description: "test-giftcard-description",
            options: [
              breaking(
                () => ({ title: "Denominations" }),
                () => ({ title: "Denominations", values: ["100"] })
              ),
            ],
            variants: [
              {
                title: "Test variant",
                prices: [{ currency_code: "usd", amount: 100 }],
                options: breaking(
                  () => [{ value: "100" }],
                  () => ({
                    Denominations: "100",
                  })
                ),
              },
            ],
          }

          await api
            .post("/admin/products", payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          const response = await api
            .get("/admin/products?is_giftcard=true", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.data.products).toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({ is_giftcard: false }),
            ])
          )

          expect(response.status).toEqual(200)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: "Test Giftcard",
                id: expect.stringMatching(/^prod_*/),
                is_giftcard: true,
                description: "test-giftcard-description",
                // profile_id: expect.stringMatching(/^sp_*/),
                options: expect.arrayContaining([
                  expect.objectContaining({
                    title: "Denominations",
                    ...breaking(
                      () => ({}),
                      () => ({
                        values: expect.arrayContaining([
                          expect.objectContaining({ value: "100" }),
                        ]),
                      })
                    ),
                    id: expect.stringMatching(/^opt_*/),
                    product_id: expect.stringMatching(/^prod_*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                variants: expect.arrayContaining([
                  expect.objectContaining({
                    title: "Test variant",
                    id: expect.stringMatching(/^variant_*/),
                    product_id: expect.stringMatching(/^prod_*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    prices: expect.arrayContaining([
                      expect.objectContaining({
                        id: expect.any(String),
                        currency_code: "usd",
                        amount: 100,
                        variant_id: expect.stringMatching(/^variant_*/),
                        created_at: expect.any(String),
                        updated_at: expect.any(String),
                      }),
                    ]),
                    options: breaking(
                      () =>
                        expect.arrayContaining([
                          expect.objectContaining({
                            id: expect.stringMatching(/^opt_*/),
                            option_id: expect.stringMatching(/^opt_*/),
                            created_at: expect.any(String),
                            variant_id: expect.stringMatching(/^variant_*/),
                            updated_at: expect.any(String),
                          }),
                        ]),
                      () =>
                        expect.arrayContaining([
                          expect.objectContaining({
                            id: expect.stringMatching(/^optval_*/),
                            value: "100",
                          }),
                        ])
                    ),
                  }),
                ]),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ])
          )
        })

        it("returns a list of products not containing a giftcard in list", async () => {
          const payload = {
            title: "Test Giftcard",
            is_giftcard: true,
            description: "test-giftcard-description",
            variants: [
              {
                title: "Test variant",
                prices: [{ currency_code: "usd", amount: 100 }],
              },
            ],
          }

          await api
            .post("/admin/products", payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          const response = await api
            .get("/admin/products?is_giftcard=false", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.data.products).toHaveLength(3)
          expect(response.data.products).toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({ is_giftcard: true }),
            ])
          )
        })

        it("returns a list of products with child entities", async () => {
          const response = await api
            .get("/admin/products?order=created_at", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.data.products).toHaveLength(3)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.id,
                options: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^opt_*/),
                    product_id: expect.stringMatching(/^prod_*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                images: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^img_*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                variants: expect.arrayContaining([
                  expect.objectContaining({
                    id: baseProduct.variants[0].id,
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    product_id: expect.stringMatching(/^prod_*/),
                    prices: expect.arrayContaining([
                      expect.objectContaining({
                        id: baseProduct.variants[0].prices[0].id,
                        variant_id: expect.stringMatching(/^variant_*/),
                        created_at: expect.any(String),
                        updated_at: expect.any(String),
                      }),
                    ]),
                    options: breaking(
                      () =>
                        expect.arrayContaining([
                          expect.objectContaining({
                            id: expect.stringMatching(/^optval_*/),
                            variant_id: expect.stringMatching(/^variant_*/),
                            option_id: expect.stringMatching(/^opt_*/),
                            created_at: expect.any(String),
                            updated_at: expect.any(String),
                          }),
                        ]),
                      () =>
                        expect.arrayContaining([
                          expect.objectContaining({
                            id: expect.stringMatching(/^optval_*/),
                            value: "large",
                          }),
                        ])
                    ),
                  }),
                ]),
                tags: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^ptag_*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                type: expect.objectContaining({
                  id: expect.stringMatching(/^ptyp_*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
                collection: expect.objectContaining({
                  id: expect.stringMatching(/^pcol_*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
                // // profile_id: expect.stringMatching(/^sp_*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
              expect.objectContaining({
                id: proposedProduct.id,
                created_at: expect.any(String),
                variants: expect.arrayContaining([
                  expect.objectContaining({
                    id: proposedProduct.variants[0].id,
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                    product_id: expect.stringMatching(/^prod_*/),
                    options: breaking(
                      () =>
                        expect.arrayContaining([
                          expect.objectContaining({
                            id: expect.stringMatching(/^optval_*/),
                            variant_id: expect.stringMatching(/^variant_*/),
                            option_id: expect.stringMatching(/^opt_*/),
                            created_at: expect.any(String),
                            updated_at: expect.any(String),
                          }),
                        ]),
                      () =>
                        expect.arrayContaining([
                          expect.objectContaining({
                            id: expect.stringMatching(/^optval_*/),
                            value: "green",
                          }),
                        ])
                    ),
                  }),
                ]),
                tags: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.stringMatching(/^ptag*/),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                  }),
                ]),
                type: expect.objectContaining({
                  id: expect.stringMatching(/^ptyp-*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
                collection: null,
                // profile_id: expect.stringMatching(/^sp_*/),
                updated_at: expect.any(String),
              }),
              expect.objectContaining({
                id: publishedProduct.id,
                // profile_id: expect.stringMatching(/^sp_*/),
                created_at: expect.any(String),
                type: expect.any(Object),
                collection: expect.any(Object),
                options: expect.any(Array),
                tags: expect.any(Array),
                variants: expect.any(Array),
                updated_at: expect.any(String),
              }),
            ])
          )
        })

        it("should return products filtered by price_list_id", async () => {
          const priceList = await breaking(
            async () => {
              return await simplePriceListFactory(dbConnection, {
                prices: [
                  {
                    variant_id: baseProduct.variants[0].id,
                    amount: 100,
                    currency_code: "usd",
                  },
                ],
              })
            },
            async () => {
              const variantId = baseProduct.variants[0].id
              await pricingService.createRuleTypes([
                {
                  name: "Region ID",
                  rule_attribute: "region_id",
                },
              ])
              const priceSet = await createVariantPriceSet({
                container,
                variantId,
              })
              const [priceList] = await pricingService.createPriceLists([
                {
                  title: "Test price list",
                  description: "Test",
                  status: PriceListStatus.ACTIVE,
                  type: PriceListType.OVERRIDE,
                  prices: [
                    {
                      amount: 5000,
                      currency_code: "usd",
                      price_set_id: priceSet.id,
                      rules: {
                        region_id: "test-region",
                      },
                    },
                  ],
                },
              ])

              return priceList
            }
          )

          const res = await api.get(
            `/admin/products?price_list_id[]=${priceList.id}`,
            adminHeaders
          )

          expect(res.status).toEqual(200)
          expect(res.data.products.length).toEqual(1)
          expect(res.data.products).toEqual([
            expect.objectContaining({
              id: baseProduct.id,
              status: baseProduct.status,
            }),
          ])
        })

        it("should return products filtered by sales_channel_id", async () => {
          const [productId, salesChannelId] = await breaking(
            async () => {
              const salesChannel = await simpleSalesChannelFactory(
                dbConnection,
                {
                  name: "test name",
                  description: "test description",
                  products: [baseProduct],
                }
              )

              return [baseProduct.id, salesChannel.id]
            },
            async () => {
              const salesChannel = await simpleSalesChannelFactory(
                dbConnection,
                {
                  name: "test name",
                  description: "test description",
                }
              )

              // Currently the product update doesn't support managing sales channels
              const newProduct = (
                await api.post(
                  "/admin/products",
                  getProductFixture({
                    title: "Test saleschannel",
                    sales_channels: [{ id: salesChannel.id }],
                  }),
                  adminHeaders
                )
              ).data.product
              return [newProduct.id, salesChannel.id]
            }
          )

          const res = await api.get(
            `/admin/products?sales_channel_id[]=${salesChannelId}`,
            adminHeaders
          )

          expect(res.status).toEqual(200)
          expect(res.data.products.length).toEqual(1)
          expect(res.data.products).toEqual([
            expect.objectContaining({
              id: productId,
            }),
          ])
        })
      })

      describe("GET /admin/products/:id", () => {
        it("should get a product with default relations", async () => {
          const res = await api
            .get(`/admin/products/${baseProduct.id}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          const keysInResponse = Object.keys(res.data.product)

          expect(res.status).toEqual(200)
          expect(res.data.product.id).toEqual(baseProduct.id)
          expect(keysInResponse).toEqual(
            expect.arrayContaining([
              "id",
              "created_at",
              "updated_at",
              "deleted_at",
              "title",
              "subtitle",
              "description",
              "handle",
              "is_giftcard",
              "status",
              "thumbnail",
              "weight",
              "length",
              "height",
              "width",
              "hs_code",
              "origin_country",
              "mid_code",
              "material",
              "collection_id",
              "type_id",
              "discountable",
              "external_id",
              "metadata",
              // "categories",
              "collection",
              "images",
              "options",
              // "profiles",
              // "profile",
              // "profile_id",
              // "sales_channels",
              "tags",
              "type",
              "variants",
            ])
          )

          const variants = res.data.product.variants
          const hasPrices = variants.some((variant) => !!variant.prices)

          expect(hasPrices).toBe(true)
        })

        it("should get a product with prices", async () => {
          const res = await api
            .get(
              `/admin/products/${baseProduct.id}?${breaking(
                () => "expand=variants,variants.prices",
                () => "fields=*variants,*variants.prices"
              )}`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          const { id, variants } = res.data.product

          expect(id).toEqual(baseProduct.id)
          expect(variants[0].prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                currency_code: "usd",
              }),
            ])
          )
        })

        it("should get a product only with variants expanded", async () => {
          const res = await api
            .get(
              `/admin/products/${baseProduct.id}?${breaking(
                () => "expand=variants",
                () => "fields=title,*variants"
              )}`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          const { id, variants } = res.data.product

          expect(id).toEqual(baseProduct.id)
          expect(variants[0]).toEqual(
            expect.objectContaining({
              title: "Test variant",
            })
          )
          // prices is one of many properties that should not be expanded
          expect(variants[0].prices).toBeUndefined()
        })
      })

      describe("POST /admin/products", () => {
        it("creates a product", async () => {
          const response = await api
            .post(
              "/admin/products",
              getProductFixture({
                title: "Test create",
                collection_id: baseCollection.id,
                ...breaking(
                  () => ({ type: { value: baseType.value } }),
                  () => ({ type_id: baseType.id })
                ),
              }),

              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          const priceIdSelector = breaking(
            () => /^ma_*/,
            () => /^price_*/
          )

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              id: expect.stringMatching(/^prod_*/),
              title: "Test create",
              discountable: true,
              is_giftcard: false,
              handle: "test-create",
              status: "draft",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              // profile_id: expect.stringMatching(/^sp_*/),
              images: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  url: "test-image.png",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  url: "test-image-2.png",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
              ]),
              thumbnail: "test-image.png",
              tags: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: "123",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  value: "456",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
              ]),
              type: expect.objectContaining({
                value: baseType.value,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
              collection: expect.objectContaining({
                id: baseCollection.id,
                title: baseCollection.title,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.stringMatching(/^opt_*/),
                  product_id: expect.stringMatching(/^prod_*/),
                  title: "size",
                  ...breaking(
                    () => ({}),
                    () => ({
                      values: expect.arrayContaining([
                        expect.objectContaining({ value: "large" }),
                      ]),
                    })
                  ),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
                expect.objectContaining({
                  id: expect.stringMatching(/^opt_*/),
                  product_id: expect.stringMatching(/^prod_*/),
                  title: "color",
                  ...breaking(
                    () => ({}),
                    () => ({
                      values: expect.arrayContaining([
                        expect.objectContaining({ value: "green" }),
                      ]),
                    })
                  ),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
              ]),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.stringMatching(/^variant_*/),
                  product_id: expect.stringMatching(/^prod_*/),
                  updated_at: expect.any(String),
                  created_at: expect.any(String),
                  title: "Test variant",
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.stringMatching(priceIdSelector),
                      currency_code: "usd",
                      amount: 100,
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                      variant_id: expect.stringMatching(/^variant_*/),
                    }),
                    expect.objectContaining({
                      id: expect.stringMatching(priceIdSelector),
                      currency_code: "eur",
                      amount: 45,
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                      variant_id: expect.stringMatching(/^variant_*/),
                    }),
                    expect.objectContaining({
                      id: expect.stringMatching(priceIdSelector),
                      currency_code: "dkk",
                      amount: 30,
                      created_at: expect.any(String),
                      updated_at: expect.any(String),
                      variant_id: expect.stringMatching(/^variant_*/),
                    }),
                  ]),
                  options: breaking(
                    () =>
                      expect.arrayContaining([
                        expect.objectContaining({
                          value: "large",
                          created_at: expect.any(String),
                          updated_at: expect.any(String),
                          variant_id: expect.stringMatching(/^variant_*/),
                          option_id: expect.stringMatching(/^opt_*/),
                          id: expect.stringMatching(/^optval_*/),
                        }),
                        expect.objectContaining({
                          value: "green",
                          created_at: expect.any(String),
                          updated_at: expect.any(String),
                          variant_id: expect.stringMatching(/^variant_*/),
                          option_id: expect.stringMatching(/^opt_*/),
                          id: expect.stringMatching(/^optval_*/),
                        }),
                      ]),
                    () =>
                      expect.arrayContaining([
                        expect.objectContaining({
                          id: expect.stringMatching(/^optval_*/),
                          value: "large",
                          option: expect.objectContaining({
                            title: "size",
                          }),
                        }),
                        expect.objectContaining({
                          id: expect.stringMatching(/^optval_*/),
                          value: "green",
                          option: expect.objectContaining({
                            title: "color",
                          }),
                        }),
                      ])
                  ),
                }),
              ]),
            })
          )
        })

        it("creates a product that is not discountable", async () => {
          const payload = {
            title: "Test",
            discountable: false,
            description: "test-product-description",
            images: breaking(
              () => ["test-image.png", "test-image-2.png"],
              () => [{ url: "test-image.png" }, { url: "test-image-2.png" }]
            ),
            collection_id: baseCollection.id,
            tags: [{ value: "123" }, { value: "456" }],
            variants: [
              {
                title: "Test variant",
                inventory_quantity: 10,
                prices: [{ currency_code: "usd", amount: 100 }],
              },
            ],
          }

          const response = await api
            .post("/admin/products", payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              discountable: false,
            })
          )
        })

        it("Sets variant ranks when creating a product", async () => {
          const payload = {
            title: "Test product - 1",
            description: "test-product-description 1",
            images: breaking(
              () => ["test-image.png", "test-image-2.png"],
              () => [{ url: "test-image.png" }, { url: "test-image-2.png" }]
            ),
            collection_id: baseCollection.id,
            tags: [{ value: "123" }, { value: "456" }],
            variants: [
              {
                title: "Test variant 1",
                inventory_quantity: 10,
                prices: [{ currency_code: "usd", amount: 100 }],
              },
              {
                title: "Test variant 2",
                inventory_quantity: 10,
                prices: [{ currency_code: "usd", amount: 100 }],
              },
            ],
          }

          const creationResponse = await api
            .post("/admin/products", payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(creationResponse.status).toEqual(200)

          const productId = creationResponse.data.product.id

          const response = await api
            .get(`/admin/products/${productId}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.data.product).toEqual(
            expect.objectContaining({
              title: "Test product - 1",
              variants: [
                expect.objectContaining({
                  title: "Test variant 1",
                }),
                expect.objectContaining({
                  title: "Test variant 2",
                }),
              ],
            })
          )
        })

        it("creates a giftcard", async () => {
          const payload = {
            title: "Test Giftcard",
            is_giftcard: true,
            description: "test-giftcard-description",
            variants: [
              {
                title: "Test variant",
                prices: [{ currency_code: "usd", amount: 100 }],
              },
            ],
          }

          const response = await api
            .post("/admin/products", payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          expect(response.data.product).toEqual(
            expect.objectContaining({
              title: "Test Giftcard",
              discountable: false,
            })
          )
        })

        it("updates a product (update prices, tags, update status, delete collection, delete type, replaces images)", async () => {
          const payload = {
            collection_id: null,
            title: "Test an update",
            variants: [
              {
                id: baseProduct.variants[0].id,
                title: "New variant",
                barcode: "test-barcode",
                ean: "test-ean",
                upc: "test-upc",
                // Price updates should happen through the variant's dedicated endpoint
                ...breaking(
                  () => ({
                    prices: [
                      {
                        currency_code: "usd",
                        amount: 75,
                      },
                    ],
                  }),
                  () => ({})
                ),
              },
            ],
            tags: [{ value: "123" }],
            images: breaking(
              () => ["test-image-2.png"],
              () => [{ url: "test-image-2.png" }]
            ),
            status: "published",
          }

          const response = await api
            .post(`/admin/products/${baseProduct.id}`, payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          expect(response.data.product).toEqual(
            expect.objectContaining({
              id: baseProduct.id,
              title: "Test an update",
              created_at: expect.any(String),
              description: "test-product-description",
              discountable: true,
              // TODO: Do an update on the name, see if the handle is constant
              handle: "base-product",
              images: expect.arrayContaining([
                expect.objectContaining({
                  created_at: expect.any(String),
                  id: expect.stringMatching(/^img_*/),
                  updated_at: expect.any(String),
                  url: "test-image-2.png",
                }),
              ]),
              is_giftcard: false,
              options: expect.arrayContaining([
                expect.objectContaining({
                  created_at: expect.any(String),
                  id: expect.stringMatching(/^opt_*/),
                  product_id: baseProduct.id,
                  title: "size",
                  ...breaking(
                    () => ({}),
                    () => ({
                      values: expect.arrayContaining([
                        expect.objectContaining({ value: "large" }),
                      ]),
                    })
                  ),
                  updated_at: expect.any(String),
                }),
              ]),
              // // profile_id: expect.stringMatching(/^sp_*/),
              status: "published",
              tags: expect.arrayContaining([
                expect.objectContaining({
                  created_at: expect.any(String),
                  // TODO: Check how v1 tags update worked. Is it a full replacement, or something else? Why do we expect tag1 here?
                  // id: "tag1",
                  updated_at: expect.any(String),
                  value: "123",
                }),
              ]),
              // TODO: Decide how to handle the thumbnail on update
              // thumbnail: "test-image-2.png",
              type: expect.objectContaining({
                id: baseType.id,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                value: baseType.value,
              }),
              type_id: baseType.id,
              updated_at: expect.any(String),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  allow_backorder: false,
                  barcode: "test-barcode",
                  ean: "test-ean",
                  upc: "test-upc",
                  created_at: expect.any(String),
                  id: baseProduct.variants[0].id,
                  inventory_quantity: 10,
                  manage_inventory: true,
                  options: breaking(
                    () =>
                      expect.arrayContaining([
                        expect.objectContaining({
                          created_at: expect.any(String),
                          deleted_at: null,
                          id: expect.stringMatching(/^optval_*/),
                          metadata: null,
                          option_id: expect.stringMatching(/^opt_*/),
                          updated_at: expect.any(String),
                          value: "large",
                          variant_id: baseProduct.variants[0].id,
                        }),
                      ]),
                    () =>
                      expect.arrayContaining([
                        expect.objectContaining({
                          id: expect.stringMatching(/^optval_*/),
                          value: "large",
                          option: expect.objectContaining({
                            title: "size",
                          }),
                        }),
                      ])
                  ),
                  origin_country: null,
                  prices: breaking(
                    () =>
                      expect.arrayContaining([
                        expect.objectContaining({
                          amount: 75,
                          created_at: expect.any(String),
                          currency_code: "usd",
                          updated_at: expect.any(String),
                          variant_id: baseProduct.variants[0].id,
                        }),
                      ]),
                    // Price updates can't happen through the product endpoint in v2
                    () =>
                      expect.arrayContaining([
                        expect.objectContaining({
                          amount: 100,
                          created_at: expect.any(String),
                          currency_code: "usd",
                        }),
                      ])
                  ),
                  product_id: baseProduct.id,
                  title: "New variant",
                  updated_at: expect.any(String),
                }),
              ]),
            })
          )
        })

        it("updates product (removes images when empty array included)", async () => {
          const payload = {
            images: [],
          }

          const response = await api
            .post(`/admin/products/${baseProduct.id}`, payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product.images.length).toEqual(0)
        })

        it("updates a product by deleting a field from metadata", async () => {
          const created = (
            await api.post(
              "/admin/products",
              getProductFixture({
                title: "Test metadata",
                metadata: {
                  "test-key": "test-value",
                  "test-key-2": "test-value-2",
                  "test-key-3": "test-value-3",
                },
              }),
              adminHeaders
            )
          ).data.product

          const payload = {
            metadata: {
              "test-key": "",
              "test-key-2": null,
            },
          }

          const response = await api.post(
            "/admin/products/" + created.id,
            payload,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.product.metadata).toEqual(
            breaking(
              () => ({
                "test-key-2": null,
                "test-key-3": "test-value-3",
              }),
              () => ({
                "test-key": "",
                "test-key-2": null,
              })
            )
          )
        })

        it("fails to update product with invalid status", async () => {
          const payload = {
            status: null,
          }

          try {
            await api.post(
              `/admin/products/${baseProduct}`,
              payload,
              adminHeaders
            )
          } catch (e) {
            expect(e.response.status).toEqual(400)
            expect(e.response.data.type).toEqual("invalid_data")
          }
        })

        it("updates a product (variant ordering)", async () => {
          const plainProduct = (
            await api.post(
              "/admin/products",
              { title: "Test variant order" },
              adminHeaders
            )
          ).data.product

          const payload = {
            variants: [
              {
                title: "first",
                inventory_quantity: 10,
              },
              {
                title: "second",
                inventory_quantity: 10,
              },
              {
                title: "third",
                inventory_quantity: 10,
              },
            ],
          }

          const response = await api
            .post(`/admin/products/${plainProduct.id}`, payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          expect(response.data.product).toEqual(
            expect.objectContaining({
              title: plainProduct.title,
              variants: [
                expect.objectContaining({
                  title: "first",
                }),
                expect.objectContaining({
                  title: "second",
                }),
                expect.objectContaining({
                  title: "third",
                }),
              ],
            })
          )
        })

        it("add option", async () => {
          const payload = {
            title: "should_add",
            ...breaking(
              () => ({}),
              () => ({ values: ["100"] })
            ),
          }

          const response = await api
            .post(
              `/admin/products/${baseProduct.id}/options`,
              payload,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          expect(response.data.product).toEqual(
            expect.objectContaining({
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "should_add",
                  product_id: baseProduct.id,
                  ...breaking(
                    () => ({}),
                    () => ({
                      values: expect.arrayContaining([
                        expect.objectContaining({ value: "100" }),
                      ]),
                    })
                  ),
                }),
              ]),
            })
          )
        })
      })

      describe("DELETE /admin/products/:id/options/:option_id", () => {
        it("deletes a product option", async () => {
          const response = await api
            .delete(
              `/admin/products/${baseProduct.id}/options/${baseProduct.options[0].id}`,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          breaking(
            () => {
              expect(response.data.product).toEqual(
                expect.objectContaining({
                  options: [
                    expect.objectContaining({
                      title: baseProduct.options[1].title,
                    }),
                  ],
                  id: baseProduct.id,
                })
              )
            },
            () => {
              expect(response.data).toEqual(
                expect.objectContaining({
                  id: baseProduct.options[0].id,
                  object: "product_option",
                  parent: expect.objectContaining({
                    id: baseProduct.id,
                  }),
                })
              )
            }
          )
        })

        it("deletes a values associated with deleted option", async () => {
          await api.delete(
            `/admin/products/${baseProduct.id}/options/${baseProduct.options[0].id}`,
            adminHeaders
          )

          const values = await breaking(
            async () =>
              await dbConnection.manager.find(ProductOptionValue, {
                where: { option_id: baseProduct.options[0].id },
                withDeleted: true,
              }),
            async () => {
              const productModule = getContainer().resolve(
                ModuleRegistrationName.PRODUCT
              )

              return await productModule.listOptions(
                { id: baseProduct.options[0].id },
                { withDeleted: true }
              )
            }
          )

          expect(values).toEqual([
            expect.objectContaining({ deleted_at: expect.any(Date) }),
          ])
        })
      })

      describe("GET /admin/products/:id/variants", () => {
        it("should return the variants related to the requested product", async () => {
          const res = await api
            .get(`/admin/products/${baseProduct.id}/variants`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(res.status).toEqual(200)
          expect(res.data.variants.length).toBe(1)
          expect(res.data.variants).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: baseProduct.variants[0].id,
                product_id: baseProduct.id,
              }),
            ])
          )
        })

        it("should allow searching of variants", async () => {
          await breaking(
            () => {},
            async () => {
              const newProduct = (
                await api.post(
                  "/admin/products",
                  getProductFixture({
                    variants: [
                      { title: "First variant", prices: [] },
                      { title: "Second variant", prices: [] },
                    ],
                  }),
                  adminHeaders
                )
              ).data.product

              const res = await api
                .get(
                  `/admin/products/${newProduct.id}/variants?q=first`,
                  adminHeaders
                )
                .catch((err) => {
                  console.log(err)
                })

              expect(res.status).toEqual(200)
              expect(res.data.variants).toHaveLength(1)
              expect(res.data.variants).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    title: "First variant",
                    product_id: newProduct.id,
                  }),
                ])
              )
            }
          )
        })
      })

      describe("updates a variant's default prices (ignores prices associated with a Price List)", () => {
        it("successfully updates a variant's default prices by changing an existing price (currency_code)", async () => {
          const data = {
            prices: [
              {
                currency_code: "usd",
                amount: 1500,
              },
            ],
          }

          const response = await api.post(
            `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}`,
            data,
            adminHeaders
          )

          expect(
            baseProduct.variants[0].prices.find(
              (p) => p.currency_code === "usd"
            ).amount
          ).toEqual(100)
          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            product: expect.objectContaining({
              id: baseProduct.id,
              variants: expect.arrayContaining([
                expect.objectContaining({
                  id: baseProduct.variants[0].id,
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 1500,
                      currency_code: "usd",
                    }),
                  ]),
                }),
              ]),
            }),
          })
        })

        // TODO: Do we want to add support for region prices through the product APIs?
        it.skip("successfully updates a variant's price by changing an existing price (given a region_id)", async () => {
          const data = {
            prices: [
              {
                region_id: "test-region",
                amount: 1500,
              },
            ],
          }

          const response = await api
            .post(
              "/admin/products/test-product1/variants/test-variant_3",
              data,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          expect(response.data.product).toEqual(
            expect.objectContaining({
              variants: expect.arrayContaining([
                expect.objectContaining({
                  id: "test-variant_3",
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 1500,
                      currency_code: "usd",
                      region_id: "test-region",
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("successfully updates a variant's prices by adding a new price", async () => {
          const usdPrice = baseProduct.variants[0].prices.find(
            (p) => p.currency_code === "usd"
          )
          const data = {
            title: "Test variant prices",
            prices: [
              {
                id: usdPrice.id,
                currency_code: "usd",
                amount: 100,
              },
              {
                currency_code: "eur",
                amount: 4500,
              },
            ],
          }

          const response = await api.post(
            `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}`,
            data,
            adminHeaders
          )

          expect(response.status).toEqual(200)

          expect(response.data).toEqual(
            expect.objectContaining({
              product: expect.objectContaining({
                id: baseProduct.id,
                variants: expect.arrayContaining([
                  expect.objectContaining({
                    id: baseProduct.variants[0].id,
                    prices: expect.arrayContaining([
                      expect.objectContaining({
                        amount: 100,
                        currency_code: "usd",
                        id: usdPrice.id,
                      }),
                      expect.objectContaining({
                        amount: 4500,
                        currency_code: "eur",
                      }),
                    ]),
                  }),
                ]),
              }),
            })
          )
        })

        it("successfully updates a variant's prices by deleting a price and adding another price", async () => {
          const data = {
            prices: [
              {
                currency_code: "dkk",
                amount: 8000,
              },
              {
                currency_code: "eur",
                amount: 900,
              },
            ],
          }

          const response = await api
            .post(
              `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}`,
              data,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          const variant = response.data.product.variants[0]
          expect(variant.prices.length).toEqual(2)

          expect(variant.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 8000,
                currency_code: "dkk",
              }),
              expect.objectContaining({
                amount: 900,
                currency_code: "eur",
              }),
            ])
          )
        })

        // TODO: Similarly we need to decide how to handle regions
        it.skip("successfully updates a variant's prices by updating an existing price (using region_id) and adding another price", async () => {
          const data = {
            prices: [
              {
                region_id: "test-region",
                amount: 8000,
              },
              {
                currency_code: "eur",
                amount: 900,
              },
            ],
          }

          const variantId = "test-variant_3"
          const response = await api
            .post(
              `/admin/products/test-product1/variants/${variantId}`,
              data,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          const variant = response.data.product.variants.find(
            (v) => v.id === variantId
          )
          expect(variant.prices.length).toEqual(data.prices.length)

          expect(variant.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 8000,
                currency_code: "usd",
                region_id: "test-region",
              }),
              expect.objectContaining({
                amount: 900,
                currency_code: "eur",
              }),
            ])
          )
        })

        // TODO: Similarly we need to decide how to handle regions
        it.skip("successfully deletes a region price", async () => {
          const createRegionPricePayload = {
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
              {
                region_id: "test-region",
                amount: 8000,
              },
              {
                currency_code: "eur",
                amount: 900,
              },
            ],
          }

          const variantId = "test-variant_3"

          const createRegionPriceResponse = await api.post(
            "/admin/products/test-product1/variants/test-variant_3",
            createRegionPricePayload,
            adminHeaders
          )

          const initialPriceArray =
            createRegionPriceResponse.data.product.variants.find(
              (v) => v.id === variantId
            ).prices

          expect(createRegionPriceResponse.status).toEqual(200)
          expect(initialPriceArray).toHaveLength(3)
          expect(initialPriceArray).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 1000,
                currency_code: "usd",
              }),
              expect.objectContaining({
                amount: 8000,
                currency_code: "usd",
                region_id: "test-region",
              }),
              expect.objectContaining({
                amount: 900,
                currency_code: "eur",
              }),
            ])
          )

          const deleteRegionPricePayload = {
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
              {
                currency_code: "eur",
                amount: 900,
              },
            ],
          }

          const deleteRegionPriceResponse = await api.post(
            "/admin/products/test-product1/variants/test-variant_3",
            deleteRegionPricePayload,
            adminHeaders
          )

          const finalPriceArray =
            deleteRegionPriceResponse.data.product.variants.find(
              (v) => v.id === variantId
            ).prices

          expect(deleteRegionPriceResponse.status).toEqual(200)
          expect(finalPriceArray).toHaveLength(2)
          expect(finalPriceArray).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 1000,
                currency_code: "usd",
              }),
              expect.objectContaining({
                amount: 900,
                currency_code: "eur",
              }),
            ])
          )
        })

        // TODO: Similarly we need to decide how to handle regions
        it.skip("successfully updates a variants prices by deleting both a currency and region price", async () => {
          // await Promise.all(
          //   ["reg_1", "reg_2", "reg_3"].map(async (regionId) => {
          //     return await simpleRegionFactory(dbConnection, {
          //       id: regionId,
          //       currency_code: regionId === "reg_1" ? "eur" : "usd",
          //     })
          //   })
          // )

          const createPrices = {
            prices: [
              {
                region_id: "reg_1",
                amount: 1,
              },
              {
                region_id: "reg_2",
                amount: 2,
              },
              {
                currency_code: "usd",
                amount: 3,
              },
              {
                region_id: "reg_3",
                amount: 4,
              },
              {
                currency_code: "eur",
                amount: 5,
              },
            ],
          }

          const variantId = "test-variant_3"

          await api
            .post(
              `/admin/products/test-product1/variants/${variantId}`,
              createPrices,
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          const updatePrices = {
            prices: [
              {
                region_id: "reg_1",
                amount: 100,
              },
              {
                region_id: "reg_2",
                amount: 200,
              },
              {
                currency_code: "usd",
                amount: 300,
              },
            ],
          }

          const response = await api.post(
            `/admin/products/test-product1/variants/${variantId}`,
            updatePrices,
            adminHeaders
          )

          const finalPriceArray = response.data.product.variants.find(
            (v) => v.id === variantId
          ).prices

          expect(response.status).toEqual(200)
          expect(finalPriceArray).toHaveLength(3)
          expect(finalPriceArray).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                amount: 100,
                region_id: "reg_1",
              }),
              expect.objectContaining({
                amount: 200,
                region_id: "reg_2",
              }),
              expect.objectContaining({
                amount: 300,
                currency_code: "usd",
              }),
            ])
          )
        })
      })

      describe("variant creation", () => {
        it("create a product variant with prices (regional and currency)", async () => {
          const payload = {
            title: "Created variant",
            sku: "new-sku",
            ean: "new-ean",
            upc: "new-upc",
            barcode: "new-barcode",
            inventory_quantity: 10,
            prices: [
              {
                currency_code: "usd",
                amount: 100,
              },
              {
                ...breaking(
                  () => ({ region_id: baseRegion.id }),
                  () => ({ currency_code: "eur" })
                ),
                amount: 200,
              },
            ],
            ...breaking(
              () => ({
                options: [
                  {
                    option_id: baseProduct.options[0].id,
                    value: "newval",
                  },
                  {
                    option_id: baseProduct.options[1].id,
                    value: "newval",
                  },
                ],
              }),
              // TODO: Require that options are passed if they belong on the product, and the combos are unique per variant
              () => ({})
            ),
          }

          const res = await api
            .post(
              `/admin/products/${baseProduct.id}/variants`,
              payload,
              adminHeaders
            )
            .catch((err) => console.log(err))

          const insertedVariant = res.data.product.variants.find(
            (v) => v.sku === "new-sku"
          )

          expect(res.status).toEqual(200)

          expect(insertedVariant.prices).toHaveLength(2)
          expect(insertedVariant.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                currency_code: "usd",
                amount: 100,
                variant_id: insertedVariant.id,
                ...breaking(
                  () => ({
                    region_id: null,
                    min_quantity: null,
                    max_quantity: null,
                  }),
                  () => ({})
                ),
              }),
              expect.objectContaining({
                currency_code: breaking(
                  () => "usd",
                  () => "eur"
                ),
                amount: 200,
                variant_id: insertedVariant.id,
                ...breaking(
                  () => ({
                    region_id: baseRegion.id,
                    min_quantity: null,
                    max_quantity: null,
                    price_list_id: null,
                  }),
                  () => ({})
                ),
              }),
            ])
          )
        })
      })

      describe("testing for soft-deletion + uniqueness on handles, collection and variant properties", () => {
        it("successfully deletes a product", async () => {
          const response = await api
            .delete(`/admin/products/${baseProduct.id}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          expect(response.data).toEqual(
            expect.objectContaining({
              id: baseProduct.id,
              deleted: true,
            })
          )
        })

        it("successfully deletes a product and variants", async () => {
          const variantPre = await breaking(
            async () => {
              return (
                await api.get(
                  `/admin/products/${baseProduct.id}/variants`,
                  adminHeaders
                )
              ).data.variants[0]
            },
            async () => {
              return (
                await api.get(
                  `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}`,
                  adminHeaders
                )
              ).data.variant
            }
          )

          expect(variantPre).toBeTruthy()

          const response = await api
            .delete(`/admin/products/${baseProduct.id}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)

          expect(response.data).toEqual(
            expect.objectContaining({
              id: baseProduct.id,
              deleted: true,
            })
          )
          const variantPost = await breaking(
            async () => {
              return (
                await api.get(
                  `/admin/products/${baseProduct.id}/variants`,
                  adminHeaders
                )
              ).data.variants[0]
            },
            async () => {
              return (
                await api.get(
                  `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}`,
                  adminHeaders
                )
              ).data.variant
            }
          )

          expect(variantPost).not.toBeTruthy()
        })

        it.skip("successfully deletes a product variant and its associated prices", async () => {
          // Validate that the price exists
          const pricePre = await dbConnection.manager.findOne(MoneyAmount, {
            where: { id: "test-price" },
          })

          expect(pricePre).toBeTruthy()

          // Soft delete the variant
          const response = await api.delete(
            "/admin/products/test-product/variants/test-variant",
            adminHeaders
          )

          expect(response.status).toEqual(200)

          // Validate that the price was deleted
          const pricePost = await dbConnection.manager.findOne(MoneyAmount, {
            where: { id: "test-price" },
          })

          expect(pricePost).not.toBeTruthy()

          // Validate that the price still exists in the DB with deleted_at
          const optValDeleted = await dbConnection.manager.findOne(
            MoneyAmount,
            {
              where: {
                id: "test-price",
              },
              withDeleted: true,
            }
          )

          expect(optValDeleted).toEqual(
            expect.objectContaining({
              deleted_at: expect.any(Date),
              id: "test-price",
            })
          )
        })

        it.skip("successfully deletes a product and any prices associated with one of its variants", async () => {
          // Validate that the price exists
          const pricePre = await dbConnection.manager.findOne(MoneyAmount, {
            where: { id: "test-price" },
          })

          expect(pricePre).toBeTruthy()

          // Soft delete the product
          const response = await api.delete(
            "/admin/products/test-product",
            adminHeaders
          )

          expect(response.status).toEqual(200)

          // Validate that the price has been deleted
          const pricePost = await dbConnection.manager.findOne(MoneyAmount, {
            where: { id: "test-price" },
          })

          expect(pricePost).not.toBeTruthy()

          // Validate that the price still exists in the DB with deleted_at
          const optValDeleted = await dbConnection.manager.findOne(
            MoneyAmount,
            {
              where: {
                id: "test-price",
              },
              withDeleted: true,
            }
          )

          expect(optValDeleted).toEqual(
            expect.objectContaining({
              deleted_at: expect.any(Date),
              id: "test-price",
            })
          )
        })

        it("successfully creates product with soft-deleted product handle and deletes it again", async () => {
          // First we soft-delete the product
          const response = await api
            .delete(`/admin/products/${baseProduct.id}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.id).toEqual(baseProduct.id)

          // Lets try to create a product with same handle as deleted one
          const payload = {
            title: baseProduct.title,
            handle: baseProduct.handle,
            variants: [
              {
                title: "Test variant",
                inventory_quantity: 10,
                prices: [{ currency_code: "usd", amount: 100 }],
              },
            ],
          }

          const res = await api.post("/admin/products", payload, adminHeaders)

          expect(res.status).toEqual(200)
          expect(res.data.product.handle).toEqual(baseProduct.handle)

          // Delete product again to ensure uniqueness is enforced in all cases
          const response2 = await api
            .delete(`/admin/products/${res.data.product.id}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response2.status).toEqual(200)
          expect(response2.data.id).toEqual(res.data.product.id)
        })

        it("should fail when creating a product with a handle that already exists", async () => {
          // Lets try to create a product with same handle as deleted one
          const payload = {
            title: baseProduct.title,
            handle: baseProduct.handle,
            description: "test-product-description",
            variants: [
              {
                title: "Test variant",
                inventory_quantity: 10,
                prices: [{ currency_code: "usd", amount: 100 }],
              },
            ],
          }

          try {
            await api.post("/admin/products", payload, adminHeaders)
          } catch (error) {
            expect(error.response.data.message).toMatch(
              breaking(
                () => "Product with handle base-product already exists.",
                () => "Product with handle: base-product already exists."
              )
            )
          }
        })

        it("successfully deletes product collection", async () => {
          // First we soft-delete the product collection
          const response = await api
            .delete(`/admin/collections/${baseCollection.id}`, adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.id).toEqual(baseCollection.id)
        })

        it("successfully creates soft-deleted product collection", async () => {
          const response = await api.delete(
            `/admin/collections/${baseCollection.id}`,
            adminHeaders
          )
          expect(response.status).toEqual(200)
          expect(response.data.id).toEqual(baseCollection.id)

          // Lets try to create a product collection with same handle as deleted one
          const payload = {
            title: "Another test collection",
            handle: baseCollection.handle,
          }

          const res = await api.post(
            "/admin/collections",
            payload,
            adminHeaders
          )

          expect(res.status).toEqual(200)
          expect(res.data.collection.handle).toEqual(baseCollection.handle)
        })

        it("should fail when creating a collection with a handle that already exists", async () => {
          // Lets try to create a collection with same handle as deleted one
          const payload = {
            title: "Another test collection",
            handle: baseCollection.handle,
          }

          try {
            await api.post("/admin/collections", payload, adminHeaders)
          } catch (error) {
            expect(error.response.data.message).toMatch(
              breaking(
                () =>
                  `Product_collection with handle ${baseCollection.handle} already exists.`,
                () =>
                  `Product collection with handle: ${baseCollection.handle} already exists.`
              )
            )
          }
        })

        it("successfully creates soft-deleted product variant", async () => {
          const variant = baseProduct.variants[0]
          const response = await api.delete(
            `/admin/products/${baseProduct.id}/variants/${variant.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(
            breaking(
              () => response.data.variant_id,
              () => response.data.id
            )
          ).toEqual(baseProduct.variants[0].id)

          const payload = {
            title: "Second variant",
            sku: "new-sku",
            ean: "new-ean",
            upc: "new-upc",
            barcode: "new-barcode",
            ...breaking(
              () => ({
                options: [
                  {
                    option_id: baseProduct.options[0].id,
                    value: "newval",
                  },
                  {
                    option_id: baseProduct.options[1].id,
                    value: "newval",
                  },
                ],
              }),
              // TODO: Require that options are passed if they belong on the product, and the combos are unique per variant
              () => ({})
            ),
            prices: [
              {
                currency_code: "usd",
                amount: 100,
              },
            ],
          }

          const res = await api.post(
            `/admin/products/${baseProduct.id}/variants`,
            payload,
            adminHeaders
          )

          expect(res.status).toEqual(200)
          expect(res.data.product.variants).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: "Second variant",
                sku: "new-sku",
                ean: "new-ean",
                upc: "new-upc",
                barcode: "new-barcode",
              }),
            ])
          )
        })
      })

      describe("POST /admin/products/:id/variants/:id", () => {
        it("successfully updates variant without prices", async () => {
          const res = await api
            .post(
              `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}`,
              {
                title: "Updated variant",
              },
              adminHeaders
            )
            .catch((err) => {
              console.log(err)
            })

          expect(res.status).toEqual(200)
          expect(
            res.data.product.variants.find(
              (v) => v.id === baseProduct.variants[0].id
            )?.title
          ).toEqual("Updated variant")
        })
      })

      describe("batch methods", () => {
        it("successfully creates, updates, and deletes products", async () => {
          await breaking(
            () => {},
            async () => {
              const createPayload = getProductFixture({
                title: "Test batch create",
                handle: "test-batch-create",
              })

              const updatePayload = {
                id: publishedProduct.id,
                title: "Test batch update",
              }

              const response = await api.post(
                "/admin/products/batch",
                {
                  create: [createPayload],
                  update: [updatePayload],
                  delete: [baseProduct.id],
                },
                adminHeaders
              )

              expect(response.status).toEqual(200)
              expect(response.data.created).toHaveLength(1)
              expect(response.data.updated).toHaveLength(1)
              expect(response.data.deleted.ids).toHaveLength(1)

              expect(response.data.created).toEqual([
                expect.objectContaining({
                  title: "Test batch create",
                }),
              ])

              expect(response.data.updated).toEqual([
                expect.objectContaining({
                  title: "Test batch update",
                }),
              ])

              expect(response.data.deleted).toEqual(
                expect.objectContaining({ ids: [baseProduct.id] })
              )

              const dbData = (await api.get("/admin/products", adminHeaders))
                .data.products

              expect(dbData).toHaveLength(3)
              expect(dbData).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    title: "Test batch create",
                  }),
                  expect.objectContaining({
                    title: "Test batch update",
                  }),
                ])
              )
            }
          )
        })

        it("successfully creates, updates, and deletes product variants", async () => {
          await breaking(
            () => {},
            async () => {
              const productWithMultipleVariants = getProductFixture({
                title: "Test batch variants",
                handle: "test-batch-variants",
                variants: [
                  {
                    title: "Variant 1",
                    inventory_quantity: 5,
                    prices: [
                      {
                        currency_code: "usd",
                        amount: 100,
                      },
                    ],
                  },
                  {
                    title: "Variant 2",
                    inventory_quantity: 20,
                    prices: [
                      {
                        currency_code: "usd",
                        amount: 200,
                      },
                    ],
                  },
                ],
              })

              const createdProduct = (
                await api.post(
                  "/admin/products",
                  productWithMultipleVariants,
                  adminHeaders
                )
              ).data.product

              const createPayload = {
                title: "Test batch create variant",
                inventory_quantity: 10,
                prices: [
                  {
                    currency_code: "usd",
                    amount: 20,
                  },
                  {
                    currency_code: "dkk",
                    amount: 10,
                  },
                ],
              }

              const updatePayload = {
                id: createdProduct.variants[0].id,
                title: "Test batch update variant",
              }

              const response = await api.post(
                `/admin/products/${createdProduct.id}/variants/batch`,
                {
                  create: [createPayload],
                  update: [updatePayload],
                  delete: [createdProduct.variants[1].id],
                },
                adminHeaders
              )

              const dbData = (
                await api.get(
                  `/admin/products/${createdProduct.id}`,
                  adminHeaders
                )
              ).data.product.variants

              expect(response.status).toEqual(200)
              expect(dbData).toHaveLength(2)
              expect(dbData).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    title: "Test batch create variant",
                  }),
                  expect.objectContaining({
                    title: "Test batch update variant",
                  }),
                ])
              )
            }
          )
        })

        it("successfully adds and removes products to a collection", async () => {
          await breaking(
            () => {},
            async () => {
              const response = await api.post(
                `/admin/collections/${baseCollection.id}/products`,
                {
                  add: [publishedProduct.id],
                  remove: [baseProduct.id],
                },
                adminHeaders
              )

              expect(response.status).toEqual(200)
              expect(response.data.collection).toBeTruthy()

              const collection = (
                await api.get(
                  `/admin/collections/${baseCollection.id}?fields=*products`,
                  adminHeaders
                )
              ).data.collection

              expect(collection.products).toHaveLength(1)
              expect(collection.products[0]).toEqual(
                expect.objectContaining({
                  id: publishedProduct.id,
                })
              )
            }
          )
        })
      })

      // TODO: Discuss how this should be handled
      describe.skip("GET /admin/products/tag-usage", () => {
        it("successfully gets the tags usage", async () => {
          const res = await api
            .get("/admin/products/tag-usage", adminHeaders)
            .catch((err) => {
              console.log(err)
            })

          expect(res.status).toEqual(200)
          expect(res.data.tags.length).toEqual(3)
          expect(res.data.tags).toEqual(
            expect.arrayContaining([
              { id: "tag1", usage_count: "2", value: "123" },
              { id: "tag3", usage_count: "2", value: "1235" },
              { id: "tag4", usage_count: "1", value: "1234" },
            ])
          )
        })
      })
    })
  },
})
