const path = require("path")
const { IdMap } = require("medusa-test-utils")

const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const {
  simplePublishableApiKeyFactory,
} = require("../../factories/simple-publishable-api-key-factory")
const {
  simpleSalesChannelFactory,
  simpleProductFactory,
  simpleRegionFactory,
} = require("../../factories")
const setupServer = require("../../../helpers/setup-server")

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

const customerData = {
  email: "medusa@test.hr",
  password: "medusatest",
  first_name: "medusa",
  last_name: "medusa",
}

describe("Publishable API keys", () => {
  let medusaProcess
  let dbConnection
  const adminUserId = "admin_user"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/publishable-api-keys/:id", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
        created_by: adminUserId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("retrieve a publishable key by id ", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys/${pubKeyId}`,
        adminHeaders
      )

      expect(response.status).toBe(200)

      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: adminUserId,
        revoked_by: null,
        revoked_at: null,
      })
    })
  })

  describe("GET /admin/publishable-api-keys", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        title: "just a title",
      })
      await simplePublishableApiKeyFactory(dbConnection, {
        title: "special title 1",
      })
      await simplePublishableApiKeyFactory(dbConnection, {
        title: "special title 2",
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("list publishable keys", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys?limit=2`,
        adminHeaders
      )

      expect(response.data.count).toBe(3)
      expect(response.data.limit).toBe(2)
      expect(response.data.offset).toBe(0)
      expect(response.data.publishable_api_keys).toHaveLength(2)
    })

    it("list publishable keys with query search", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys?q=special`,
        adminHeaders
      )

      expect(response.data.count).toBe(2)
      expect(response.data.limit).toBe(20)
      expect(response.data.offset).toBe(0)
      expect(response.data.publishable_api_keys).toHaveLength(2)
      expect(response.data.publishable_api_keys).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "special title 1",
          }),
          expect.objectContaining({
            title: "special title 2",
          }),
        ])
      )
    })
  })

  describe("POST /admin/publishable-api-keys", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("crete a publishable keys", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/publishable-api-keys`,
        { title: "Store api key" },
        adminHeaders
      )

      expect(response.status).toBe(200)
      expect(response.data.publishable_api_key).toMatchObject({
        created_by: "admin_user",
        id: expect.any(String),
        title: "Store api key",
        revoked_by: null,
        revoked_at: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/publishable-api-keys/:id", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id-update")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
        title: "Initial key title",
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("update a publishable key", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/publishable-api-keys/${pubKeyId}`,
        { title: "Changed title" },
        adminHeaders
      )

      expect(response.status).toBe(200)
      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        title: "Changed title",
        revoked_by: null,
        revoked_at: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/publishable-api-keys/:id/revoke", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("revoke a publishable key", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/revoke`,
        {},
        adminHeaders
      )

      expect(response.status).toBe(200)

      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        revoked_by: adminUserId,
        revoked_at: expect.any(String),
      })
    })
  })

  describe("DELETE /admin/publishable-api-keys/:id", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("delete a publishable key", async () => {
      const api = useApi()

      const response1 = await api.delete(
        `/admin/publishable-api-keys/${pubKeyId}`,
        adminHeaders
      )

      expect(response1.status).toBe(200)
      expect(response1.data).toEqual({
        id: pubKeyId,
        object: "publishable_api_key",
        deleted: true,
      })

      try {
        await api.get(`/admin/publishable-api-keys/${pubKeyId}`, adminHeaders)
      } catch (e) {
        expect(e.response.status).toBe(404)
      }
    })
  })

  describe("POST /admin/publishable-api-keys/:id/sales-channels/batch", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id-batch")
    let salesChannel1
    let salesChannel2

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
      })

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
      return await db.teardown()
    })

    it("add sales channels to the publishable api key scope", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [
            { id: salesChannel1.id },
            { id: salesChannel2.id },
          ],
        },
        adminHeaders
      )

      const mappings = await dbConnection.manager.query(
        `SELECT *
         FROM publishable_api_key_sales_channel
         WHERE publishable_key_id = '${pubKeyId}'`
      )

      expect(response.status).toBe(200)

      expect(mappings).toEqual([
        {
          sales_channel_id: salesChannel1.id,
          publishable_key_id: pubKeyId,
        },
        {
          sales_channel_id: salesChannel2.id,
          publishable_key_id: pubKeyId,
        },
      ])

      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("DELETE /admin/publishable-api-keys/:id/sales-channels/batch", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id-batch-v2")
    let salesChannel1
    let salesChannel2
    let salesChannel3

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
      })

      salesChannel1 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
      })

      salesChannel2 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name 2",
        description: "test description 2",
      })

      salesChannel3 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name 3",
        description: "test description 3",
      })

      await dbConnection.manager.query(
        `INSERT INTO 
            publishable_api_key_sales_channel 
            (publishable_key_id, sales_channel_id)
         VALUES
             ('${pubKeyId}', '${salesChannel1.id}'),
             ('${pubKeyId}', '${salesChannel2.id}'),
             ('${pubKeyId}', '${salesChannel3.id}');`
      )
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("remove sales channels from the publishable api key scope", async () => {
      const api = useApi()

      const response = await api.delete(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          data: {
            sales_channel_ids: [
              { id: salesChannel1.id },
              { id: salesChannel2.id },
            ],
          },
          ...adminHeaders,
        }
      )

      const mappings = await dbConnection.manager.query(
        `SELECT *
         FROM publishable_api_key_sales_channel
         WHERE publishable_key_id = '${pubKeyId}'`
      )

      expect(response.status).toBe(200)

      expect(mappings).toEqual([
        {
          sales_channel_id: salesChannel3.id,
          publishable_key_id: pubKeyId,
        },
      ])

      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("GET /admin/publishable-api-keys/:id/sales-channels", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id-batch-v2")
    let salesChannel1
    let salesChannel2
    let salesChannel3

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
      })

      salesChannel1 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name",
        description: "test description",
      })

      salesChannel2 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name 2",
        description: "test description 2",
      })

      salesChannel3 = await simpleSalesChannelFactory(dbConnection, {
        name: "test name 3",
        description: "test description 3",
      })

      await dbConnection.manager.query(
        `INSERT INTO
             publishable_api_key_sales_channel
             (publishable_key_id, sales_channel_id)
         VALUES
             ('${pubKeyId}', '${salesChannel1.id}'),
             ('${pubKeyId}', '${salesChannel2.id}');`
      )
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("list sales channels from the publishable api key", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels`,
        adminHeaders
      )

      expect(response.status).toBe(200)
      expect(response.data.sales_channels.length).toEqual(2)
      expect(response.data.sales_channels).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: salesChannel1.id,
            deleted_at: null,
            name: "test name",
            description: "test description",
            is_disabled: false,
          }),
          expect.objectContaining({
            id: salesChannel2.id,
            deleted_at: null,
            name: "test name 2",
            description: "test description 2",
            is_disabled: false,
          }),
        ])
      )
    })

    it("list sales channels from the publishable api key with free text search filter", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels?q=2`,
        adminHeaders
      )

      expect(response.status).toBe(200)
      expect(response.data.sales_channels.length).toEqual(1)
      expect(response.data.sales_channels).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: salesChannel2.id,
            deleted_at: null,
            name: "test name 2",
            description: "test description 2",
            is_disabled: false,
          }),
        ])
      )
    })
  })

  describe("GET /store/products", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")

    let salesChannel1
    let salesChannel2
    let product1
    let product2
    let product3

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      salesChannel1 = await simpleSalesChannelFactory(dbConnection, {
        name: "salesChannel1",
        description: "salesChannel1",
      })

      salesChannel2 = await simpleSalesChannelFactory(dbConnection, {
        name: "salesChannel2",
        description: "salesChannel2",
      })

      product1 = await simpleProductFactory(dbConnection, {
        title: "prod 1",
        status: "published",
        sales_channels: [salesChannel1],
      })

      product2 = await simpleProductFactory(dbConnection, {
        title: "prod 2",
        status: "published",
        sales_channels: [salesChannel2],
      })

      product3 = await simpleProductFactory(dbConnection, {
        title: "prod 3",
        status: "published",
      })

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
        created_by: adminUserId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns products from a specific channel associated with a publishable key", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [{ id: salesChannel1.id }],
        },
        adminHeaders
      )

      const response = await api.get(`/store/products`, {
        headers: {
          Authorization: "Bearer test_token",
          "x-publishable-api-key": pubKeyId,
        },
      })

      expect(response.data.products.length).toBe(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: product1.id,
          }),
        ])
      )
    })

    it("returns products from multiples sales channels associated with a publishable key", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [
            { id: salesChannel1.id },
            { id: salesChannel2.id },
          ],
        },
        adminHeaders
      )

      const response = await api.get(`/store/products`, {
        headers: {
          Authorization: "Bearer test_token",
          "x-publishable-api-key": pubKeyId,
        },
      })

      expect(response.data.products.length).toBe(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: product2.id,
          }),
          expect.objectContaining({
            id: product1.id,
          }),
        ])
      )
    })

    it("SC param overrides PK channels (but SK still needs to be in the PK's scope", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [
            { id: salesChannel1.id },
            { id: salesChannel2.id },
          ],
        },
        adminHeaders
      )

      const response = await api.get(
        `/store/products?sales_channel_id[0]=${salesChannel2.id}`,
        {
          headers: {
            Authorization: "Bearer test_token",
            "x-publishable-api-key": pubKeyId,
          },
        }
      )

      expect(response.data.products.length).toBe(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: product2.id,
          }),
        ])
      )
    })

    it("returns all products if PK is not passed", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [
            { id: salesChannel1.id },
            { id: salesChannel2.id },
          ],
        },
        adminHeaders
      )

      const response = await api.get(`/store/products`, {
        headers: {
          Authorization: "Bearer test_token",
          // "x-publishable-api-key": pubKeyId,
        },
      })

      expect(response.data.products.length).toBe(3)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: product1.id,
          }),
          expect.objectContaining({
            id: product2.id,
          }),
          expect.objectContaining({
            id: product3.id,
          }),
        ])
      )
    })

    it("returns all products if passed PK doesn't have associated channels", async () => {
      const api = useApi()

      const response = await api.get(`/store/products`, {
        headers: {
          Authorization: "Bearer test_token",
          "x-publishable-api-key": pubKeyId,
        },
      })

      expect(response.data.products.length).toBe(3)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: product1.id,
          }),
          expect.objectContaining({
            id: product2.id,
          }),
          expect.objectContaining({
            id: product3.id,
          }),
        ])
      )
    })

    it("throws because sales channel param is not in the scope of passed PK", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [{ id: salesChannel1.id }],
        },
        adminHeaders
      )

      try {
        await api.get(
          `/store/products?sales_channel_id[]=${salesChannel2.id}`,
          {
            headers: {
              Authorization: "Bearer test_token",
              "x-publishable-api-key": pubKeyId,
            },
          }
        )
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.errors[0]).toEqual(
          `Provided sales channel id param: ${salesChannel2.id} is not associated with the Publishable API Key passed in the header of the request.`
        )
      }
    })
  })

  describe("GET /store/products/:id", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")

    let salesChannel1
    let product1
    let product2

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      salesChannel1 = await simpleSalesChannelFactory(dbConnection, {
        name: "salesChannel1",
        description: "salesChannel1",
      })

      product1 = await simpleProductFactory(dbConnection, {
        title: "prod 1",
        status: "published",
        sales_channels: [salesChannel1],
      })

      product2 = await simpleProductFactory(dbConnection, {
        title: "prod 2",
        status: "published",
      })

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
        created_by: adminUserId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("retrieve a products from a specific channel associated with a publishable key", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [{ id: salesChannel1.id }],
        },
        adminHeaders
      )

      const response = await api.get(`/store/products/${product1.id}`, {
        headers: {
          Authorization: "Bearer test_token",
          "x-publishable-api-key": pubKeyId,
        },
      })

      expect(response.data.product).toEqual(
        expect.objectContaining({
          id: product1.id,
        })
      )
    })

    it("return 400 because requested product is not in the SC associated with a publishable key", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [{ id: salesChannel1.id }],
        },
        adminHeaders
      )

      const response = await api
        .get(`/store/products/${product2.id}`, {
          headers: {
            Authorization: "Bearer test_token",
            "x-publishable-api-key": pubKeyId,
          },
        })
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(400)
    })

    it("correctly returns a product if passed PK has no associated SCs", async () => {
      const api = useApi()

      let response = await api
        .get(`/store/products/${product1.id}`, {
          headers: {
            Authorization: "Bearer test_token",
            "x-publishable-api-key": pubKeyId,
          },
        })
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(200)

      response = await api
        .get(`/store/products/${product2.id}`, {
          headers: {
            Authorization: "Bearer test_token",
            "x-publishable-api-key": pubKeyId,
          },
        })
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(200)
    })
  })

  describe("POST /store/carts/:id", () => {
    let product
    const pubKeyId = IdMap.getId("pubkey-get-id")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleRegionFactory(dbConnection, {
        id: "test-region",
      })

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
        created_by: adminUserId,
      })

      product = await simpleProductFactory(dbConnection, {
        sales_channels: [
          {
            id: "sales-channel",
            name: "Sales channel",
            description: "Sales channel",
          },
          {
            id: "sales-channel2",
            name: "Sales channel2",
            description: "Sales channel2",
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("should assign sales channel to order on cart completion if PK is present in the header", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [{ id: "sales-channel" }],
        },
        adminHeaders
      )

      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const createCartRes = await api.post(
        "/store/carts",
        {
          region_id: "test-region",
          items: [
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: "Bearer test_token",
            "x-publishable-api-key": pubKeyId,
          },
        }
      )

      const cart = createCartRes.data.cart

      await api.post(`/store/carts/${cart.id}`, {
        customer_id: customerRes.data.customer.id,
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const createdOrder = await api.post(
        `/store/carts/${cart.id}/complete-cart`
      )

      expect(createdOrder.data.type).toEqual("order")
      expect(createdOrder.status).toEqual(200)
      expect(createdOrder.data.data).toEqual(
        expect.objectContaining({
          sales_channel_id: "sales-channel",
        })
      )
    })

    it("SC from params defines where product is assigned (passed SC still has to be in the scope of PK from the header)", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [
            { id: "sales-channel" },
            { id: "sales-channel2" },
          ],
        },
        adminHeaders
      )

      const customerRes = await api.post("/store/customers", customerData, {
        withCredentials: true,
      })

      const createCartRes = await api.post(
        "/store/carts",
        {
          sales_channel_id: "sales-channel2",
          region_id: "test-region",
          items: [
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: "Bearer test_token",
            "x-publishable-api-key": pubKeyId,
          },
        }
      )

      const cart = createCartRes.data.cart

      await api.post(`/store/carts/${cart.id}`, {
        customer_id: customerRes.data.customer.id,
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const createdOrder = await api.post(
        `/store/carts/${cart.id}/complete-cart`
      )

      expect(createdOrder.data.type).toEqual("order")
      expect(createdOrder.status).toEqual(200)
      expect(createdOrder.data.data).toEqual(
        expect.objectContaining({
          sales_channel_id: "sales-channel2",
        })
      )
    })

    it("should throw because SC id in the body is not in the scope of PK from the header", async () => {
      const api = useApi()

      await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/sales-channels/batch`,
        {
          sales_channel_ids: [{ id: "sales-channel" }],
        },
        adminHeaders
      )

      try {
        await api.post(
          "/store/carts",
          {
            sales_channel_id: "sales-channel2", // SC not in the PK scope
            region_id: "test-region",
            items: [
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
            ],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
              "x-publishable-api-key": pubKeyId,
            },
          }
        )
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.errors[0]).toEqual(
          `Provided sales channel id param: sales-channel2 is not associated with the Publishable API Key passed in the header of the request.`
        )
      }
    })
  })
})
