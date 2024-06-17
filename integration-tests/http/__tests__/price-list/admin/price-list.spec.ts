import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"
import {
  getPricelistFixture,
  getProductFixture,
} from "../../../../helpers/fixtures"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let pricelist1
    let pricelist2
    let region1
    let product1
    let customerGroup1

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      region1 = (
        await api.post(
          "/admin/regions",
          {
            name: "Test Region",
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.region

      product1 = (
        await api.post(
          "/admin/products",
          getProductFixture({ title: "Test product" }),
          adminHeaders
        )
      ).data.product

      customerGroup1 = (
        await api.post(
          "/admin/customer-groups",
          {
            name: "vip-customers",
            metadata: {
              data1: "value1",
            },
          },
          adminHeaders
        )
      ).data.customer_group

      pricelist1 = (
        await api.post(
          "/admin/price-lists",
          getPricelistFixture({
            title: "New sale",
            prices: [
              {
                amount: 100,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: 1,
                max_quantity: 100,
              },
              {
                amount: 80,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: 101,
                max_quantity: 500,
              },
            ],
          }),
          adminHeaders
        )
      ).data.price_list

      pricelist2 = (
        await api.post(
          "/admin/price-lists",

          getPricelistFixture({
            title: "Another sale",
            description: "50% off on all items",
          }),
          adminHeaders
        )
      ).data.price_list

      // BREAKING: You need to register rule types before you can use them
      await api.post(
        "/admin/pricing/rule-types",
        { name: "Region ID", rule_attribute: "region_id", default_priority: 0 },
        adminHeaders
      )
      await api.post(
        "/admin/pricing/rule-types",
        {
          name: "Customer Group ID",
          rule_attribute: "customer_group_id",
          default_priority: 0,
        },
        adminHeaders
      )
    })

    describe("/admin/price-lists", () => {
      describe("POST /admin/price-list", () => {
        it("creates a price list", async () => {
          const payload = getPricelistFixture({
            title: "VIP Summer sale",
            description:
              "Summer sale for VIP customers. 25% off selected items.",
            rules: {
              customer_group_id: [customerGroup1.id],
            },
            prices: [
              {
                amount: 85,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
              },
              {
                amount: 105,
                currency_code: region1.currency_code,
                region_id: region1.id,
                variant_id: product1.variants[0].id,
              },
            ],
          })

          const response = await api.post(
            "/admin/price-lists",
            payload,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: "VIP Summer sale",
              description:
                "Summer sale for VIP customers. 25% off selected items.",
              type: "sale",
              status: "active",
              starts_at: "2022-07-01T00:00:00.000Z",
              ends_at: "2022-07-31T00:00:00.000Z",
              rules: {
                customer_group_id: [expect.stringContaining("cusgroup_")],
              },
              prices: [
                expect.objectContaining({
                  id: expect.any(String),
                  amount: 85,
                  currency_code: "usd",
                  variant_id: product1.variants[0].id,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  amount: 105,
                  currency_code: region1.currency_code,
                  variant_id: product1.variants[0].id,
                }),
              ],
            })
          )
        })
      })

      describe("GET /admin/price-lists", () => {
        it("returns a price list by :id", async () => {
          const response = await api.get(
            `/admin/price-lists/${pricelist1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: pricelist1.title,
              description: pricelist1.description,
              type: pricelist1.type,
              status: pricelist1.status,
              starts_at: pricelist1.starts_at,
              ends_at: pricelist1.ends_at,
              prices: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  amount: 100,
                  currency_code: "usd",
                  // BREAKING: Min and max quantity are returned as string
                  min_quantity: "1",
                  max_quantity: "100",
                  variant_id: product1.variants[0].id,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  // BREAKING: `variant` and `variants` are not returned as part of the prices
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  amount: 80,
                  currency_code: "usd",
                  min_quantity: "101",
                  max_quantity: "500",
                  variant_id: product1.variants[0].id,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
              ]),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })

        it("returns a list of price lists", async () => {
          const response = await api.get("/admin/price-lists", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.price_lists).toHaveLength(2)
          expect(response.data.price_lists).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: pricelist1.id,
              }),
              expect.objectContaining({
                id: pricelist2.id,
              }),
            ])
          )
        })

        it("given a search query, returns matching results by name", async () => {
          const response = await api.get(
            "/admin/price-lists?q=new",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_lists).toEqual([
            expect.objectContaining({
              title: pricelist1.title,
            }),
          ])
          expect(response.data.count).toEqual(1)
        })

        it("given a search query, returns matching results by description", async () => {
          const response = await api.get(
            "/admin/price-lists?q=50%",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_lists).toEqual([
            expect.objectContaining({
              id: pricelist2.id,
            }),
          ])
          expect(response.data.count).toEqual(1)
        })

        it("given a search query, returns empty list when does not exist", async () => {
          const response = await api.get(
            "/admin/price-lists?q=blablabla",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_lists).toEqual([])
          expect(response.data.count).toEqual(0)
        })

        it("given a search query and a status filter not matching any price list, returns an empty set", async () => {
          const response = await api.get(
            "/admin/price-lists?q=new&status[]=draft",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_lists).toEqual([])
          expect(response.data.count).toEqual(0)
        })

        it("given a search query and a status filter matching a price list, returns a price list", async () => {
          const response = await api.get(
            "/admin/price-lists?q=new&status[]=active",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_lists).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: "New sale",
                status: "active",
              }),
            ])
          )
          expect(response.data.count).toEqual(1)
        })

        it.skip("lists only price lists with customer_group", async () => {
          // BREAKING: You can no longer filter by customer groups
          const response = await api.get(
            `/admin/price-lists?customer_groups[]=customer-group-1,customer-group-2`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_lists.length).toEqual(2)
          expect(response.data.price_lists).toHaveLength(2)
          expect(response.data.price_lists).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: "test-list-cgroup-1" }),
              expect.objectContaining({ id: "test-list-cgroup-2" }),
            ])
          )
        })
      })

      describe("POST /admin/price-lists/:id", () => {
        it("removes configuration with update", async () => {
          const updateResult = await api.post(
            `/admin/price-lists/${pricelist1.id}`,
            { ends_at: null, starts_at: null, rules: {} },
            adminHeaders
          )
          expect(updateResult.status).toEqual(200)
          expect(updateResult.data.price_list.starts_at).toBeFalsy()
          expect(updateResult.data.price_list.ends_at).toBeFalsy()
          expect(updateResult.data.price_list.rules).toEqual({})
        })

        it("updates a price list", async () => {
          const payload = {
            title: "Loyalty Reward - Winter Sale",
            description: "Winter sale for our most loyal customers",
            type: "sale",
            status: "draft",
            starts_at: "2022-09-01T00:00:00.000Z",
            ends_at: "2022-12-31T00:00:00.000Z",
            rules: {
              customer_group_id: [customerGroup1.id],
            },
          }

          const response = await api.post(
            `/admin/price-lists/${pricelist1.id}`,
            payload,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: pricelist1.id,
              title: "Loyalty Reward - Winter Sale",
              description: "Winter sale for our most loyal customers",
              type: "sale",
              status: "draft",
              starts_at: "2022-09-01T00:00:00.000Z",
              ends_at: "2022-12-31T00:00:00.000Z",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 100,
                  currency_code: "usd",
                  id: expect.any(String),
                  max_quantity: "100",
                  min_quantity: "1",
                }),
                expect.objectContaining({
                  amount: 80,
                  currency_code: "usd",
                  id: expect.any(String),
                  max_quantity: "500",
                  min_quantity: "101",
                }),
              ]),
              rules: {
                customer_group_id: [customerGroup1.id],
              },
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })

        it("updates the amount and currency of a price in the price list", async () => {
          const payload = {
            // BREAKING: Updates of prices happen through the batch endpoint, and doing it through the price list update endpoint is no longer supported
            update: [
              {
                id: pricelist1.prices.find((p) => p.amount === 80).id,
                amount: 250,
                currency_code: "eur",
                variant_id: product1.variants[0].id,
              },
            ],
          }

          await api.post(
            `/admin/price-lists/${pricelist1.id}/prices/batch`,
            payload,
            adminHeaders
          )
          const response = await api.get(
            `/admin/price-lists/${pricelist1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices).toEqual([
            expect.objectContaining({
              amount: 100,
              currency_code: "usd",
              id: expect.any(String),
              max_quantity: "100",
              min_quantity: "1",
            }),
            expect.objectContaining({
              amount: 250,
              currency_code: "eur",
              id: expect.any(String),
              max_quantity: "500",
              min_quantity: "101",
            }),
          ])
        })
      })

      describe("POST /admin/price-lists/:id/prices/batch", () => {
        it("Adds a batch of new prices to a price list without overriding existing prices", async () => {
          // BREAKING: The payload of the batch request changed
          const payload = {
            create: [
              {
                amount: 45,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: 1001,
                max_quantity: 2000,
              },
              {
                amount: 35,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: 2001,
                max_quantity: 3000,
              },
              {
                amount: 25,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: 3001,
                max_quantity: 4000,
              },
            ],
          }

          await api.post(
            `/admin/price-lists/${pricelist1.id}/prices/batch`,
            payload,
            adminHeaders
          )
          const response = await api.get(
            `/admin/price-lists/${pricelist1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices.length).toEqual(5)
          expect(response.data.price_list.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
                currency_code: "usd",
                min_quantity: "1",
                max_quantity: "100",
                variant_id: product1.variants[0].id,
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 80,
                currency_code: "usd",
                min_quantity: "101",
                max_quantity: "500",
                variant_id: product1.variants[0].id,
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 45,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: "1001",
                max_quantity: "2000",
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 35,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: "2001",
                max_quantity: "3000",
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 25,
                currency_code: "usd",
                variant_id: product1.variants[0].id,
                min_quantity: "3001",
                max_quantity: "4000",
              }),
            ])
          )
        })

        it.skip("Adds a batch of new prices to a price list overriding existing prices", async () => {
          // BREAKING: There is no support for overriding configuration
          const payload = {
            prices: [
              {
                amount: 45,
                currency_code: "usd",
                variant_id: "test-variant",
                min_quantity: 1001,
                max_quantity: 2000,
              },
              {
                amount: 35,
                currency_code: "usd",
                variant_id: "test-variant",
                min_quantity: 2001,
                max_quantity: 3000,
              },
              {
                amount: 25,
                currency_code: "usd",
                variant_id: "test-variant",
                min_quantity: 3001,
                max_quantity: 4000,
              },
            ],
            override: true,
          }

          const response = await api.post(
            "/admin/price-lists/pl_no_customer_groups/prices/batch",
            payload,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices.length).toEqual(3)
          expect(response.data.price_list.prices).toMatchSnapshot([
            {
              id: expect.any(String),
              price_list_id: "pl_no_customer_groups",
              amount: 45,
              currency_code: "usd",
              variant_id: "test-variant",
              min_quantity: 1001,
              max_quantity: 2000,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              variant: expect.any(Object),
              variants: expect.any(Array),
            },
            {
              id: expect.any(String),
              price_list_id: "pl_no_customer_groups",
              amount: 35,
              currency_code: "usd",
              variant_id: "test-variant",
              min_quantity: 2001,
              max_quantity: 3000,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              variant: expect.any(Object),
              variants: expect.any(Array),
            },
            {
              id: expect.any(String),
              price_list_id: "pl_no_customer_groups",
              amount: 25,
              currency_code: "usd",
              variant_id: "test-variant",
              min_quantity: 3001,
              max_quantity: 4000,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              variant: expect.any(Object),
              variants: expect.any(Array),
            },
          ])
        })

        it("Adds a batch of new prices where a MA record have a `region_id` instead of `currency_code`", async () => {
          // BREAKING: As mentioned, currency code is required now
          const payload = {
            create: [
              {
                amount: 100,
                variant_id: product1.variants[0].id,
                currency_code: "eur",
                region_id: region1.id,
              },
              {
                amount: 200,
                variant_id: product1.variants[0].id,
                currency_code: "eur",
              },
            ],
          }

          await api.post(
            `/admin/price-lists/${pricelist1.id}/prices/batch`,
            payload,
            adminHeaders
          )
          const response = await api.get(
            `/admin/price-lists/${pricelist1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices.length).toEqual(4)
          expect(response.data.price_list.prices).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
                currency_code: "usd",
                min_quantity: "1",
                max_quantity: "100",
                variant_id: product1.variants[0].id,
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 80,
                currency_code: "usd",
                min_quantity: "101",
                max_quantity: "500",
                variant_id: product1.variants[0].id,
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
                currency_code: "eur",
                // region_id: region1.id,
                variant_id: product1.variants[0].id,
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 200,
                currency_code: "eur",
                variant_id: product1.variants[0].id,
              }),
            ])
          )
        })
      })

      describe("DELETE /admin/price-lists/:id", () => {
        it("Deletes a price list", async () => {
          const response = await api.delete(
            `/admin/price-lists/${pricelist1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            id: pricelist1.id,
            object: "price_list",
            deleted: true,
          })

          const err = await api
            .get(`/admin/price-lists/${pricelist1.id}`, adminHeaders)
            .catch((e) => e)

          expect(err.response.status).toBe(404)
          expect(err.response.data.message).toEqual(
            `Price list with id: ${pricelist1.id} was not found`
          )
        })
      })

      describe("tests cascade on delete", () => {
        it("Deletes a variant and ensures that prices associated with the variant are deleted from PriceList", async () => {
          await api.delete(
            `/admin/products/${product1.id}/variants/${product1.variants[0].id}`,
            adminHeaders
          )

          const response = await api.get(
            `/admin/price-lists/${pricelist1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices.length).toEqual(0)
        })
      })

      describe("DELETE /admin/price-lists/:id/prices/batch", () => {
        // BREAKING: The batch method signature changed
        it("Deletes several prices associated with a price list", async () => {
          await api.post(
            `/admin/price-lists/${pricelist1.id}/prices/batch`,
            {
              delete: [pricelist1.prices[0].id],
            },
            adminHeaders
          )

          const response = await api.get(
            `/admin/price-lists/${pricelist1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices).toEqual([
            expect.objectContaining({
              amount: 80,
              currency_code: "usd",
              min_quantity: "101",
              max_quantity: "500",
              variant_id: product1.variants[0].id,
            }),
          ])
        })
      })

      // BREAKING: There is no longer a GET /admin/price-lists/:id/products endpoint. Get products through `/admin/products` endpoint instead
      // BREAKING: There is no longer a DELETE /admin/price-lists/test-list/products/${product.id}/prices endpoint
      // BREAKING: There is no longer a DELETE /admin/price-lists/test-list/variants/${variant.id}/prices endpoint
    })
  },
})

// TODO: Revisit tax inclusive pricing
// describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/price-lists", () => {
//   let medusaProcess
//   let dbConnection

//   beforeAll(async () => {
//     const cwd = path.resolve(path.join(__dirname, "..", ".."))
//     const [process, connection] = await startServerWithEnvironment({
//       cwd,
//       env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
//     })
//     dbConnection = connection
//     medusaProcess = process
//   })

//   afterAll(async () => {
//     const db = useDb()
//     await db.shutdown()

//     medusaProcess.kill()
//   })

//   describe("POST /admin/price-list", () => {
//     const priceListIncludesTaxId = "price-list-1-includes-tax"

//     beforeEach(async () => {
//       try {
//         await adminSeeder(dbConnection)
//         await customerSeeder(dbConnection)
//         await productSeeder(dbConnection)
//         await simplePriceListFactory(dbConnection, {
//           id: priceListIncludesTaxId,
//         })
//       } catch (err) {
//         console.log(err)
//         throw err
//       }
//     })

//     afterEach(async () => {
//       const db = useDb()
//       await db.teardown()
//     })

//     it("should creates a price list that includes tax", async () => {
//       const payload = {
//         name: "VIP Summer sale",
//         description: "Summer sale for VIP customers. 25% off selected items.",
//         type: "sale",
//         status: "active",
//         starts_at: "2022-07-01T00:00:00.000Z",
//         ends_at: "2022-07-31T00:00:00.000Z",
//         customer_groups: [
//           {
//             id: "customer-group-1",
//           },
//         ],
//         prices: [
//           {
//             amount: 85,
//             currency_code: "usd",
//             variant_id: "test-variant",
//           },
//         ],
//         includes_tax: true,
//       }

//       const response = await api
//         .post("/admin/price-lists", payload, adminHeaders)
//         .catch((err) => {
//           console.warn(err.response.data)
//         })

//       expect(response.status).toEqual(200)
//       expect(response.data.price_list).toEqual(
//         expect.objectContaining({
//           id: expect.any(String),
//           includes_tax: true,
//         })
//       )
//     })

//     it("should update a price list that include_tax", async () => {
//       let response = await api
//         .get(`/admin/price-lists/${priceListIncludesTaxId}`, adminHeaders)
//         .catch((err) => {
//           console.log(err)
//         })

//       expect(response.data.price_list.includes_tax).toBe(false)

//       response = await api
//         .post(
//           `/admin/price-lists/${priceListIncludesTaxId}`,
//           { includes_tax: true },
//           adminHeaders
//         )
//         .catch((err) => {
//           console.log(err)
//         })

//       expect(response.data.price_list.includes_tax).toBe(true)
//     })
//   })
// })
