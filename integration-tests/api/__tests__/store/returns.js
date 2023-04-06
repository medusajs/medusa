const path = require("path")
const {
  Region,
  ReturnReason,
  Order,
  Customer,
  ShippingProfile,
  Product,
  ProductVariant,
  ShippingOption,
  FulfillmentProvider,
  LineItem,
  Discount,
  DiscountRule,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

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

  describe("POST /store/returns", () => {
    let rrId
    let rrId_child
    let rrResult

    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.query(
        `ALTER SEQUENCE order_display_id_seq RESTART WITH 111`
      )

      const defaultProfile = await manager.findOne(ShippingProfile, {
        where: {
          type: ShippingProfile.default,
        },
      })

      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })

      await manager.insert(Customer, {
        id: "cus_1234",
        email: "test@email.com",
      })

      await manager.insert(Order, {
        id: "order_test",
        email: "test@email.com",
        display_id: 111,
        customer_id: "cus_1234",
        region_id: "region",
        tax_rate: 0,
        currency_code: "usd",
      })

      await manager.insert(DiscountRule, {
        id: "discount_rule_id",
        description: "test description",
        value: 10,
        allocation: "total",
        type: "percentage",
      })

      const d = manager.create(Discount, {
        id: "test-discount",
        code: "TEST",
        is_dynamic: false,
        is_disabled: false,
        rule_id: "discount_rule_id",
      })

      await manager.save(d)

      const ord = manager.create(Order, {
        id: "order_with_discount",
        email: "test@email.com",
        display_id: 112,
        customer_id: "cus_1234",
        region_id: "region",
        tax_rate: 0,
        currency_code: "usd",
      })

      ord.discounts = [d]

      await manager.save(ord)

      await manager.insert(Product, {
        id: "test-product",
        title: "test product",
        profile_id: defaultProfile.id,
        options: [{ id: "test-option", title: "Size" }],
      })

      await manager.insert(ProductVariant, {
        id: "test-variant",
        title: "test variant",
        product_id: "test-product",
        inventory_quantity: 1,
        options: [
          {
            option_id: "test-option",
            value: "Size",
          },
        ],
      })

      await manager.insert(LineItem, {
        id: "test-item",
        order_id: "order_test",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
      })

      await manager.insert(ShippingOption, {
        id: "test-option",
        name: "Test ret",
        profile_id: defaultProfile.id,
        region_id: "region",
        provider_id: "test-ful",
        data: {},
        price_type: "flat_rate",
        amount: 1000,
        is_return: true,
      })

      const created = dbConnection.manager.create(ReturnReason, {
        value: "wrong_size",
        label: "Wrong Size",
      })
      const result = await dbConnection.manager.save(created)

      rrResult = result
      rrId = result.id

      const created_1 = dbConnection.manager.create(ReturnReason, {
        value: "too_big",
        label: "Too Big",
        parent_return_reason_id: rrId,
      })

      const result_1 = await dbConnection.manager.save(created_1)

      rrId_child = result_1.id
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a return", async () => {
      const api = useApi()

      const response = await api
        .post("/store/returns", {
          order_id: "order_test",
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(200)

      expect(response.data.return.refund_amount).toEqual(8000)
    })

    it("failes to create a return with a reason category", async () => {
      const api = useApi()

      const response = await api
        .post("/store/returns", {
          order_id: "order_test",
          items: [
            {
              reason_id: rrId,
              note: "TOO small",
              item_id: "test-item",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(400)
      expect(response.data.message).toEqual(
        "Cannot apply return reason category"
      )
    })

    it("creates a return with reasons", async () => {
      const api = useApi()

      const response = await api
        .post("/store/returns", {
          order_id: "order_test",
          items: [
            {
              reason_id: rrId_child,
              note: "TOO small",
              item_id: "test-item",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          console.log(err.response)
          return err.response
        })
      expect(response.status).toEqual(200)

      expect(response.data.return.items).toHaveLength(1)
      expect(response.data.return.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            reason_id: rrId_child,
            note: "TOO small",
          }),
        ])
      )
    })

    it("failes to create a return with an invalid quantity (less than 1)", async () => {
      const api = useApi()

      const response = await api
        .post("/store/returns", {
          order_id: "order_test",
          items: [
            {
              reason_id: rrId,
              note: "TOO small",
              item_id: "test-item",
              quantity: 0,
            },
          ],
        })
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(400)
      expect(response.data.type).toEqual("invalid_data")
    })

    it("creates a return with discount and non-discountable item", async () => {
      const api = useApi()

      await dbConnection.manager.query(
        `UPDATE line_item set allow_discounts=false where id='test-item'`
      )

      await dbConnection.manager.query(
        `UPDATE line_item set order_id='order_with_discount' where id='test-item'`
      )

      const response = await api
        .post("/store/returns", {
          order_id: "order_with_discount",
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(200)
      expect(response.data.return.refund_amount).toEqual(8000)
    })

    it("creates a return with shipping method", async () => {
      const api = useApi()

      const response = await api
        .post("/store/returns", {
          order_id: "order_test",
          return_shipping: {
            option_id: "test-option",
          },
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(200)

      expect(response.data.return.refund_amount).toEqual(7000)
    })
  })
})
