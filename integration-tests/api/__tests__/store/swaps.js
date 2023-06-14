const path = require("path")
const {
  ShippingProfile,
  ShippingOption,
  ShippingProfileType,
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
      await orderSeeder(dbConnection)

      const manager = dbConnection.manager
      await manager.query(
        `UPDATE "swap" SET cart_id='test-cart-2' WHERE id = 'test-swap'`
      )
      await manager.query(
        `UPDATE "payment" SET swap_id=NULL WHERE id = 'test-payment-swap'`
      )

      const defaultProfile = await manager.findOne(ShippingProfile, {
        where: {
          type: ShippingProfileType.DEFAULT,
        },
      })
      await manager.insert(ShippingOption, {
        id: "return-option",
        name: "Test ret",
        profile_id: defaultProfile.id,
        region_id: "test-region",
        provider_id: "test-ful",
        data: {},
        price_type: "flat_rate",
        amount: 1000,
        is_return: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("simple swap", async () => {
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

      expect(response.data).toEqual(
        expect.objectContaining({
          swap: expect.objectContaining({
            id: expect.stringMatching(/^swap_*/),
            additional_items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.stringMatching(/^item_*/),
                cart_id: expect.stringMatching(/^cart_*/),
                swap_id: expect.stringMatching(/^swap_*/),
                variant: expect.objectContaining({
                  id: "test-variant-2",
                }),
                quantity: 1,
                variant_id: "test-variant-2",
              }),
            ]),
            order: expect.objectContaining({
              id: "test-order",
            }),
            cart_id: expect.stringMatching(/^cart_*/),
            cart: expect.objectContaining({
              id: expect.stringMatching(/^cart_*/),
              billing_address_id: "test-billing-address",
              type: "swap",
              shipping_address_id: "test-shipping-address",
              metadata: expect.objectContaining({
                swap_id: expect.stringMatching(/^swap_*/),
              }),
            }),
            return_order: expect.objectContaining({
              id: expect.stringMatching(/^ret_*/),
              swap_id: expect.stringMatching(/^swap_*/),
              refund_amount: 7200,
              items: expect.arrayContaining([
                expect.objectContaining({
                  item_id: "test-item",
                  quantity: 1,
                  return_id: expect.stringMatching(/^ret_*/),
                }),
              ]),
            }),
          }),
        })
      )
    })

    it("swap with return shipping", async () => {
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
          return_shipping_option: "return-option",
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

      expect(response.data).toEqual({
        swap: expect.objectContaining({
          id: expect.stringMatching(/^swap_*/),
          additional_items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.stringMatching(/^item_*/),
              cart_id: expect.stringMatching(/^cart_*/),
              swap_id: expect.stringMatching(/^swap_*/),
              variant: expect.objectContaining({
                id: "test-variant-2",
              }),
              quantity: 1,
              variant_id: "test-variant-2",
            }),
          ]),
          order: expect.objectContaining({
            id: "test-order",
          }),
          cart_id: expect.stringMatching(/^cart_*/),
          cart: expect.objectContaining({
            id: expect.stringMatching(/^cart_*/),
            billing_address_id: "test-billing-address",
            shipping_address_id: "test-shipping-address",
            type: "swap",
            metadata: expect.objectContaining({
              swap_id: expect.stringMatching(/^swap_*/),
            }),
          }),
          return_order: expect.objectContaining({
            id: expect.stringMatching(/^ret_*/),
            swap_id: expect.stringMatching(/^swap_*/),
            refund_amount: 6200,
            shipping_method: expect.objectContaining({
              id: expect.stringMatching(/^sm_*/),
              return_id: expect.stringMatching(/^ret_*/),
              shipping_option: expect.objectContaining({
                profile_id: expect.stringMatching(/^sp_*/),
              }),
            }),
            items: expect.arrayContaining([
              expect.objectContaining({
                item_id: "test-item",
                quantity: 1,
                return_id: expect.stringMatching(/^ret_*/),
              }),
            ]),
          }),
        }),
      })
    })
  })
})
