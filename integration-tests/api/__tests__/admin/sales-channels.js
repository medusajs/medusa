const path = require("path")

const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")

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

  // IMPORTS
  let adminSeeder
  let SalesChannel
  let simpleSalesChannelFactory
  let simpleProductFactory
  let simpleCartFactory
  let simpleOrderFactory

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
      verbose: false,
    })
    dbConnection = connection

    medusaProcess = process

    /**
     * @srindom, @pKorsholm:
     * The approach below is not pretty at all, but it is the best solution we
     * could come up with to the following problem:
     *
     * - When creating "feature flagged" relationships on existing entities
     *   (e.g. order.sales_channel_id) we use the FeatureFlagColumn decorator,
     *   to communicate to TypeORM whether a column should exist or not.
     * - When the decorator runs it checks if the required feature flag is
     *   enabled and if so calls the typical TypeORM @Column decorator.
     * - In a regular setting this happens when we call the modelsLoader on
     *   bootstrap where all entities are imported. The decorator runs as soon
     *   as an entity is imported.
     * - In our testing setting we are not only starting the server, we are
     *   also establishing a connection to the DB that we can use for seeding.
     * - Currently, the DB connection is established when calling initDb in
     *   startServerWithEnvironment. initDb itself runs the modelsLoader and as
     *   such we would **expect** the decorator to evaluate feature flags at
     *   this point in time. This expectation is also why we set feature flags
     *   in initDb.
     * - What we have found out, however, is that IF an entity at any point in
     *   time is imported BEFORE the connection is established the require.cache
     *   will be populated with the entity as it was at the time of the first
     *   import. In most circumstances this will be WITHOUT the feature flag has
     *   been set.
     * - We made attempts to try to clear the cache before calling initDb, but
     *   TypeORM is unfortunately not able to support this flow.
     * - For this reason, we decided to opt for this "hack" instead where we
     *   import the required modules to use in the testing setup AFTER they have
     *   been imported in initDb (and as such has the feature flagged entity in
     *   the require cache).
     *
     * It would be great to find a better approach at some point in time, but
     * this is punted for now.
     *
     * Useful links:
     * - https://github.com/typeorm/typeorm/issues/1318
     */

    const { SalesChannel: sc } = require("@medusajs/medusa")
    const {
      simpleSalesChannelFactory: sscf,
      simpleProductFactory: spf,
      simpleCartFactory: scf,
      simpleOrderFactory: sof,
    } = require("../../factories")
    adminSeeder = require("../../helpers/admin-seeder")

    SalesChannel = sc
    simpleSalesChannelFactory = sscf
    simpleProductFactory = spf
    simpleCartFactory = scf
    simpleOrderFactory = sof
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/sales-channels/:id", () => {
    let salesChannel

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        salesChannel = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
        })
      } catch (e) {
        console.error(e)
      }
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

  describe("POST /admin/sales-channels/:id", () => {
    let sc

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        sc = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
        })
      } catch (err) {
        console.log(err)
      }
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
      try {
        await adminSeeder(dbConnection)
      } catch (e) {
        console.error(e)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
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
      try {
        await adminSeeder(dbConnection)
        salesChannel = await simpleSalesChannelFactory(dbConnection, {
          name: "test name",
          description: "test description",
        })
      } catch (e) {
        console.error(e)
      }
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
  })

  describe("GET /admin/orders/:id", () => {
    let order
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)

        order = await simpleOrderFactory(dbConnection, {
          sales_channel: {
            name: "test name",
            description: "test description",
          },
        })
      } catch (err) {
        console.log(err)
      }
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
      try {
        await adminSeeder(dbConnection)

        await simpleOrderFactory(dbConnection, {
          sales_channel: {
            name: "test name",
            description: "test description",
          },
        })
      } catch (err) {
        console.log(err)
      }
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
      try {
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
      } catch (err) {
        console.log(err)
      }
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
      try {
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
      } catch (err) {
        console.log(err)
      }
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

  describe("GET /store/cart/:id with saleschannel", () => {
    let cart
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)

        cart = await simpleCartFactory(dbConnection, {
          sales_channel: {
            name: "test name",
            description: "test description",
          },
        })
      } catch (err) {
        console.log(err)
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns cart with sales channel for single cart", async () => {
      const api = useApi()

      const response = await api.get(`/store/carts/${cart.id}`, adminReqConfig)

      expect(response.data.cart.sales_channel).toBeTruthy()
      expect(response.data.cart.sales_channel).toMatchSnapshot({
        id: expect.any(String),
        name: "test name",
        description: "test description",
        is_disabled: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })
})
