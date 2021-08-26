const path = require("path")
const {
  Region,
  Order,
  Customer,
  ShippingProfile,
  Product,
  ProductVariant,
  MoneyAmount,
  LineItem,
  Payment,
  Cart,
  ShippingMethod,
  Swap,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const orderSeeder = require("../../helpers/order-seeder")

jest.setTimeout(30000)

describe("/store/carts", () => {
  let medusaProcess
  let dbConnection

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

  describe("/store/swaps", () => {
    beforeEach(async () => {
      try {
        await orderSeeder(dbConnection)

        const manager = dbConnection.manager
        await manager.query(
          `UPDATE "swap" SET cart_id='test-cart-2' WHERE id = 'test-swap'`
        )
        await manager.query(
          `UPDATE "payment" SET swap_id=NULL WHERE id = 'test-payment-swap'`
        )
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a swap from a cart id", async () => {
      const api = useApi()

      const response = await api
        .post("/store/swaps", {
          order_id: "test-order",
          return_items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant-2",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(response.data).toMatchSnapshot({
        swap: {
          id: expect.stringMatching(/^swap_*/),
          idempotency_key: expect.any(String),
          additional_items: [
            {
              id: expect.stringMatching(/^item_*/),
              cart_id: expect.stringMatching(/^cart_*/),
              swap_id: expect.stringMatching(/^swap_*/),
              variant: {
                id: "test-variant-2",
                created_at: expect.any(String),
                updated_at: expect.any(String),
                product: {
                  profile_id: expect.stringMatching(/^sp_*/),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              },
              quantity: 1,
              variant_id: "test-variant-2",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          order: {
            id: "test-order",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          cart_id: expect.stringMatching(/^cart_*/),
          cart: {
            id: expect.stringMatching(/^cart_*/),
            billing_address_id: "test-billing-address",
            type: "swap",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            metadata: {
              swap_id: expect.stringMatching(/^swap_*/),
            },
          },
          return_order: {
            id: expect.stringMatching(/^ret_*/),
            swap_id: expect.stringMatching(/^swap_*/),
            refund_amount: 7200,
            items: [
              {
                item_id: "test-item",
                quantity: 1,
                return_id: expect.stringMatching(/^ret_*/),
              },
            ],
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })
  })
})
