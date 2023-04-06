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

describe("Line Item Adjustments", () => {
  let dbConnection
  let medusaProcess

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

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

  describe("Tests database constraints", () => {
    let cart
    let discount
    const lineItemId = "line-test"
    beforeEach(async () => {
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
    })

    afterEach(async () => {
      await doAfterEach()
    })

    describe("Given an existing line item, a discount, and a line item adjustment for both", () => {
      describe("When creating an adjustment for another line item w. same discount", () => {
        test("Then should create an adjustment", async () => {
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

          await expect(createLineItemWithAdjustment()).resolves.toEqual(
            expect.anything()
          )
        })
      })

      describe("When creating an adjustment for another line item w. null discount", () => {
        test("Then should create an adjustment", async () => {
          const createAdjustmentNullDiscount = async () => {
            return await dbConnection.manager.insert(LineItemAdjustment, {
              id: "lia-1",
              item_id: lineItemId,
              amount: 35,
              description: "custom discount",
              discount_id: null,
            })
          }

          await expect(createAdjustmentNullDiscount()).resolves.toEqual(
            expect.anything()
          )
        })
      })

      describe("When creating multiple adjustments w. a null discount_id", () => {
        test("Then should create multiple adjustments", async () => {
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

          await expect(createAdjustmentsNullDiscount()).resolves.toEqual(
            expect.anything()
          )
        })
      })

      describe("When creating an adjustment w. for same line item and different discount", () => {
        test("Then should create an adjustment", async () => {
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

          await expect(createAdjustment()).resolves.toEqual(expect.anything())
        })
      })

      describe("When creating an adjustment w. existing line item and discount pair", () => {
        test("Then should throw a duplicate error", async () => {
          const createDuplicateAdjustment = async () =>
            await dbConnection.manager.insert(LineItemAdjustment, {
              id: "lia-1",
              item_id: lineItemId,
              amount: 20,
              description: "discount",
              discount_id: discount.id,
            })

          await expect(createDuplicateAdjustment()).rejects.toEqual(
            expect.objectContaining({ code: "23505" })
          )
        })
      })
    })
  })

  describe("When refreshing adjustments make sure that only adjustments associated with a Medusa Discount are deleted", () => {
    let cart
    let discount
    const lineItemId = "line-test"

    beforeEach(async () => {
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
                {
                  // this one shouldn't be deleted because it's
                  // not associated with a Medusa Discount, i.e.
                  // it's created by a third party system, for example,
                  // a custom promotions engine
                  amount: 20,
                  description: "custom adjustment without discount",
                  item_id: lineItemId,
                },
              ],
            },
          ],
          region: "test-region",
        },
        100
      )
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("Delete only adjustments of the removed discount and keep 'custom' adjustments", async () => {
      const api = useApi()

      const response = await api.delete(
        `/store/carts/${cart.id}/discounts/${discount.code}`
      )

      expect(response.status).toEqual(200)
      expect(response.data.cart.items[0].adjustments.length).toEqual(1)
      expect(response.data.cart.items[0].adjustments[0]).toMatchObject({
        amount: 20,
        description: "custom adjustment without discount",
        item_id: lineItemId,
      })
    })
  })
})
