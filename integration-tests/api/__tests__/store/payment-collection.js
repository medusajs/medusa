const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

const {
  simplePaymentCollectionFactory,
} = require("../../factories/simple-payment-collection-factory")
const {
  simpleCustomerFactory,
} = require("../../factories/simple-customer-factory")

jest.setTimeout(30000)

describe("[MEDUSA_FF_ORDER_EDITING] /store/payment-collections", () => {
  let medusaProcess
  let dbConnection

  let payCol = null
  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_ORDER_EDITING: true },
      verbose: false,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /store/payment-collections/:id", () => {
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

      const response = await api.get(`/store/payment-collections/${payCol.id}`)

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

  describe("Manage Payment Sessions", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      payCol = await simplePaymentCollectionFactory(dbConnection, {
        description: "paycol description",
        amount: 10000,
      })

      await simpleCustomerFactory(dbConnection, {
        id: "customer",
        email: "test@customer.com",
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("Set a payment session", async () => {
      const api = useApi()

      const response = await api.post(
        `/store/payment-collections/${payCol.id}/sessions`,
        {
          sessions: {
            provider_id: "test-pay",
            customer_id: "customer",
            amount: 10000,
          },
        }
      )

      expect(response.data.payment_collection).toEqual(
        expect.objectContaining({
          id: payCol.id,
          type: "order_edit",
          amount: 10000,
          payment_sessions: expect.arrayContaining([
            expect.objectContaining({
              amount: 10000,
              status: "pending",
            }),
          ]),
        })
      )

      expect(response.status).toEqual(200)
    })

    it("Set multiple payment sessions", async () => {
      const api = useApi()

      const response = await api.post(
        `/store/payment-collections/${payCol.id}/sessions`,
        {
          sessions: [
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 2000,
            },
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 5000,
            },
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 3000,
            },
          ],
        }
      )

      expect(response.data.payment_collection.payment_sessions).toHaveLength(3)
      expect(response.data.payment_collection).toEqual(
        expect.objectContaining({
          id: payCol.id,
          type: "order_edit",
          amount: 10000,
          payment_sessions: expect.arrayContaining([
            expect.objectContaining({
              amount: 2000,
              status: "pending",
            }),
            expect.objectContaining({
              amount: 5000,
              status: "pending",
            }),
            expect.objectContaining({
              amount: 3000,
              status: "pending",
            }),
          ]),
        })
      )

      expect(response.status).toEqual(200)
    })

    it("update multiple payment sessions", async () => {
      const api = useApi()

      let response = await api.post(
        `/store/payment-collections/${payCol.id}/sessions`,
        {
          sessions: [
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 2000,
            },
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 5000,
            },
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 3000,
            },
          ],
        }
      )

      expect(response.data.payment_collection.payment_sessions).toHaveLength(3)

      const multipleSessions = response.data.payment_collection.payment_sessions

      response = await api.post(
        `/store/payment-collections/${payCol.id}/sessions`,
        {
          sessions: [
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 5000,
              session_id: multipleSessions[0].id,
            },
            {
              provider_id: "test-pay",
              customer_id: "customer",
              amount: 5000,
              session_id: multipleSessions[1].id,
            },
          ],
        }
      )

      expect(response.data.payment_collection.payment_sessions).toHaveLength(2)
      expect(response.data.payment_collection).toEqual(
        expect.objectContaining({
          id: payCol.id,
          type: "order_edit",
          amount: 10000,
          payment_sessions: expect.arrayContaining([
            expect.objectContaining({
              amount: 5000,
              status: "pending",
              id: multipleSessions[0].id,
            }),
            expect.objectContaining({
              amount: 5000,
              status: "pending",
              id: multipleSessions[1].id,
            }),
          ]),
        })
      )

      expect(response.status).toEqual(200)
    })
  })

  describe("Authorize a Payment Sessions", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      payCol = await simplePaymentCollectionFactory(dbConnection, {
        description: "paycol description",
        amount: 10000,
      })

      await simpleCustomerFactory(dbConnection, {
        id: "customer",
        email: "test@customer.com",
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("Authorize a payment session", async () => {
      const api = useApi()

      await api.post(`/store/payment-collections/${payCol.id}/sessions`, {
        sessions: {
          provider_id: "test-pay",
          customer_id: "customer",
          amount: 10000,
        },
      })

      const response = await api.post(
        `/store/payment-collections/${payCol.id}/authorize`
      )

      expect(response.data.payment_collection).toEqual(
        expect.objectContaining({
          id: payCol.id,
          type: "order_edit",
          amount: 10000,
          payment_sessions: expect.arrayContaining([
            expect.objectContaining({
              amount: 10000,
              status: "authorized",
            }),
          ]),
        })
      )

      expect(response.status).toEqual(200)
    })
  })
})
