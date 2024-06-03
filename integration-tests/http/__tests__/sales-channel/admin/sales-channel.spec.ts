import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
    adminHeaders,
    createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeAll(() => {})

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("GET /admin/sales-channels/:id", () => {
      let salesChannel

      beforeEach(async () => {
        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name",
              description: "test description",
            },
            adminHeaders
          )
        ).data.sales_channel
      })

      it("should retrieve the requested sales channel", async () => {
        const response = await api.get(
          `/admin/sales-channels/${salesChannel.id}`,
          adminHeaders
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
        salesChannel1 = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name",
              description: "test description",
            },
            adminHeaders
          )
        ).data.sales_channel

        salesChannel2 = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name 2",
              description: "test description 2",
            },
            adminHeaders
          )
        ).data.sales_channel
      })

      it("should list the sales channel", async () => {
        const response = await api.get(`/admin/sales-channels`, adminHeaders)

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

      it("should list the sales channel using filters", async () => {
        const response = await api.get(
          `/admin/sales-channels?q=2`,
          adminHeaders
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
          adminHeaders
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
        await api.post(
          "/admin/sales-channels",
          { name: "first channel", description: "to fetch" },
          adminHeaders
        )

        await api.post(
          "/admin/sales-channels",
          { name: "second channel", description: "not in response" },
          adminHeaders
        )

        const response = await api.get(
          `/admin/sales-channels?q=fetch`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channels).toEqual([
          expect.objectContaining({
            name: "first channel",
          }),
        ])
      })
    })

    describe("POST /admin/sales-channels/:id", () => {
      let sc

      beforeEach(async () => {
        sc = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name",
              description: "test description",
            },
            adminHeaders
          )
        ).data.sales_channel
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
          adminHeaders
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
      it("successfully creates a disabled sales channel", async () => {
        const newSalesChannel = {
          name: "sales channel name",
          is_disabled: true,
        }

        const response = await api.post(
          "/admin/sales-channels",
          newSalesChannel,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toBeTruthy()

        expect(response.data).toEqual(
          expect.objectContaining({
            sales_channel: expect.objectContaining({
              name: newSalesChannel.name,
              is_disabled: true,
            }),
          })
        )
      })

      it("successfully creates a sales channel", async () => {
        const newSalesChannel = {
          name: "sales channel name",
          description: "sales channel description",
        }

        const response = await api.post(
          "/admin/sales-channels",
          newSalesChannel,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.sales_channel).toBeTruthy()

        expect(response.data).toEqual(
          expect.objectContaining({
            sales_channel: expect.objectContaining({
              name: newSalesChannel.name,
              description: newSalesChannel.description,
              is_disabled: false,
            }),
          })
        )
      })
    })

    describe("DELETE /admin/sales-channels/:id", () => {
      let salesChannel
      let salesChannel2

      beforeEach(async () => {
        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name",
              description: "test description",
            },
            adminHeaders
          )
        ).data.sales_channel

        salesChannel2 = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name 2",
              description: "test description 2",
            },
            adminHeaders
          )
        ).data.sales_channel
      })

      it("should delete the requested sales channel", async () => {
        const toDelete = (
          await api.get(
            `/admin/sales-channels/${salesChannel.id}`,
            adminHeaders
          )
        ).data.sales_channel

        expect(toDelete.id).toEqual(salesChannel.id)
        expect(toDelete.deleted_at).toEqual(null)

        const response = await api.delete(
          `/admin/sales-channels/${salesChannel.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          deleted: true,
          id: expect.any(String),
          object: "sales-channel",
        })

        await api
          .get(
            `/admin/sales-channels/${salesChannel.id}?fields=id,deleted_at`,
            adminHeaders
          )
          .catch((err) => {
            expect(err.response.data.type).toEqual("not_found")
            expect(err.response.data.message).toEqual(
              `Sales channel with id: ${salesChannel.id} not found`
            )
          })
      })

      it("should successfully delete channel associations", async () => {
        let location = (
          await api.post(
            `/admin/stock-locations`,
            {
              name: "test location",
            },
            adminHeaders
          )
        ).data.stock_location

        await api.post(
          `/admin/stock-locations/${location.id}/sales-channels`,
          {
            add: [salesChannel.id, salesChannel2.id],
          },
          adminHeaders
        )

        await api.delete(
          `/admin/sales-channels/${salesChannel.id}`,
          adminHeaders
        )

        location = (
          await api.get(
            `/admin/stock-locations/${location.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.stock_location

        expect(location.sales_channels).toHaveLength(1)
      })
    })

    describe("POST /admin/sales-channels/:id/products", () => {
      // BREAKING CHANGE: Endpoint has changed
      // from: /admin/sales-channels/:id/products/batch
      // to: /admin/sales-channels/:id/products

      let salesChannel
      let product
      beforeEach(async () => {
        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            {
              name: "test name",
              description: "test description",
            },
            adminHeaders
          )
        ).data.sales_channel

        product = (
          await api.post(
            "/admin/products",
            {
              title: "test name",
            },
            adminHeaders
          )
        ).data.product
      })

      it("should add products to a sales channel", async () => {
        const response = await api.post(
          `/admin/sales-channels/${salesChannel.id}/products`,
          { add: [product.id] },
          adminHeaders
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

        product = (
          await api.get(
            `/admin/products/${product.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.product

        expect(product.sales_channels.length).toBe(1)
        expect(product.sales_channels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: "test name",
              description: "test description",
              is_disabled: false,
            }),
          ])
        )
      })

      it("should remove products from a sales channel", async () => {
        await api.post(
          `/admin/sales-channels/${salesChannel.id}/products`,
          { add: [product.id] },
          adminHeaders
        )

        product = (
          await api.get(
            `/admin/products/${product.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.product

        expect(product.sales_channels.length).toBe(1)
        expect(product.sales_channels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: "test name",
              description: "test description",
              is_disabled: false,
            }),
          ])
        )

        const response = await api.post(
          `/admin/sales-channels/${salesChannel.id}/products`,
          { remove: [product.id] },
          adminHeaders
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

        product = (
          await api.get(
            `/admin/products/${product.id}?fields=*sales_channels`,
            adminHeaders
          )
        ).data.product

        expect(product.sales_channels.length).toBe(0)
      })
    })
    // DELETED TESTS:
    // - POST /admin/products/:id
    //    - Mutation sales channels on products
    // - POST /admin/products
    //    - Creating a product with a sales channel
    // - GET /admin/products
    //    - Filtering products by sales channel
    //    - Expanding with a sales channel
    // - GET /admin/orders
    //    - Filtering orders by sales channel
    //    - Expanding with a sales channel
    // - POST /admin/orders/:id/swaps
    //    - Creating a swap with a sales channel
    //
  },
})
