import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseProduct
    let baseRegion

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      // BREAKING: Creating a region no longer takes tax_rate, payment_providers, fulfillment_providers, countriesr
      baseRegion = (
        await api.post(
          "/admin/regions",
          {
            name: "Test region",
            currency_code: "USD",
          },
          adminHeaders
        )
      ).data.region

      baseProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Base product",
          }),
          adminHeaders
        )
      ).data.product
    })

    // BREAKING: We no longer have `/admin/variants` endpoint. Instead, variant is scoped by product ID, `/admin/products/:id/variants`
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
          baseProduct.variants[0].prices.find((p) => p.currency_code === "usd")
            .amount
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

    // TODO: Do we want to support price calculation on the admin endpoints? Enable this suite if we do, otherwise remove it
    describe.skip("variant pricing calculations", () => {
      it("selects prices based on the passed currency code", async () => {
        const response = await api.get(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}?fields=calculated_price&currency_code=usd`,
          adminHeaders
        )

        expect(response.data.variant).toEqual({
          id: baseProduct.variants[0].id,
          original_price: 100,
          calculated_price: 80,
          calculated_price_type: "sale",
          original_price_incl_tax: null,
          calculated_price_incl_tax: null,
          original_tax: null,
          calculated_tax: null,
          options: expect.any(Array),
          prices: expect.any(Array),
          product: expect.any(Object),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      })

      it("selects prices based on the passed region id", async () => {
        const response = await api.get(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}?fields=calculated_price&region_id=${baseRegion.id}`,
          adminHeaders
        )

        expect(response.data.variant).toEqual({
          id: "test-variant",
          original_price: 100,
          calculated_price: 80,
          calculated_price_type: "sale",
          original_price_incl_tax: 100,
          calculated_price_incl_tax: 80,
          original_tax: 0,
          calculated_tax: 0,
          options: expect.any(Array),
          prices: expect.any(Array),
          product: expect.any(Object),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      })

      it("selects prices based on the passed region id and customer id", async () => {
        const response = await api.get(
          `/admin/products/${baseProduct.id}/variants/${
            baseProduct.variants[0].id
          }?fields=calculated_price&region_id=${
            baseRegion.id
          }&customer_id=${""}`,
          adminHeaders
        )

        expect(response.data.variant).toEqual({
          id: "test-variant",
          original_price: 100,
          calculated_price: 40,
          calculated_price_type: "sale",
          original_price_incl_tax: 100,
          calculated_price_incl_tax: 40,
          original_tax: 0,
          calculated_tax: 0,
          prices: expect.any(Array),
          options: expect.any(Array),
          product: expect.any(Object),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
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
          prices: [
            {
              currency_code: "usd",
              amount: 100,
            },
            {
              currency_code: "eur",
              amount: 200,
            },
          ],
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
            }),
            expect.objectContaining({
              currency_code: "eur",
              amount: 200,
              variant_id: insertedVariant.id,
            }),
          ])
        )
      })
    })

    describe("POST /admin/products/:id/variants/:variant_id/inventory-items", () => {
      it("should throw an error when required attributes are not passed", async () => {
        const { response } = await api
          .post(
            `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items`,
            {},
            adminHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data).toEqual({
          type: "invalid_data",
          message:
            "Invalid request: Field 'required_quantity' is required; Field 'inventory_item_id' is required",
        })
      })

      it("successfully adds inventory item to a variant", async () => {
        const inventoryItem = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "12345" },
            adminHeaders
          )
        ).data.inventory_item

        const res = await api.post(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items?fields=inventory_items.inventory.*,inventory_items.*`,
          {
            inventory_item_id: inventoryItem.id,
            required_quantity: 5,
          },
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.variant.inventory_items).toHaveLength(2)
        expect(res.data.variant.inventory_items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              required_quantity: 5,
              inventory_item_id: inventoryItem.id,
            }),
          ])
        )
      })
    })

    describe("POST /admin/products/:id/variants/:variant_id/inventory-items/:inventory_id", () => {
      let inventoryItem

      beforeEach(async () => {
        inventoryItem = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "12345" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items`,
          {
            inventory_item_id: inventoryItem.id,
            required_quantity: 5,
          },
          adminHeaders
        )
      })

      it("should throw an error when required attributes are not passed", async () => {
        const { response } = await api
          .post(
            `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items/${inventoryItem.id}`,
            {},
            adminHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data).toEqual({
          type: "invalid_data",
          message: "Invalid request: Field 'required_quantity' is required",
        })
      })

      it("successfully updates an inventory item link to a variant", async () => {
        const res = await api.post(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items/${inventoryItem.id}?fields=inventory_items.inventory.*,inventory_items.*`,
          { required_quantity: 10 },
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.variant.inventory_items).toHaveLength(2)
        expect(res.data.variant.inventory_items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              required_quantity: 10,
              inventory_item_id: inventoryItem.id,
            }),
          ])
        )
      })
    })

    describe("DELETE /admin/products/:id/variants/:variant_id/inventory-items/:inventory_id", () => {
      let inventoryItem

      beforeEach(async () => {
        inventoryItem = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "12345" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items`,
          {
            inventory_item_id: inventoryItem.id,
            required_quantity: 5,
          },
          adminHeaders
        )
      })

      it("successfully deletes an inventory item link from a variant", async () => {
        await api.post(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items`,
          { inventory_item_id: inventoryItem.id, required_quantity: 5 },
          adminHeaders
        )

        const res = await api.delete(
          `/admin/products/${baseProduct.id}/variants/${baseProduct.variants[0].id}/inventory-items/${inventoryItem.id}?fields=inventory_items.inventory.*,inventory_items.*`,
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.parent.inventory_items).toHaveLength(1)
        expect(res.data.parent.inventory_items[0].id).not.toBe(inventoryItem.id)
      })
    })

    describe("POST /admin/products/:id/variants/:variant_id/inventory-items/batch", () => {
      let inventoryItemToUpdate
      let inventoryItemToDelete
      let inventoryItemToCreate
      let inventoryProduct
      let inventoryVariant1
      let inventoryVariant2
      let inventoryVariant3

      beforeEach(async () => {
        inventoryProduct = (
          await api.post(
            "/admin/products",
            {
              title: "product 1",
              variants: [
                {
                  title: "variant 1",
                  prices: [{ currency_code: "usd", amount: 100 }],
                },
                {
                  title: "variant 2",
                  prices: [{ currency_code: "usd", amount: 100 }],
                },
                {
                  title: "variant 3",
                  prices: [{ currency_code: "usd", amount: 100 }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        inventoryVariant1 = inventoryProduct.variants[0]
        inventoryVariant2 = inventoryProduct.variants[1]
        inventoryVariant3 = inventoryProduct.variants[2]

        inventoryItemToCreate = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "to-create" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemToUpdate = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "to-update" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemToDelete = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "to-delete" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/products/${baseProduct.id}/variants/${inventoryVariant1.id}/inventory-items`,
          {
            inventory_item_id: inventoryItemToUpdate.id,
            required_quantity: 5,
          },
          adminHeaders
        )

        await api.post(
          `/admin/products/${baseProduct.id}/variants/${inventoryVariant2.id}/inventory-items`,
          {
            inventory_item_id: inventoryItemToDelete.id,
            required_quantity: 10,
          },
          adminHeaders
        )
      })

      it("successfully creates, updates and deletes an inventory item link from a variant", async () => {
        const res = await api.post(
          `/admin/products/${inventoryProduct.id}/variants/inventory-items/batch`,
          {
            create: [
              {
                required_quantity: 15,
                inventory_item_id: inventoryItemToCreate.id,
                variant_id: inventoryVariant3.id,
              },
            ],
            update: [
              {
                required_quantity: 25,
                inventory_item_id: inventoryItemToUpdate.id,
                variant_id: inventoryVariant1.id,
              },
            ],
            delete: [
              {
                inventory_item_id: inventoryItemToDelete.id,
                variant_id: inventoryVariant2.id,
              },
            ],
          },
          adminHeaders
        )

        expect(res.status).toEqual(200)

        const createdLinkVariant = (
          await api.get(
            `/admin/products/${inventoryProduct.id}/variants/${inventoryVariant3.id}?fields=inventory_items.inventory.*,inventory_items.*`,
            adminHeaders
          )
        ).data.variant

        expect(createdLinkVariant.inventory_items).toHaveLength(2)
        expect(createdLinkVariant.inventory_items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              required_quantity: 15,
              inventory_item_id: inventoryItemToCreate.id,
            }),
          ])
        )

        const updatedLinkVariant = (
          await api.get(
            `/admin/products/${inventoryProduct.id}/variants/${inventoryVariant1.id}?fields=inventory_items.inventory.*,inventory_items.*`,
            adminHeaders
          )
        ).data.variant

        expect(updatedLinkVariant.inventory_items).toHaveLength(2)
        expect(updatedLinkVariant.inventory_items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              required_quantity: 25,
              inventory_item_id: inventoryItemToUpdate.id,
            }),
          ])
        )

        const deletedLinkVariant = (
          await api.get(
            `/admin/products/${inventoryProduct.id}/variants/${inventoryVariant2.id}?fields=inventory_items.inventory.*,inventory_items.*`,
            adminHeaders
          )
        ).data.variant

        expect(deletedLinkVariant.inventory_items).toHaveLength(1)
        expect(deletedLinkVariant.inventory_items[0].id).not.toEqual(
          inventoryItemToDelete.id
        )
      })
    })
  },
})
