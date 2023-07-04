const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

const {
  simplePaymentCollectionFactory,
} = require("../../factories/simple-payment-collection-factory")

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/payment-collections", () => {
  let medusaProcess
  let dbConnection

  let payCol = null
  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/payment-collections/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      payCol = await simplePaymentCollectionFactory(dbConnection, {
        description: "paycol description",
        amount: 10000,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("gets payment collection", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/payment-collections/${payCol.id}`,
        adminHeaders
      )

      expect(response.data.payment_collection).toEqual(
        expect.objectContaining({
          id: payCol.id,
          type: "order_edit",
          status: "not_paid",
          description: "paycol description",
          amount: 10000,
        })
      )

      expect(response.status).toEqual(200)
    })
  })

  describe("POST /admin/payment-collections/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      payCol = await simplePaymentCollectionFactory(dbConnection, {
        description: "paycol description",
        amount: 10000,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("updates a payment collection", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/payment-collections/${payCol.id}`,
        {
          description: "new description",
          metadata: {
            a: 1,
            b: [1, 2, "3"],
          },
        },
        adminHeaders
      )

      expect(response.data.payment_collection).toEqual(
        expect.objectContaining({
          id: payCol.id,
          type: "order_edit",
          amount: 10000,
          description: "new description",
          metadata: {
            a: 1,
            b: [1, 2, "3"],
          },
          authorized_amount: null,
        })
      )

      expect(response.status).toEqual(200)
    })
  })

  describe("POST /admin/payment-collections/:id/authorize", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      payCol = await simplePaymentCollectionFactory(dbConnection, {
        description: "paycol description",
        amount: 10000,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("marks a payment collection as authorized", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/payment-collections/${payCol.id}/authorize`,
        undefined,
        adminHeaders
      )

      expect(response.data.payment_collection).toEqual(
        expect.objectContaining({
          id: payCol.id,
          type: "order_edit",
          status: "authorized",
          description: "paycol description",
          amount: 10000,
          authorized_amount: 10000,
        })
      )

      expect(response.status).toEqual(200)
    })
  })

  describe("DELETE /admin/payment-collections/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      payCol = await simplePaymentCollectionFactory(dbConnection, {
        description: "paycol description",
        amount: 10000,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("delete a payment collection", async () => {
      const api = useApi()

      const response = await api.delete(
        `/admin/payment-collections/${payCol.id}`,
        adminHeaders
      )

      expect(response.data).toEqual({
        id: `${payCol.id}`,
        deleted: true,
        object: "payment_collection",
      })

      expect(response.status).toEqual(200)
    })

    it("throws error when deleting an authorized payment collection", async () => {
      const api = useApi()

      await api.post(
        `/admin/payment-collections/${payCol.id}/authorize`,
        undefined,
        adminHeaders
      )

      try {
        await api.delete(
          `/admin/payment-collections/${payCol.id}`,
          adminHeaders
        )

        expect(1).toBe(2) // should be ignored
      } catch (res) {
        expect(res.response.data.message).toBe(
          "Cannot delete payment collection with status authorized"
        )
      }
    })
  })
})
