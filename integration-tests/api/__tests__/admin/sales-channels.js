const { ModuleRegistrationName, Modules } = require("@medusajs/modules-sdk")
const { medusaIntegrationTestRunner } = require("medusa-test-utils")
const {
  createAdminUser,
  adminHeaders,
} = require("../../../helpers/create-admin-user")
const { breaking } = require("../../../helpers/breaking")
const { ContainerRegistrationKeys } = require("@medusajs/utils")

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

let { simpleSalesChannelFactory, simpleProductFactory, simpleOrderFactory } = {}
let { SalesChannel, Product } = {}
let orderSeeder
let productSeeder

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  // env: { MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container
    let salesChannelService
    let productService
    let remoteQuery
    let remoteLink

    beforeAll(() => {
      ;({
        simpleProductFactory,
        simpleSalesChannelFactory,
        simpleOrderFactory,
      } = require("../../../factories"))
      ;({ SalesChannel, Product } = require("@medusajs/medusa"))

      orderSeeder = require("../../../helpers/order-seeder")
      productSeeder = require("../../../helpers/product-seeder")
    })

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminReqConfig, container)

      salesChannelService = container.resolve(
        ModuleRegistrationName.SALES_CHANNEL
      )
      productService = container.resolve(ModuleRegistrationName.PRODUCT)
      remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
      remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    })

    describe("GET /admin/sales-channels/:id", () => {
      let salesChannel

      beforeEach(async () => {
        salesChannel = await breaking(
          async () => {
            return await simpleSalesChannelFactory(dbConnection, {
              name: "test name",
              description: "test description",
            })
          },
          async () => {
            return await salesChannelService.create({
              name: "test name",
              description: "test description",
            })
          }
        )
      })

      it("should retrieve the requested sales channel", async () => {
        const response = await api.get(
          `/admin/sales-channels/${salesChannel.id}`,
          adminReqConfig
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toBeTruthy()
        expect(response.data.sales_channel).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: salesChannel.name,
            description: salesChannel.description,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        )
      })
    })

    describe("GET /admin/sales-channels", () => {
      let salesChannel1
      let salesChannel2

      beforeEach(async () => {
        salesChannel1 = await breaking(
          async () => {
            return await simpleSalesChannelFactory(dbConnection, {
              name: "test name",
              description: "test description",
            })
          },
          async () => {
            return await salesChannelService.create({
              name: "test name",
              description: "test description",
            })
          }
        )

        salesChannel2 = await breaking(
          async () => {
            return await simpleSalesChannelFactory(dbConnection, {
              name: "test name 2",
              description: "test description 2",
            })
          },
          async () => {
            return await salesChannelService.create({
              name: "test name 2",
              description: "test description 2",
            })
          }
        )
      })

      it("should list the sales channel", async () => {
        const response = await api.get(`/admin/sales-channels`, adminReqConfig)

        expect(response.status).toEqual(200)
        expect(response.data.sales_channels).toBeTruthy()
        expect(response.data.sales_channels.length).toBe(
          breaking(
            () => 3, // Two created + the default one
            () => 2 // This will not be breaking once the default sales channel is created in the new API
          )
        )
        expect(response.data).toEqual(
          expect.objectContaining({
            sales_channels: expect.arrayContaining([
              expect.objectContaining({
                name: salesChannel1.name,
                description: salesChannel1.description,
              }),
              expect.objectContaining({
                name: salesChannel2.name,
                description: salesChannel2.description,
              }),
            ]),
          })
        )
      })

      it("should list the sales channel using filters", async () => {
        const response = await api.get(
          `/admin/sales-channels?q=2`,
          adminReqConfig
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channels).toBeTruthy()
        expect(response.data.sales_channels.length).toBe(1)
        expect(response.data).toEqual({
          count: 1,
          limit: 20,
          offset: 0,
          sales_channels: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: salesChannel2.name,
              description: salesChannel2.description,
              is_disabled: false,
              deleted_at: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
        })
      })

      it("should list the sales channel using properties filters", async () => {
        const response = await api.get(
          `/admin/sales-channels?name=test+name`,
          adminReqConfig
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channels).toBeTruthy()
        expect(response.data.sales_channels.length).toBe(1)
        expect(response.data).toEqual({
          count: 1,
          limit: 20,
          offset: 0,
          sales_channels: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: salesChannel1.name,
              description: salesChannel1.description,
              is_disabled: false,
              deleted_at: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
        })
      })

      it("should support searching of sales channels", async () => {
        await breaking(
          () => {},
          async () => {
            await api.post(
              "/admin/sales-channels",
              { name: "first channel", description: "to fetch" },
              adminReqConfig
            )

            await api.post(
              "/admin/sales-channels",
              { name: "second channel", description: "not in response" },
              adminReqConfig
            )

            const response = await api.get(
              `/admin/sales-channels?q=fetch`,
              adminReqConfig
            )

            expect(response.status).toEqual(200)
            expect(response.data.sales_channels).toEqual([
              expect.objectContaining({
                name: "first channel",
              }),
            ])
          }
        )
      })
    })

    describe("POST /admin/sales-channels/:id", () => {
      let sc

      beforeEach(async () => {
        sc = await breaking(
          async () => {
            return await simpleSalesChannelFactory(dbConnection, {
              name: "test name",
              description: "test description",
            })
          },
          async () => {
            return await salesChannelService.create({
              name: "test name",
              description: "test description",
            })
          }
        )
      })

      it("updates sales channel properties", async () => {
        const payload = {
          name: "updated name",
          description: "updated description",
          is_disabled: true,
        }

        const response = await api.post(
          `/admin/sales-channels/${sc.id}`,
          payload,
          adminReqConfig
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            is_disabled: payload.is_disabled,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        )
      })
    })

    describe("POST /admin/sales-channels", () => {
      beforeEach(async () => {})

      it("successfully creates a disabled sales channel", async () => {
        const newSalesChannel = {
          name: "sales channel name",
          is_disabled: true,
        }

        const response = await api
          .post("/admin/sales-channels", newSalesChannel, adminReqConfig)
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toBeTruthy()

        expect(response.data).toMatchSnapshot({
          sales_channel: expect.objectContaining({
            name: newSalesChannel.name,
            is_disabled: true,
          }),
        })
      })

      it("successfully creates a sales channel", async () => {
        const newSalesChannel = {
          name: "sales channel name",
          description: "sales channel description",
        }

        const response = await api
          .post("/admin/sales-channels", newSalesChannel, adminReqConfig)
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toBeTruthy()

        expect(response.data).toMatchSnapshot({
          sales_channel: expect.objectContaining({
            name: newSalesChannel.name,
            description: newSalesChannel.description,
            is_disabled: false,
          }),
        })
      })
    })

    describe("DELETE /admin/sales-channels/:id", () => {
      let salesChannel

      beforeEach(async () => {
        salesChannel = await breaking(
          async () => {
            return await simpleSalesChannelFactory(dbConnection, {
              name: "test name",
              description: "test description",
            })
          },
          async () => {
            return await salesChannelService.create({
              name: "test name",
              description: "test description",
            })
          }
        )

        await breaking(async () => {
          await simpleSalesChannelFactory(dbConnection, {
            name: "Default channel",
            id: "test-channel",
            is_default: true,
          })
        })
      })

      it("should delete the requested sales channel", async () => {
        const toDelete = await breaking(
          async () => {
            return await dbConnection.manager.findOne(SalesChannel, {
              where: { id: salesChannel.id },
            })
          },
          async () => {
            return await salesChannelService.retrieve(salesChannel.id)
          }
        )

        expect(toDelete.id).toEqual(salesChannel.id)
        expect(toDelete.deleted_at).toEqual(null)

        const response = await api.delete(
          `/admin/sales-channels/${salesChannel.id}`,
          adminReqConfig
        )

        expect(response.status).toEqual(200)
        expect(response.data).toMatchSnapshot({
          deleted: true,
          id: expect.any(String),
          object: "sales-channel",
        })

        const deleted = await breaking(
          async () => {
            return await dbConnection.manager.findOne(SalesChannel, {
              where: { id: salesChannel.id },
              withDeleted: true,
            })
          },
          async () => {
            return await salesChannelService.retrieve(salesChannel.id, {
              withDeleted: true,
            })
          }
        )

        expect(deleted.id).toEqual(salesChannel.id)
        expect(deleted.deleted_at).not.toEqual(null)
      })

      it("should throw if we attempt to delete default channel", async () => {
        await breaking(async () => {
          expect.assertions(2)

          const res = await api
            .delete(`/admin/sales-channels/test-channel`, adminReqConfig)
            .catch((err) => err)

          expect(res.response.status).toEqual(400)
          expect(res.response.data.message).toEqual(
            "You cannot delete the default sales channel"
          )
        })
      })

      it("should successfully delete channel associations", async () => {
        await breaking(null, async () => {
          const remoteLink = container.resolve(
            ContainerRegistrationKeys.REMOTE_LINK
          )

          await remoteLink.create([
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: "test-channel",
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: "test-location",
              },
            },
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: "test-channel-default",
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: "test-location",
              },
            },
          ])

          await api
            .delete(`/admin/sales-channels/test-channel`, adminReqConfig)
            .catch(console.log)

          const linkService = remoteLink.getLinkModule(
            Modules.SALES_CHANNEL,
            "sales_channel_id",
            Modules.STOCK_LOCATION,
            "stock_location_id"
          )

          const channelLinks = await linkService.list()
          expect(channelLinks).toHaveLength(1)
        })
      })
    })

    describe("GET /admin/orders/:id", () => {
      let order
      beforeEach(async () => {
        order = await simpleOrderFactory(dbConnection, {
          sales_channel: {
            name: "test name",
            description: "test description",
          },
          payment_status: "captured",
          fulfillment_status: "fulfilled",
          line_items: [
            {
              id: "line-item",
              quantity: 2,
            },
          ],
        })
      })

      it("expands sales channel for single", async () => {
        const response = await api.get(
          `/admin/orders/${order.id}`,
          adminReqConfig
        )

        expect(response.data.order.sales_channel).toBeTruthy()
        expect(response.data.order.sales_channel).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "test name",
            description: "test description",
            is_disabled: false,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        )
      })

      it("creates swap with order sales channel", async () => {
        const product = await simpleProductFactory(dbConnection, {
          variants: [{ id: "test-variant", inventory_quantity: 100 }],
        })

        const swap = await api.post(
          `/admin/orders/${order.id}/swaps`,
          {
            return_items: [
              {
                item_id: "line-item",
                quantity: 1,
              },
            ],
            additional_items: [{ variant_id: "test-variant", quantity: 1 }],
          },
          adminReqConfig
        )

        expect(swap.status).toEqual(200)

        const cartId = swap.data.order.swaps[0].cart_id

        const swapCart = await api.get(`/store/carts/${cartId}`)

        expect(swapCart.data.cart.sales_channel_id).toEqual(
          order.sales_channel_id
        )
      })

      it("creates swap with provided sales channel", async () => {
        const sc = await simpleSalesChannelFactory(dbConnection, {})

        const product = await simpleProductFactory(dbConnection, {
          variants: [{ id: "test-variant", inventory_quantity: 100 }],
        })

        const swap = await api.post(
          `/admin/orders/${order.id}/swaps`,
          {
            return_items: [
              {
                item_id: "line-item",
                quantity: 1,
              },
            ],
            sales_channel_id: sc.id,
            additional_items: [{ variant_id: "test-variant", quantity: 1 }],
          },
          adminReqConfig
        )

        expect(swap.status).toEqual(200)

        const cartId = swap.data.order.swaps[0].cart_id

        const swapCart = await api.get(`/store/carts/${cartId}`)

        expect(swapCart.data.cart.sales_channel_id).toEqual(sc.id)
      })
    })

    describe("GET /admin/orders?expand=sales_channels", () => {
      beforeEach(async () => {
        await simpleOrderFactory(dbConnection, {
          sales_channel: {
            name: "test name",
            description: "test description",
          },
        })
      })

      it("expands sales channel with parameter", async () => {
        const response = await api.get(
          "/admin/orders?expand=sales_channel",
          adminReqConfig
        )

        expect(response.data.orders[0].sales_channel).toBeTruthy()
        expect(response.data.orders[0].sales_channel).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "test name",
            description: "test description",
            is_disabled: false,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        )
      })
    })

    describe("GET /admin/product/:id", () => {
      let product
      beforeEach(async () => {
        product = await simpleProductFactory(dbConnection, {
          sales_channels: [
            {
              name: "webshop",
              description: "Webshop sales channel",
            },
            {
              name: "amazon",
              description: "Amazon sales channel",
            },
          ],
        })
      })

      it("returns product with sales channel", async () => {
        const response = await api
          .get(`/admin/products/${product.id}`, adminReqConfig)
          .catch((err) => console.log(err))

        expect(response.data.product.sales_channels).toBeTruthy()
        expect(response.data.product.sales_channels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: "webshop",
              description: "Webshop sales channel",
              is_disabled: false,
            }),
            expect.objectContaining({
              name: "amazon",
              description: "Amazon sales channel",
              is_disabled: false,
            }),
          ])
        )
      })
    })

    describe("GET /admin/products?expand[]=sales_channels", () => {
      beforeEach(async () => {
        await simpleProductFactory(dbConnection, {
          sales_channels: [
            {
              name: "webshop",
              description: "Webshop sales channel",
            },
            {
              name: "amazon",
              description: "Amazon sales channel",
            },
          ],
        })
      })

      it("expands sales channel with parameter", async () => {
        const response = await api.get(
          "/admin/products?expand=sales_channels",
          adminReqConfig
        )

        expect(response.data.products[0].sales_channels).toBeTruthy()
        expect(response.data.products[0].sales_channels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: "webshop",
              description: "Webshop sales channel",
              is_disabled: false,
            }),
            expect.objectContaining({
              name: "amazon",
              description: "Amazon sales channel",
              is_disabled: false,
            }),
          ])
        )
      })
    })

    describe("DELETE /admin/sales-channels/:id/products/batch", () => {
      // BREAKING CHANGE: Endpoint has changed
      // from: DELETE /admin/sales-channels/:id/products/batch
      // to: POST /admin/sales-channels/:id/products/batch/remove

      let salesChannel
      let product

      beforeEach(async () => {
        ;({ salesChannel, product } = await breaking(
          async () => {
            const product = await simpleProductFactory(dbConnection, {
              id: "product_1",
              title: "test title",
            })
            const salesChannel = await simpleSalesChannelFactory(dbConnection, {
              name: "test name",
              description: "test description",
              products: [product],
            })

            return { salesChannel, product }
          },
          async () => {
            const salesChannel = await salesChannelService.create({
              name: "test name",
              description: "test description",
            })
            const product = await productService.create({
              title: "test title",
            })

            await remoteLink.create({
              [Modules.PRODUCT]: {
                product_id: product.id,
              },
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
            })

            return { salesChannel, product }
          }
        ))
      })

      it("should remove products from a sales channel", async () => {
        const attachedProduct = await breaking(
          async () => {
            return await dbConnection.manager.findOne(Product, {
              where: { id: product.id },
              relations: ["sales_channels"],
            })
          },
          async () => {
            const [product] = await remoteQuery({
              products: {
                fields: ["id"],
                sales_channels: {
                  fields: ["id", "name", "description", "is_disabled"],
                },
              },
            })

            return product
          }
        )

        expect(attachedProduct.sales_channels.length).toBe(
          breaking(
            () => 2,
            () => 1 // Comment: The product factory from v1 adds products to the default channel
          )
        )
        expect(attachedProduct.sales_channels).toEqual(
          expect.arrayContaining(
            breaking(
              () => [
                expect.objectContaining({
                  id: expect.any(String),
                  name: "test name",
                  description: "test description",
                  is_disabled: false,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  is_disabled: false,
                }),
              ],
              () => [
                expect.objectContaining({
                  id: expect.any(String),
                  name: "test name",
                  description: "test description",
                  is_disabled: false,
                }),
              ]
            )
          )
        )

        const payload = {
          product_ids: breaking(
            () => [{ id: product.id }],
            () => [product.id]
          ),
        }

        const response = await breaking(
          async () => {
            return await api.delete(
              `/admin/sales-channels/${salesChannel.id}/products/batch`,
              { ...adminReqConfig, data: payload }
            )
          },
          async () => {
            return await api.post(
              `/admin/sales-channels/${salesChannel.id}/products/batch/remove`,
              payload,
              adminReqConfig
            )
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "test name",
            description: "test description",
            is_disabled: false,
          })
        )

        const removedProduct = await breaking(
          async () => {
            return await dbConnection.manager.findOne(Product, {
              where: { id: product.id },
              relations: ["sales_channels"],
            })
          },
          async () => {
            const [product] = await remoteQuery({
              products: {
                fields: ["id"],
                sales_channels: {
                  fields: ["id", "name", "description", "is_disabled"],
                },
              },
            })

            return product
          }
        )

        // default sales channel
        expect(removedProduct.sales_channels.length).toBe(
          breaking(
            () => 1,
            () => 0 // Comment: The product factory from v1 adds products to the default channel
          )
        )
      })
    })

    describe("POST /admin/sales-channels/:id/products/batch", () => {
      // BREAKING CHANGE: Endpoint has changed
      // from: /admin/sales-channels/:id/products/batch
      // to: /admin/sales-channels/:id/products

      let { salesChannel, product } = {}

      beforeEach(async () => {
        ;({ salesChannel, product } = await breaking(
          async () => {
            const salesChannel = await simpleSalesChannelFactory(dbConnection, {
              name: "test name",
              description: "test description",
            })
            const product = await simpleProductFactory(dbConnection, {
              id: "product_1",
              title: "test title",
            })

            return { salesChannel, product }
          },
          async () => {
            const salesChannel = await salesChannelService.create({
              name: "test name",
              description: "test description",
            })
            const product = await productService.create({
              title: "test title",
            })

            return { salesChannel, product }
          }
        ))
      })

      it("should add products to a sales channel", async () => {
        const payload = breaking(
          () => ({
            product_ids: [{ id: product.id }],
          }),
          () => ({
            add: [product.id],
          })
        )

        const response = await breaking(
          async () => {
            return await api.post(
              `/admin/sales-channels/${salesChannel.id}/products/batch`,
              payload,
              adminReqConfig
            )
          },
          async () => {
            return await api.post(
              `/admin/sales-channels/${salesChannel.id}/products`,
              payload,
              adminReqConfig
            )
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "test name",
            description: "test description",
            is_disabled: false,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          })
        )

        const attachedProduct = await breaking(
          async () => {
            return await dbConnection.manager.findOne(Product, {
              where: { id: product.id },
              relations: ["sales_channels"],
            })
          },
          async () => {
            const [product] = await remoteQuery({
              products: {
                fields: ["id"],
                sales_channels: {
                  fields: ["id", "name", "description", "is_disabled"],
                },
              },
            })

            return product
          }
        )

        // + default sales channel
        expect(attachedProduct.sales_channels.length).toBe(
          breaking(
            () => 2,
            () => 1 // Comment: The product factory from v1 adds products to the default channel
          )
        )
        expect(attachedProduct.sales_channels).toEqual(
          expect.arrayContaining(
            breaking(
              () => {
                return [
                  expect.objectContaining({
                    id: expect.any(String),
                    name: "test name",
                    description: "test description",
                    is_disabled: false,
                  }),
                  expect.objectContaining({
                    // Comment: Same as above
                    id: expect.any(String),
                    is_disabled: false,
                  }),
                ]
              },
              () => {
                return [
                  expect.objectContaining({
                    id: expect.any(String),
                    name: "test name",
                    description: "test description",
                    is_disabled: false,
                  }),
                ]
              }
            )
          )
        )
      })
    })

    describe("/admin/orders using sales channels", () => {
      describe("GET /admin/orders", () => {
        let order

        beforeEach(async () => {
          order = await simpleOrderFactory(dbConnection, {
            sales_channel: {
              name: "test name",
              description: "test description",
            },
          })
          await orderSeeder(dbConnection)
        })

        it("should successfully lists orders that belongs to the requested sales channels", async () => {
          const response = await api.get(
            `/admin/orders?sales_channel_id[]=${order.sales_channel_id}`,
            {
              headers: {
                "x-medusa-access-token": "test_token",
              },
            }
          )

          expect(response.status).toEqual(200)
          expect(response.data.orders.length).toEqual(1)
          expect(response.data.orders).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: order.id,
              }),
            ])
          )
        })
      })
    })

    describe("/admin/products using sales channels", () => {
      describe("GET /admin/products", () => {
        const productData = {
          id: "product-sales-channel-1",
          title: "test description",
        }
        let salesChannel

        beforeEach(async () => {
          await productSeeder(dbConnection)
          const product = await simpleProductFactory(dbConnection, productData)
          salesChannel = await simpleSalesChannelFactory(dbConnection, {
            name: "test name",
            description: "test description",
            products: [product],
          })
        })

        it("should returns a list of products that belongs to the requested sales channels", async () => {
          const response = await api
            .get(`/admin/products?sales_channel_id[]=${salesChannel.id}`, {
              headers: {
                "x-medusa-access-token": "test_token",
              },
            })
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.products.length).toEqual(1)
          expect(response.data.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productData.id,
                title: productData.title,
              }),
            ])
          )
        })
      })

      describe("POST /admin/products", () => {
        let salesChannel

        beforeEach(async () => {
          await productSeeder(dbConnection)
          salesChannel = await simpleSalesChannelFactory(dbConnection, {
            name: "test name",
            description: "test description",
            is_default: true,
          })
        })

        it("should creates a product that is assigned to a sales_channel", async () => {
          const payload = {
            title: "Test",
            description: "test-product-description",
            type: { value: "test-type" },
            options: [{ title: "size" }, { title: "color" }],
            variants: [
              {
                title: "Test variant",
                inventory_quantity: 10,
                prices: [{ currency_code: "usd", amount: 100 }],
                options: [{ value: "large" }, { value: "green" }],
              },
            ],
            sales_channels: [{ id: salesChannel.id }],
          }

          const response = await api
            .post("/admin/products", payload, {
              headers: {
                "x-medusa-access-token": "test_token",
              },
            })
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              sales_channels: [
                expect.objectContaining({
                  id: salesChannel.id,
                  name: salesChannel.name,
                }),
              ],
            })
          )
        })

        it("should assign the default sales channel to a product if none is provided when creating it", async () => {
          const payload = {
            title: "Product-no-saleschannel",
            description: "test-product-description",
            type: { value: "test-type" },
            options: [{ title: "size" }],
            variants: [
              {
                title: "Test variant",
                inventory_quantity: 10,
                prices: [{ currency_code: "usd", amount: 100 }],
                options: [{ value: "large" }],
              },
            ],
          }

          const response = await api
            .post("/admin/products", payload, {
              headers: {
                "x-medusa-access-token": "test_token",
              },
            })
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              sales_channels: [
                expect.objectContaining({
                  id: salesChannel.id,
                  name: salesChannel.name,
                }),
              ],
            })
          )
        })
      })

      describe("POST /admin/products/:id", () => {
        let salesChannel

        beforeEach(async () => {
          await productSeeder(dbConnection)
          salesChannel = await simpleSalesChannelFactory(dbConnection, {
            name: "test name",
            description: "test description",
          })
        })

        it("should update a product sales channels assignation with either a sales channel, null, [] or undefined", async () => {
          let response = await api
            .post(
              "/admin/products/test-product",
              {
                sales_channels: null,
              },
              {
                headers: {
                  "x-medusa-access-token": "test_token",
                },
              }
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              sales_channels: [],
            })
          )

          response = await api
            .post(
              "/admin/products/test-product",
              {
                sales_channels: [{ id: salesChannel.id }],
              },
              {
                headers: {
                  "x-medusa-access-token": "test_token",
                },
              }
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              sales_channels: [
                expect.objectContaining({
                  id: salesChannel.id,
                  name: salesChannel.name,
                }),
              ],
            })
          )

          response = await api
            .post(
              "/admin/products/test-product",
              {},
              {
                headers: {
                  "x-medusa-access-token": "test_token",
                },
              }
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              sales_channels: [
                expect.objectContaining({
                  id: salesChannel.id,
                  name: salesChannel.name,
                }),
              ],
            })
          )

          response = await api
            .post(
              "/admin/products/test-product",
              {
                sales_channels: [],
              },
              {
                headers: {
                  "x-medusa-access-token": "test_token",
                },
              }
            )
            .catch((err) => {
              console.log(err)
            })

          expect(response.status).toEqual(200)
          expect(response.data.product).toEqual(
            expect.objectContaining({
              sales_channels: [],
            })
          )
        })

        it("should throw on update if the sales channels does not exists", async () => {
          const err = await api
            .post(
              "/admin/products/test-product",
              {
                sales_channels: [{ id: "fake_id" }, { id: "fake_id_2" }],
              },
              {
                headers: {
                  "x-medusa-access-token": "test_token",
                },
              }
            )
            .catch((err) => err)

          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toBe(
            "Provided request body contains errors. Please check the data and retry the request"
          )
          expect(err.response.data.errors).toEqual([
            "Sales Channels fake_id, fake_id_2 do not exist",
          ])
        })
      })
    })
  },
})
