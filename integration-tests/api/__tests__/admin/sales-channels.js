const path = require("path")

const { SalesChannel, Product } = require("@medusajs/medusa")

const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const {
  simpleSalesChannelFactory,
  simpleProductFactory,
} = require("../../factories")
const { simpleOrderFactory } = require("../../factories")
const orderSeeder = require("../../helpers/order-seeder")
const productSeeder = require("../../helpers/product-seeder")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(50000)

describe("sales channels", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/sales-channels/:id", () => {
    let salesChannel

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      salesChannel = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve the requested sales channel", async () => {
      const api = useApi()
      const response = await api.get(
        `/admin/sales-channels/${salesChannel.id}`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channel).toBeTruthy()
      expect(response.data.sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: salesChannel.name,
        description: salesChannel.description,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("GET /admin/sales-channels", () => {
    let salesChannel1
    let salesChannel2

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      salesChannel1 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
      })
      salesChannel2 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name 2",
        description: "test description 2",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should list the sales channel", async () => {
      const api = useApi()
      const response = await api.get(`/admin/sales-channels/`, adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.sales_channels).toBeTruthy()
      expect(response.data.sales_channels.length).toBe(2)
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

    it("should list the sales channel using free text search", async () => {
      const api = useApi()
      const response = await api.get(
        `/admin/sales-channels/?q=2`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channels).toBeTruthy()
      expect(response.data.sales_channels.length).toBe(1)
      expect(response.data).toMatchSnapshot({
        count: 1,
        limit: 20,
        offset: 0,
        sales_channels: expect.arrayContaining([
          {
            id: expect.any(String),
            name: salesChannel2.name,
            description: salesChannel2.description,
            is_disabled: false,
            deleted_at: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ]),
      })
    })

    it("should list the sales channel using properties filters", async () => {
      const api = useApi()
      const response = await api.get(
        `/admin/sales-channels/?name=test+name`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channels).toBeTruthy()
      expect(response.data.sales_channels.length).toBe(1)
      expect(response.data).toMatchSnapshot({
        count: 1,
        limit: 20,
        offset: 0,
        sales_channels: expect.arrayContaining([
          {
            id: expect.any(String),
            name: salesChannel1.name,
            description: salesChannel1.description,
            is_disabled: false,
            deleted_at: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ]),
      })
    })
  })

  describe("POST /admin/sales-channels/:id", () => {
    let sc

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      sc = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates sales channel properties", async () => {
      const api = useApi()

      const payload = {
        name: "updated name",
        description: "updated description",
        is_disabled: true,
      }

      const response = await api.post(
        `/admin/sales-channels/${sc.id}`,
        payload,
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: payload.name,
        description: payload.description,
        is_disabled: payload.is_disabled,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/sales-channels", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully creates a disabled sales channel", async () => {
      const api = useApi()

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
      const api = useApi()

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
      await adminSeeder(dbConnection)
      salesChannel = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
      })

      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "test-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should delete the requested sales channel", async () => {
      const api = useApi()

      let deletedSalesChannel = await dbConnection.manager.findOne(
        SalesChannel,
        {
          where: { id: salesChannel.id },
          withDeleted: true,
        }
      )

      expect(deletedSalesChannel.id).toEqual(salesChannel.id)
      expect(deletedSalesChannel.deleted_at).toEqual(null)

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

      deletedSalesChannel = await dbConnection.manager.findOne(SalesChannel, {
        where: { id: salesChannel.id },
        withDeleted: true,
      })

      expect(deletedSalesChannel.id).toEqual(salesChannel.id)
      expect(deletedSalesChannel.deleted_at).not.toEqual(null)
    })

    it("should delete the requested sales channel idempotently", async () => {
      const api = useApi()

      let deletedSalesChannel = await dbConnection.manager.findOne(
        SalesChannel,
        {
          where: { id: salesChannel.id },
          withDeleted: true,
        }
      )

      expect(deletedSalesChannel.id).toEqual(salesChannel.id)
      expect(deletedSalesChannel.deleted_at).toEqual(null)

      let response = await api.delete(
        `/admin/sales-channels/${salesChannel.id}`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: expect.any(String),
        object: "sales-channel",
        deleted: true,
      })

      deletedSalesChannel = await dbConnection.manager.findOne(SalesChannel, {
        where: { id: salesChannel.id },
        withDeleted: true,
      })

      expect(deletedSalesChannel.id).toEqual(salesChannel.id)
      expect(deletedSalesChannel.deleted_at).not.toEqual(null)

      response = await api.delete(
        `/admin/sales-channels/${salesChannel.id}`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: expect.any(String),
        object: "sales-channel",
        deleted: true,
      })

      deletedSalesChannel = await dbConnection.manager.findOne(SalesChannel, {
        where: { id: salesChannel.id },
        withDeleted: true,
      })

      expect(deletedSalesChannel.id).toEqual(salesChannel.id)
      expect(deletedSalesChannel.deleted_at).not.toEqual(null)
    })

    it("should throw if we attempt to delete default channel", async () => {
      const api = useApi()
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

  describe("GET /admin/orders/:id", () => {
    let order
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      order = await simpleOrderFactory(dbConnection, {
        sales_channel: {
          name: "test name",
          description: "test description",
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("expands sales channel for single", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/orders/${order.id}`,
        adminReqConfig
      )

      expect(response.data.order.sales_channel).toBeTruthy()
      expect(response.data.order.sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: "test name",
        description: "test description",
        is_disabled: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("GET /admin/orders?expand=sales_channels", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleOrderFactory(dbConnection, {
        sales_channel: {
          name: "test name",
          description: "test description",
        },
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("expands sales channel with parameter", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?expand=sales_channel",
        adminReqConfig
      )

      expect(response.data.orders[0].sales_channel).toBeTruthy()
      expect(response.data.orders[0].sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: "test name",
        description: "test description",
        is_disabled: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("GET /admin/product/:id", () => {
    let product
    beforeEach(async () => {
      await adminSeeder(dbConnection)

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

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns product with sales channel", async () => {
      const api = useApi()

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
      await adminSeeder(dbConnection)

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

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("expands sales channel with parameter", async () => {
      const api = useApi()

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
    let salesChannel
    let product

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      product = await simpleProductFactory(dbConnection, {
        id: "product_1",
        title: "test title",
      })
      salesChannel = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
        products: [product],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should remove products from a sales channel", async () => {
      const api = useApi()

      let attachedProduct = await dbConnection.manager.findOne(Product, {
        where: { id: product.id },
        relations: ["sales_channels"],
      })

      expect(attachedProduct.sales_channels.length).toBe(2)
      expect(attachedProduct.sales_channels).toEqual(
        expect.arrayContaining([
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
        ])
      )

      const payload = {
        product_ids: [{ id: product.id }],
      }

      await api.delete(
        `/admin/sales-channels/${salesChannel.id}/products/batch`,
        {
          ...adminReqConfig,
          data: payload,
        }
      )
      // Validate idempotency
      const response = await api.delete(
        `/admin/sales-channels/${salesChannel.id}/products/batch`,
        {
          ...adminReqConfig,
          data: payload,
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

      attachedProduct = await dbConnection.manager.findOne(Product, {
        where: { id: product.id },
        relations: ["sales_channels"],
      })

      // default sales channel
      expect(attachedProduct.sales_channels.length).toBe(1)
    })
  })

  describe("POST /admin/sales-channels/:id/products/batch", () => {
    let salesChannel
    let product

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      salesChannel = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
      })
      product = await simpleProductFactory(dbConnection, {
        id: "product_1",
        title: "test title",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should add products to a sales channel", async () => {
      const api = useApi()

      const payload = {
        product_ids: [{ id: product.id }],
      }

      const response = await api.post(
        `/admin/sales-channels/${salesChannel.id}/products/batch`,
        payload,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channel).toEqual({
        id: expect.any(String),
        name: "test name",
        description: "test description",
        is_disabled: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
      })

      const attachedProduct = await dbConnection.manager.findOne(Product, {
        where: { id: product.id },
        relations: ["sales_channels"],
      })

      // + default sales channel
      expect(attachedProduct.sales_channels.length).toBe(2)
      expect(attachedProduct.sales_channels).toEqual(
        expect.arrayContaining([
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
        ])
      )
    })
  })

  describe("/admin/orders using sales channels", () => {
    describe("GET /admin/orders", () => {
      let order

      beforeEach(async () => {
        await adminSeeder(dbConnection)
        order = await simpleOrderFactory(dbConnection, {
          sales_channel: {
            name: "test name",
            description: "test description",
          },
        })
        await orderSeeder(dbConnection)
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("should successfully lists orders that belongs to the requested sales channels", async () => {
        const api = useApi()

        const response = await api.get(
          `/admin/orders?sales_channel_id[]=${order.sales_channel_id}`,
          {
            headers: {
              authorization: "Bearer test_token",
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
        await adminSeeder(dbConnection)
        const product = await simpleProductFactory(dbConnection, productData)
        salesChannel = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
          products: [product],
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("should returns a list of products that belongs to the requested sales channels", async () => {
        const api = useApi()

        const response = await api
          .get(`/admin/products?sales_channel_id[]=${salesChannel.id}`, {
            headers: {
              Authorization: "Bearer test_token",
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
        await adminSeeder(dbConnection)
        salesChannel = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
          is_default: true,
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("should creates a product that is assigned to a sales_channel", async () => {
        const api = useApi()

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
              Authorization: "Bearer test_token",
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
        const api = useApi()

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
              Authorization: "Bearer test_token",
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
        await adminSeeder(dbConnection)
        salesChannel = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("should update a product sales channels assignation with either a sales channel, null, [] or undefined", async () => {
        const api = useApi()

        let response = await api
          .post(
            "/admin/products/test-product",
            {
              sales_channels: null,
            },
            {
              headers: {
                Authorization: "Bearer test_token",
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
                Authorization: "Bearer test_token",
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
                Authorization: "Bearer test_token",
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
                Authorization: "Bearer test_token",
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
        const api = useApi()

        const err = await api
          .post(
            "/admin/products/test-product",
            {
              sales_channels: [{ id: "fake_id" }, { id: "fake_id_2" }],
            },
            {
              headers: {
                Authorization: "Bearer test_token",
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
})
