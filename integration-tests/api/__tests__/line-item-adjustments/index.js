const path = require("path")
const { LineItemAdjustment } = require("@medusajs/medusa")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const cartSeeder = require("../../helpers/cart-seeder")
const { simpleCartFactory, simpleLineItemFactory } = require("../../factories")
const {
  simpleDiscountFactory,
} = require("../../factories/simple-discount-factory")

jest.setTimeout(30000)

describe("line item adjustments", () => {
  let dbConnection
  let medusaProcess

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    try {
      dbConnection = await initDb({ cwd })
      medusaProcess = await setupServer({ cwd })
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("tests db constraints", () => {
    let cart,
      discount,
      lineItemId = "line-test"
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
        discount = await simpleDiscountFactory(dbConnection, {
          code: "MEDUSATEST",
          id: "discount-test",
          rule: {
            value: 100,
            type: "fixed",
            allocation: "total",
          },
          regions: ["test-region"],
        })
        cart = await simpleCartFactory(
          dbConnection,
          {
            customer: "test-customer",
            id: "cart-test",
            line_items: [
              {
                id: lineItemId,
                variant_id: "test-variant",
                cart_id: "cart-test",
                unit_price: 1000,
                quantity: 1,
                adjustments: [
                  {
                    amount: 10,
                    discount_id: discount.id,
                    description: "discount",
                    item_id: lineItemId,
                  },
                ],
              },
            ],
            region: "test-region",
            shipping_address: {
              address_1: "test",
              country_code: "us",
              first_name: "chris",
              last_name: "rock",
              postal_code: "101",
            },
            shipping_methods: [
              {
                shipping_option: "test-option",
              },
            ],
          },
          100
        )
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("successfully creates a line item adjustment with a different item_id", async () => {
      const createLineItemWithAdjustment = async () => {
        return await simpleLineItemFactory(dbConnection, {
          id: "line-test-2",
          variant_id: "test-variant-quantity",
          cart_id: "test-cart",
          unit_price: 1000,
          quantity: 1,
          adjustments: [
            {
              amount: 10,
              discount_id: discount.id,
              description: "discount",
              item_id: "line-test-2",
            },
          ],
        })
      }

      expect(createLineItemWithAdjustment()).resolves.toEqual(expect.anything())
    })

    it("successfully creates a line item adjustment with a null discount_id", async () => {
      const createAdjustmentNullDiscount = async () => {
        return await dbConnection.manager.insert(LineItemAdjustment, {
          id: "lia-1",
          item_id: lineItemId,
          amount: 35,
          description: "custom discount",
          discount_id: null,
        })
      }

      expect(createAdjustmentNullDiscount()).resolves.toEqual(expect.anything())
    })

    it("successfully creates multiple line item adjustments with a null discount_id", async () => {
      const createAdjustmentsNullDiscount = async () => {
        await dbConnection.manager.insert(LineItemAdjustment, {
          id: "lia-1",
          item_id: lineItemId,
          amount: 35,
          description: "custom discount",
          discount_id: null,
        })
        return await dbConnection.manager.insert(LineItemAdjustment, {
          id: "lia-2",
          item_id: lineItemId,
          amount: 100,
          description: "custom discount",
          discount_id: null,
        })
      }
      expect(createAdjustmentsNullDiscount()).resolves.toEqual(
        expect.anything()
      )
    })

    it("successfully creates a line item adjustment with same item_id and different discount", async () => {
      const createAdjustment = async () => {
        await simpleDiscountFactory(dbConnection, {
          code: "ANOTHER",
          id: "discount-2",
          rule: {
            value: 10,
            type: "percentage",
            allocation: "item",
          },
          regions: ["test-region"],
        })

        return await dbConnection.manager.insert(LineItemAdjustment, {
          id: "lia-1",
          item_id: lineItemId,
          amount: 10,
          description: "discount",
          discount_id: "discount-2",
        })
      }

      expect(createAdjustment()).resolves.toEqual(expect.anything())
    })

    it("fails to create a line item adjustment with existing discount_id and item_id pair", async () => {
      const createDuplicateAdjustment = async () =>
        await dbConnection.manager.insert(LineItemAdjustment, {
          id: "lia-1",
          item_id: lineItemId,
          amount: 20,
          description: "discount",
          discount_id: discount.id,
        })

      expect(createDuplicateAdjustment()).rejects.toEqual(
        expect.objectContaining({ code: "23505" })
      )
    })
  })
})
