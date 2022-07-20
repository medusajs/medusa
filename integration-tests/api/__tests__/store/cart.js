const path = require("path")
const {
  Region,
  LineItem,
  GiftCard,
  Cart,
  CustomShippingOption,
  PriceList,
  MoneyAmount,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const cartSeeder = require("../../helpers/cart-seeder")
const productSeeder = require("../../helpers/product-seeder")
const swapSeeder = require("../../helpers/swap-seeder")
const {
  simpleCartFactory,
  simpleRegionFactory,
  simpleProductFactory,
  simpleShippingOptionFactory,
  simpleLineItemFactory,
} = require("../../factories")
const {
  simpleDiscountFactory,
} = require("../../factories/simple-discount-factory")
const {
  simpleCustomerFactory,
} = require("../../factories/simple-customer-factory")
const {
  simpleCustomerGroupFactory,
} = require("../../factories/simple-customer-group-factory")

jest.setTimeout(30000)

describe("/store/carts", () => {
  let medusaProcess
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    try {
      dbConnection = await initDb({ cwd })
      medusaProcess = await setupServer({ cwd, verbose: false })
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("POST /store/carts", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
      await manager.query(
        `UPDATE "country" SET region_id='region' WHERE iso_2 = 'us'`
      )
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("creates a cart", async () => {
      const api = useApi()

      const response = await api.post("/store/carts")
      expect(response.status).toEqual(200)

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it("fails to create a cart when no region exist", async () => {
      const api = useApi()

      await dbConnection.manager.query(
        `UPDATE "country" SET region_id=null WHERE iso_2 = 'us'`
      )
      await dbConnection.manager.query(`DELETE from region`)

      try {
        await api.post("/store/carts")
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "A region is required to create a cart"
        )
      }
    })

    it("creates a cart with items", async () => {
      await productSeeder(dbConnection)

      const yesterday = ((today) =>
        new Date(today.setDate(today.getDate() - 1)))(new Date())
      const tomorrow = ((today) =>
        new Date(today.setDate(today.getDate() + 1)))(new Date())

      const priceList1 = await dbConnection.manager.create(PriceList, {
        id: "pl_current",
        name: "Past winter sale",
        description: "Winter sale for key accounts.",
        type: "sale",
        status: "active",
        starts_at: yesterday,
        ends_at: tomorrow,
      })

      await dbConnection.manager.save(priceList1)

      const ma_sale_1 = dbConnection.manager.create(MoneyAmount, {
        variant_id: "test-variant-sale",
        currency_code: "usd",
        amount: 800,
        price_list_id: "pl_current",
      })

      await dbConnection.manager.save(ma_sale_1)

      const api = useApi()

      const response = await api
        .post("/store/carts", {
          items: [
            {
              variant_id: "test-variant_1",
              quantity: 1,
            },
            {
              variant_id: "test-variant-sale",
              quantity: 2,
            },
          ],
        })
        .catch((err) => console.log(err))

      response.data.cart.items.sort((a, b) => a.quantity - b.quantity)

      expect(response.status).toEqual(200)
      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          variant_id: "test-variant_1",
          quantity: 1,
        }),
        expect.objectContaining({
          variant_id: "test-variant-sale",
          quantity: 2,
          unit_price: 800,
        }),
      ])

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it("creates a cart with country", async () => {
      const api = useApi()

      const response = await api.post("/store/carts", {
        country_code: "us",
      })
      expect(response.status).toEqual(200)
      expect(response.data.cart.shipping_address.country_code).toEqual("us")

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it("creates a cart with context", async () => {
      const api = useApi()
      const response = await api.post("/store/carts", {
        context: {
          test_id: "test",
        },
      })
      expect(response.status).toEqual(200)

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)

      const cart = getRes.data.cart
      expect(cart.context).toEqual({
        ip: "::ffff:127.0.0.1",
        user_agent: expect.stringContaining("axios/0.21."),
        test_id: "test",
      })
    })
  })

  describe("POST /store/carts/:id/line-items", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("adds line item to cart", async () => {
      const api = useApi()

      // Add standard line item to cart
      const response = await api
        .post(
          "/store/carts/test-cart/line-items",
          {
            variant_id: "test-variant-quantity",
            quantity: 1,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 1,
          adjustments: [],
        }),
      ])
    })

    it("adds line item to cart containing a total fixed discount", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-w-total-fixed-discount/line-items",
          {
            variant_id: "test-variant-quantity",
            quantity: 2,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-total-fixed-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 2,
          adjustments: [
            expect.objectContaining({
              amount: 100,
              discount_id: "total-fixed-100",
              description: "discount",
            }),
          ],
        }),
      ])
    })

    it("adds line item to cart containing a total percentage discount", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-w-total-percentage-discount/line-items",
          {
            variant_id: "test-variant-quantity",
            quantity: 2,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-total-percentage-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 2,
          adjustments: [
            expect.objectContaining({
              amount: 200,
              discount_id: "10Percent",
              description: "discount",
            }),
          ],
        }),
      ])
    })

    it("adds line item to cart containing an item fixed discount", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-w-item-fixed-discount/line-items",
          {
            variant_id: "test-variant-quantity",
            quantity: 2,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-item-fixed-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 2,
          adjustments: [
            expect.objectContaining({
              amount: 400,
              discount_id: "item-fixed-200",
              description: "discount",
            }),
          ],
        }),
      ])
    })

    it("adds line item to cart containing an item percentage discount", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-w-item-percentage-discount/line-items",
          {
            variant_id: "test-variant-quantity",
            quantity: 2,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-item-percentage-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 2,
          adjustments: [
            expect.objectContaining({
              amount: 300,
              discount_id: "item-percentage-15",
              description: "discount",
            }),
          ],
        }),
      ])
    })

    it("adds line item to cart time limited sale", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart/line-items",
          {
            variant_id: "test-variant-sale",
            quantity: 1,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart",
          unit_price: 800,
          variant_id: "test-variant-sale",
          quantity: 1,
        }),
      ])
    })

    it("adds line item to cart time customer pricing", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      // Add standard line item to cart
      const response = await api
        .post(
          "/store/carts/test-cart/line-items",
          {
            variant_id: "test-variant-sale-customer",
            quantity: 1,
          },
          {
            // withCredentials: true,
            headers: {
              Cookie: authCookie,
            },
          }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart",
          unit_price: 700,
          variant_id: "test-variant-sale-customer",
          quantity: 1,
        }),
      ])
    })

    it("adds line item with quantity to cart with quantity discount", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart/line-items",
          {
            variant_id: "test-variant-quantity",
            quantity: 90,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart",
          unit_price: 800,
          variant_id: "test-variant-quantity",
          quantity: 90,
        }),
      ])
    })

    it("adds line item with quantity to cart with quantity discount no ceiling", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart/line-items",
          {
            variant_id: "test-variant-quantity",
            quantity: 900,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart",
          unit_price: 700,
          variant_id: "test-variant-quantity",
          quantity: 900,
        }),
      ])
    })

    describe("ensures correct line item adjustment generation", () => {
      const discountData = {
        code: "MEDUSA185DKK",
        id: "medusa-185",
        rule: {
          allocation: "total",
          type: "fixed",
          value: 185,
        },
        regions: ["test-region"],
      }

      let discountCart
      let discount
      beforeEach(async () => {
        try {
          discount = await simpleDiscountFactory(
            dbConnection,
            discountData,
            100
          )
          discountCart = await simpleCartFactory(
            dbConnection,
            {
              id: "discount-cart",
              customer: "test-customer",
              region: "test-region",
              shipping_address: {
                address_1: "next door",
                first_name: "lebron",
                last_name: "james",
                country_code: "dk",
                postal_code: "100",
              },
              line_items: [
                {
                  id: "test-li",
                  variant_id: "test-variant",
                  quantity: 1,
                  unit_price: 100,
                  adjustments: [
                    {
                      amount: 185,
                      description: "discount",
                      discount_id: "medusa-185",
                    },
                  ],
                },
              ],
              shipping_methods: [
                {
                  shipping_option: "test-option",
                  price: 1000,
                },
              ],
            },
            100
          )
          await dbConnection.manager
            .createQueryBuilder()
            .relation(Cart, "discounts")
            .of(discountCart)
            .add(discount)
        } catch (err) {
          console.log(err)
        }
      })

      afterEach(async () => {
        await doAfterEach()
      })

      it("updates an old line item adjustment when a new line item is added to a discount cart", async () => {
        const api = useApi()

        const response = await api
          .post(
            "/store/carts/discount-cart/line-items",
            {
              quantity: 1,
              variant_id: "test-variant-quantity",
            },
            {
              withCredentials: true,
            }
          )
          .catch((err) => console.log(err))

        expect(response.data.cart.items.length).toEqual(2)
        expect(response.data.cart.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  item_id: "test-li",
                  amount: 17,
                  discount_id: "medusa-185",
                }),
              ],
            }),
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  amount: 168,
                  discount_id: "medusa-185",
                }),
              ],
            }),
          ])
        )
      })

      it("updates an existing item adjustment when a line item is updated", async () => {
        const api = useApi()

        await simpleLineItemFactory(
          dbConnection,
          {
            id: "line-item-2",
            cart_id: discountCart.id,
            variant_id: "test-variant-quantity",
            unit_price: 950,
            quantity: 1,
            adjustments: [
              {
                id: "lia-2",
                amount: 92,
                description: "discount",
                discount_id: "medusa-185",
              },
            ],
          },
          100
        )

        const response = await api
          .post(
            "/store/carts/discount-cart/line-items/line-item-2",
            {
              quantity: 2,
            },
            {
              withCredentials: true,
            }
          )
          .catch((err) => console.log(err))

        expect(response.data.cart.items.length).toEqual(2)
        expect(response.data.cart.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  item_id: "test-li",
                  discount_id: "medusa-185",
                  amount: 9,
                }),
              ],
            }),
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  item_id: "line-item-2",
                  amount: 176,
                  discount_id: "medusa-185",
                }),
              ],
            }),
          ])
        )
      })

      it("updates an existing item adjustment when a line item is deleted from a discount cart", async () => {
        const api = useApi()

        await simpleLineItemFactory(
          dbConnection,
          {
            id: "line-item-2",
            cart_id: discountCart.id,
            variant_id: "test-variant-quantity",
            unit_price: 1000,
            quantity: 1,
            adjustments: [
              {
                id: "lia-2",
                amount: 93,
                description: "discount",
                discount_id: "medusa-185",
              },
            ],
          },
          100
        )

        const response = await api
          .delete("/store/carts/discount-cart/line-items/test-li", {
            withCredentials: true,
          })
          .catch((err) => console.log(err))

        expect(response.data.cart.items.length).toEqual(1)
        expect(response.data.cart.items).toEqual([
          expect.objectContaining({
            adjustments: [
              expect.objectContaining({
                item_id: "line-item-2",
                amount: 185,
                discount_id: "medusa-185",
              }),
            ],
          }),
        ])
      })
    })
  })

  describe("POST /store/carts/:id/line-items/:line_id", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("updates line item of cart", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/store/carts/test-cart-3/line-items/test-item3/",
          {
            quantity: 3,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cart_id: "test-cart-3",
            unit_price: 8000,
            variant_id: "test-variant-sale-cg",
            quantity: 3,
            adjustments: [],
          }),
        ])
      )
    })

    it("updates line item of a cart containing a total fixed discount", async () => {
      const api = useApi()
      await simpleLineItemFactory(dbConnection, {
        id: "test-li-disc",
        allow_discounts: true,
        title: "Line Item Disc",
        thumbnail: "https://test.js/1234",
        unit_price: 1000,
        quantity: 1,
        variant_id: "test-variant-quantity",
        cart_id: "test-cart-w-total-fixed-discount",
      })

      const response = await api
        .post(
          `store/carts/test-cart-w-total-fixed-discount/line-items/test-li-disc`,
          {
            quantity: 3,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-total-fixed-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 3,
          adjustments: [
            expect.objectContaining({
              amount: 100,
              discount_id: "total-fixed-100",
              description: "discount",
            }),
          ],
        }),
      ])
    })

    it("updates line item of a cart containing a total percentage discount", async () => {
      const api = useApi()
      await simpleLineItemFactory(dbConnection, {
        id: "test-li-disc",
        allow_discounts: true,
        title: "Line Item Disc",
        thumbnail: "https://test.js/1234",
        unit_price: 1000,
        quantity: 1,
        variant_id: "test-variant-quantity",
        cart_id: "test-cart-w-total-percentage-discount",
      })

      const response = await api
        .post(
          "/store/carts/test-cart-w-total-percentage-discount/line-items/test-li-disc",
          {
            quantity: 10,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-total-percentage-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 10,
          adjustments: [
            expect.objectContaining({
              amount: 1000,
              discount_id: "10Percent",
              description: "discount",
            }),
          ],
        }),
      ])
    })

    it("updates line item of a cart containing an item fixed discount", async () => {
      const api = useApi()
      await simpleLineItemFactory(dbConnection, {
        id: "test-li-disc",
        allow_discounts: true,
        title: "Line Item Disc",
        thumbnail: "https://test.js/1234",
        unit_price: 1000,
        quantity: 1,
        variant_id: "test-variant-quantity",
        cart_id: "test-cart-w-item-fixed-discount",
      })

      const response = await api
        .post(
          "/store/carts/test-cart-w-item-fixed-discount/line-items/test-li-disc",
          {
            quantity: 4,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-item-fixed-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 4,
          adjustments: [
            expect.objectContaining({
              amount: 800,
              discount_id: "item-fixed-200",
              description: "discount",
            }),
          ],
        }),
      ])
    })

    it("updates line item of a cart containing an item percentage discount", async () => {
      const api = useApi()
      await simpleLineItemFactory(dbConnection, {
        id: "test-li-disc",
        allow_discounts: true,
        title: "Line Item Disc",
        thumbnail: "https://test.js/1234",
        unit_price: 1000,
        quantity: 1,
        variant_id: "test-variant-quantity",
        cart_id: "test-cart-w-item-percentage-discount",
      })

      const response = await api
        .post(
          "/store/carts/test-cart-w-item-percentage-discount/line-items/test-li-disc",
          {
            quantity: 3,
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      expect(response.data.cart.items).toEqual([
        expect.objectContaining({
          cart_id: "test-cart-w-item-percentage-discount",
          unit_price: 1000,
          variant_id: "test-variant-quantity",
          quantity: 3,
          adjustments: [
            expect.objectContaining({
              amount: 450,
              discount_id: "item-percentage-15",
              description: "discount",
            }),
          ],
        }),
      ])
    })
  })

  describe("POST /store/carts/:id", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    // We were experiencing some issues when having created a cart in a region
    // containing multiple countries. At this point, the cart does not have a shipping
    // address. Therefore, on subsequent requests to update the cart, the server
    // would throw a 500 due to missing shipping address id on insertion.
    it("updates a cart, that does not have a shipping address", async () => {
      const api = useApi()

      const response = await api.post("/store/carts", {
        region_id: "test-region-multiple",
      })

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`, {
        region_id: "test-region",
      })

      expect(getRes.status).toEqual(200)
    })

    it("fails on apply discount if limit has been reached", async () => {
      const api = useApi()

      const err = await api
        .post("/store/carts/test-cart", {
          discounts: [{ code: "SPENT" }],
        })
        .catch((err) => err)

      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.message).toEqual(
        "Discount has been used maximum allowed times"
      )
    })

    it("successfully passes customer conditions with `in` operator and applies discount", async () => {
      const api = useApi()

      await simpleCustomerFactory(dbConnection, {
        id: "cus_1234",
        email: "oli@medusajs.com",
        groups: [
          {
            id: "customer-group-1",
            name: "VIP Customer",
          },
        ],
      })

      await simpleCustomerGroupFactory(dbConnection, {
        id: "customer-group-2",
        name: "Loyal",
      })

      await simpleCartFactory(
        dbConnection,
        {
          id: "test-customer-discount",
          region: {
            id: "test-region",
            name: "Test region",
            tax_rate: 12,
          },
          customer: "cus_1234",
          line_items: [
            {
              variant_id: "test-variant",
              unit_price: 100,
            },
          ],
        },
        100
      )

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        regions: ["test-region"],
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "customer_groups",
              operator: "in",
              customer_groups: ["customer-group-1", "customer-group-2"],
            },
          ],
        },
      })

      const response = await api.post("/store/carts/test-customer-discount", {
        discounts: [{ code: "TEST" }],
      })

      const cartRes = response.data.cart
      expect(cartRes.discounts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "TEST",
          }),
        ])
      )
      expect(response.status).toEqual(200)
    })

    it("successfully passes customer conditions with `not_in` operator and applies discount", async () => {
      const api = useApi()

      await simpleCustomerFactory(dbConnection, {
        id: "cus_1234",
        email: "oli@medusajs.com",
        groups: [
          {
            id: "customer-group-2",
            name: "VIP Customer",
          },
        ],
      })

      await simpleCustomerGroupFactory(dbConnection, {
        id: "customer-group-1",
        name: "Customer group 1",
      })

      await simpleCustomerGroupFactory(dbConnection, {
        id: "customer-group-3",
        name: "Customer group 3",
      })

      await simpleCartFactory(
        dbConnection,
        {
          id: "test-customer-discount",
          region: {
            id: "test-region",
            name: "Test region",
            tax_rate: 12,
          },
          customer: "cus_1234",
          line_items: [
            {
              variant_id: "test-variant",
              unit_price: 100,
            },
          ],
        },
        100
      )

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        regions: ["test-region"],
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "customer_groups",
              operator: "not_in",
              customer_groups: ["customer-group-1", "customer-group-3"],
            },
          ],
        },
      })

      const response = await api.post("/store/carts/test-customer-discount", {
        discounts: [{ code: "TEST" }],
      })

      const cartRes = response.data.cart
      expect(cartRes.discounts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "TEST",
          }),
        ])
      )
      expect(response.status).toEqual(200)
    })

    it("successfully applies discount in case no conditions is defined for group", async () => {
      const api = useApi()

      await simpleCustomerFactory(dbConnection, {
        id: "cus_1234",
        email: "oli@medusajs.com",
        groups: [
          {
            id: "customer-group-1",
            name: "VIP Customer",
          },
        ],
      })

      await simpleCartFactory(
        dbConnection,
        {
          id: "test-customer-discount",
          region: {
            id: "test-region",
            name: "Test region",
            tax_rate: 12,
          },
          customer: "cus_1234",
          line_items: [
            {
              variant_id: "test-variant",
              unit_price: 100,
            },
          ],
        },
        100
      )

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        regions: ["test-region"],
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
        },
      })

      const response = await api.post("/store/carts/test-customer-discount", {
        discounts: [{ code: "TEST" }],
      })

      const cartRes = response.data.cart
      expect(cartRes.discounts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "TEST",
          }),
        ])
      )
      expect(response.status).toEqual(200)
    })

    it("fails to apply discount if customer group is part of `not_in` conditions", async () => {
      const api = useApi()

      await simpleCustomerFactory(dbConnection, {
        id: "cus_1234",
        email: "oli@medusajs.com",
        groups: [
          {
            id: "customer-group-1",
            name: "VIP Customer",
          },
        ],
      })

      await simpleCartFactory(
        dbConnection,
        {
          id: "test-customer-discount",
          region: {
            id: "test-region",
            name: "Test region",
            tax_rate: 12,
          },
          customer: "cus_1234",
          line_items: [
            {
              variant_id: "test-variant",
              unit_price: 100,
            },
          ],
        },
        100
      )

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        regions: ["test-region"],
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "customer_groups",
              operator: "not_in",
              customer_groups: ["customer-group-1"],
            },
          ],
        },
      })

      try {
        await api.post("/store/carts/test-customer-discount", {
          discounts: [{ code: "TEST" }],
        })
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "Discount is not valid for customer"
        )
      }
    })

    it("fails to apply discount if customer group is not part of `in` conditions", async () => {
      const api = useApi()

      await simpleCustomerFactory(dbConnection, {
        id: "cus_1234",
        email: "oli@medusajs.com",
        groups: [
          {
            id: "customer-group-2",
            name: "VIP Customer",
          },
        ],
      })

      await simpleCustomerGroupFactory(dbConnection, {
        id: "customer-group-1",
        name: "Customer group 1",
      })

      await simpleCartFactory(
        dbConnection,
        {
          id: "test-customer-discount",
          region: {
            id: "test-region",
            name: "Test region",
            tax_rate: 12,
          },
          customer: "cus_1234",
          line_items: [
            {
              variant_id: "test-variant",
              unit_price: 100,
            },
          ],
        },
        100
      )

      await simpleDiscountFactory(dbConnection, {
        id: "test-discount",
        code: "TEST",
        regions: ["test-region"],
        rule: {
          type: "percentage",
          value: "10",
          allocation: "total",
          conditions: [
            {
              type: "customer_groups",
              operator: "in",
              customer_groups: ["customer-group-1"],
            },
          ],
        },
      })

      try {
        await api.post("/store/carts/test-customer-discount", {
          discounts: [{ code: "TEST" }],
        })
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "Discount is not valid for customer"
        )
      }
    })

    it("fails to apply expired discount", async () => {
      expect.assertions(2)
      const api = useApi()

      try {
        await api.post("/store/carts/test-cart", {
          discounts: [{ code: "EXP_DISC" }],
        })
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual("Discount is expired")
      }
    })

    it("fails on discount before start day", async () => {
      expect.assertions(2)
      const api = useApi()

      try {
        await api.post("/store/carts/test-cart", {
          discounts: [{ code: "PREM_DISC" }],
        })
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual("Discount is not valid yet")
      }
    })

    it("fails on apply invalid dynamic discount", async () => {
      const api = useApi()

      try {
        await api.post("/store/carts/test-cart", {
          discounts: [{ code: "INV_DYN_DISC" }],
        })
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual("Discount is expired")
      }
    })

    it("Applies dynamic discount to cart correctly", async () => {
      const api = useApi()

      const cart = await api.post(
        "/store/carts/test-cart",
        {
          discounts: [{ code: "DYN_DISC" }],
        },
        { withCredentials: true }
      )

      expect(cart.data.cart.shipping_total).toBe(1000)
      expect(cart.status).toEqual(200)
    })

    it("updates cart customer id", async () => {
      const api = useApi()

      const response = await api.post("/store/carts/test-cart", {
        customer_id: "test-customer-2",
      })

      expect(response.status).toEqual(200)
    })

    it("updates prices when cart customer id is updated", async () => {
      const api = useApi()

      const beforeUpdate = await api
        .get(`/store/carts/test-cart-3`)
        .catch((error) => console.log(error))

      expect(beforeUpdate.data.cart.items[0].unit_price).toEqual(8000)

      const response = await api
        .post("/store/carts/test-cart-3", {
          customer_id: "test-customer-2",
        })
        .catch((error) => console.log(error))

      expect(response.status).toEqual(200)
      expect(response.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant-sale-cg",
            unit_price: 500,
          }),
        ])
      )
    })

    it("on region update: updates line item prices", async () => {
      const api = useApi()

      const beforeUpdate = await api
        .get(`/store/carts/test-cart-3`)
        .catch((error) => console.log(error))

      expect(beforeUpdate.data.cart.items[0].unit_price).toEqual(8000)
      expect(beforeUpdate.data.cart.region_id).toEqual("test-region")

      const response = await api
        .post("/store/carts/test-cart-3", {
          region_id: "test-region-multiple",
        })
        .catch((error) => console.log(error))

      expect(response.status).toEqual(200)
      expect(response.data.cart.region_id).toEqual("test-region-multiple")
      expect(response.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            unit_price: 2000,
            variant_id: "test-variant",
          }),
          expect.objectContaining({
            unit_price: 700,
            variant_id: "test-variant-sale-cg",
          }),
        ])
      )
    })

    it("on region update: refreshes line item adjustments", async () => {
      const api = useApi()

      const usdRegion = await api
        .post(`/store/carts/test-cart-3/`, {
          discounts: [{ code: "10PERCENT" }],
        })
        .catch((error) => console.log(error))

      // current state of the cart:
      // - currency -> USD
      // - items -> [{ unit_price: 8000, ... }, { unit_price: 8000, ... }]
      // - discount -> 10%
      // - discount total -> 1600

      expect(usdRegion.data.cart.region_id).toEqual("test-region")
      expect(usdRegion.data.cart.discount_total).toEqual(1600)

      // now, we change the region to one operating in EUR
      // this should trigger a refresh of the line item adjustments
      const eurRegion = await api
        .post("/store/carts/test-cart-3", {
          region_id: "eur-region",
        })
        .catch((error) => console.log(error))

      // state of the cart after update:
      // - currency -> EUR
      // - items -> [{ unit_price: 2000, ... }, { unit_price: 700, ... }]
      // - discount -> 10%
      // - discount total -> 270

      expect(eurRegion.data.cart.region_id).toEqual("eur-region")
      expect(eurRegion.data.cart.discount_total).toEqual(270)
    })

    it("on region update: removes line item adjustment if discount is not applicable in region", async () => {
      const api = useApi()

      const withDiscount = await api
        .post(`/store/carts/test-cart-3/`, {
          discounts: [{ code: "15PERCENT" }],
        })
        .catch((error) => console.log(error))

      expect(withDiscount.data.cart.region_id).toEqual("test-region")
      expect(withDiscount.data.cart.discount_total).toEqual(2400)
      expect(withDiscount.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant-sale-cg",
            adjustments: expect.arrayContaining([
              expect.objectContaining({
                amount: 1200,
              }),
            ]),
          }),
          expect.objectContaining({
            variant_id: "test-variant",
            adjustments: expect.arrayContaining([
              expect.objectContaining({
                amount: 1200,
              }),
            ]),
          }),
        ])
      )

      const response = await api
        .post("/store/carts/test-cart-3", {
          region_id: "eur-region",
        })
        .catch((error) => console.log(error))

      expect(response.data.cart.region_id).toEqual("eur-region")
      expect(response.data.cart.discount_total).toEqual(0)
      expect(response.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant-sale-cg",
            adjustments: [],
          }),
          expect.objectContaining({
            variant_id: "test-variant",
            adjustments: [],
          }),
        ])
      )
    })

    it("updates address using string id", async () => {
      const api = useApi()

      const response = await api.post("/store/carts/test-cart", {
        billing_address: "test-general-address",
        shipping_address: "test-general-address",
      })

      expect(response.data.cart.shipping_address_id).toEqual(
        "test-general-address"
      )
      expect(response.data.cart.billing_address_id).toEqual(
        "test-general-address"
      )
      expect(response.status).toEqual(200)
    })

    it("updates address", async () => {
      const api = useApi()

      const response = await api.post("/store/carts/test-cart", {
        shipping_address: {
          first_name: "clark",
          last_name: "kent",
          address_1: "5th avenue",
          city: "nyc",
          country_code: "us",
          postal_code: "something",
        },
      })

      expect(response.data.cart.shipping_address.first_name).toEqual("clark")
      expect(response.status).toEqual(200)
    })

    it("adds free shipping to cart then removes it again", async () => {
      const api = useApi()

      let cart = await api.post(
        "/store/carts/test-cart",
        {
          discounts: [{ code: "FREE_SHIPPING" }, { code: "CREATED" }],
        },
        { withCredentials: true }
      )

      expect(cart.data.cart.shipping_total).toBe(0)
      expect(cart.status).toEqual(200)

      cart = await api.post(
        "/store/carts/test-cart",
        {
          discounts: [{ code: "CREATED" }],
        },
        { withCredentials: true }
      )

      expect(cart.data.cart.shipping_total).toBe(1000)
      expect(cart.status).toEqual(200)
    })

    it("complete cart with giftcard total 0", async () => {
      const manager = dbConnection.manager
      await manager.insert(GiftCard, {
        id: "gift_test",
        code: "GC_TEST",
        value: 20000,
        balance: 20000,
        region_id: "test-region",
      })

      const api = useApi()

      await api.post(`/store/carts/test-cart-3`, {
        gift_cards: [{ code: "GC_TEST" }],
      })

      const getRes = await api
        .post(`/store/carts/test-cart-3/complete`)
        .catch((err) => {
          console.log(err.response.data)
        })

      expect(getRes.status).toEqual(200)
      expect(getRes.data.type).toEqual("order")
    })

    it("complete cart with items inventory covered", async () => {
      const api = useApi()
      const getRes = await api.post(`/store/carts/test-cart-2/complete-cart`)

      expect(getRes.status).toEqual(200)
      expect(getRes.data.type).toEqual("order")

      const variantRes = await api.get("/store/variants/test-variant")
      expect(variantRes.data.variant.inventory_quantity).toEqual(0)
    })

    it("calculates correct payment totals on cart completion taking into account line item adjustments", async () => {
      const api = useApi()

      await api.post("/store/carts/test-cart-3", {
        discounts: [{ code: "CREATED" }],
      })

      const createdOrder = await api.post(
        `/store/carts/test-cart-3/complete-cart`
      )

      expect(createdOrder.data.type).toEqual("order")
      expect(createdOrder.data.data.discount_total).toEqual(10000)
      expect(createdOrder.data.data.subtotal).toEqual(16000)
      expect(createdOrder.data.data.total).toEqual(6000)
      expect(createdOrder.data.data.payments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 6000,
          }),
        ])
      )

      expect(createdOrder.status).toEqual(200)
    })

    it("returns early, if cart is already completed", async () => {
      const manager = dbConnection.manager
      const api = useApi()
      await manager.query(
        `UPDATE "cart" SET completed_at=current_timestamp WHERE id = 'test-cart-2'`
      )
      try {
        await api.post(`/store/carts/test-cart-2/complete-cart`)
      } catch (error) {
        expect(error.response.data).toMatchSnapshot({
          type: "not_allowed",
          message: "Cart has already been completed",
          code: "cart_incompatible_state",
        })
        expect(error.response.status).toEqual(409)
      }
    })

    it("fails to complete cart with items inventory not/partially covered", async () => {
      const manager = dbConnection.manager

      const li = manager.create(LineItem, {
        id: "test-item",
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 99,
        variant_id: "test-variant-2",
        cart_id: "test-cart-2",
      })
      await manager.save(li)

      const api = useApi()

      try {
        await api.post(`/store/carts/test-cart-2/complete-cart`)
      } catch (e) {
        expect(e.response.data).toMatchSnapshot({
          code: "insufficient_inventory",
        })
        expect(e.response.status).toBe(409)
      }

      // check to see if payment has been cancelled and cart is not completed
      const res = await api.get(`/store/carts/test-cart-2`)
      expect(res.data.cart.payment.canceled_at).not.toBe(null)
      expect(res.data.cart.completed_at).toBe(null)
    })

    it("fails to complete swap cart with items inventory not/partially covered", async () => {
      const manager = dbConnection.manager

      const li = manager.create(LineItem, {
        id: "test-item",
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 99,
        variant_id: "test-variant-2",
        cart_id: "swap-cart",
      })
      await manager.save(li)

      await manager.query(
        "UPDATE swap SET cart_id='swap-cart' where id='test-swap'"
      )

      const api = useApi()

      try {
        await api.post(`/store/carts/swap-cart/complete-cart`)
      } catch (e) {
        expect(e.response.data).toMatchSnapshot({
          code: "insufficient_inventory",
        })
        expect(e.response.status).toBe(409)
      }

      // check to see if payment has been cancelled and cart is not completed
      const res = await api.get(`/store/carts/swap-cart`)
      expect(res.data.cart.payment_authorized_at).toBe(null)
      expect(res.data.cart.payment.canceled_at).not.toBe(null)
    })

    it("successfully completes swap cart with items inventory not/partially covered due to backorder flag", async () => {
      const manager = dbConnection.manager

      const li = manager.create(LineItem, {
        id: "test-item",
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 99,
        variant_id: "test-variant-2",
        cart_id: "swap-cart",
      })
      await manager.save(li)
      await manager.query(
        "UPDATE swap SET cart_id='swap-cart' where id='test-swap'"
      )
      await manager.query(
        "UPDATE swap SET allow_backorder=true where id='test-swap'"
      )
      await manager.query("DELETE FROM payment where swap_id='test-swap'")

      const api = useApi()

      try {
        await api.post(`/store/carts/swap-cart/complete-cart`)
      } catch (error) {
        console.log(error)
      }

      // check to see if payment is authorized and cart is completed
      const res = await api.get(`/store/carts/swap-cart`)
      expect(res.data.cart.payment_authorized_at).not.toBe(null)
      expect(res.data.cart.completed_at).not.toBe(null)
    })
  })

  describe("POST /store/carts/:id/shipping-methods", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
        const manager = dbConnection.manager

        const _cart = await manager.create(Cart, {
          id: "test-cart-with-cso",
          customer_id: "some-customer",
          email: "some-customer@email.com",
          shipping_address: {
            id: "test-shipping-address",
            first_name: "lebron",
            country_code: "us",
          },
          region_id: "test-region",
          currency_code: "usd",
          type: "swap",
        })

        const cartWithCustomSo = await manager.save(_cart)

        await manager.insert(CustomShippingOption, {
          id: "another-cso-test",
          cart_id: "test-cart-with-cso",
          shipping_option_id: "test-option",
          price: 5,
        })
      } catch (err) {
        console.log(err)
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("adds a normal shipping method to cart", async () => {
      const api = useApi()

      const cartWithShippingMethod = await api.post(
        "/store/carts/test-cart/shipping-methods",
        {
          option_id: "test-option",
        },
        { withCredentials: true }
      )

      expect(cartWithShippingMethod.data.cart.shipping_methods).toContainEqual(
        expect.objectContaining({ shipping_option_id: "test-option" })
      )
      expect(cartWithShippingMethod.status).toEqual(200)
    })

    it("given a cart with custom options and a shipping option already belonging to said cart, then it should add a shipping method based on the given custom shipping option", async () => {
      const shippingOptionId = "test-option"

      const api = useApi()

      const cartWithCustomShippingMethod = await api
        .post(
          "/store/carts/test-cart-with-cso/shipping-methods",
          {
            option_id: shippingOptionId,
          },
          { withCredentials: true }
        )
        .catch((err) => err.response)

      expect(
        cartWithCustomShippingMethod.data.cart.shipping_methods
      ).toContainEqual(
        expect.objectContaining({
          shipping_option_id: shippingOptionId,
          price: 5,
        })
      )
      expect(cartWithCustomShippingMethod.status).toEqual(200)
    })

    it("given a cart with custom options and an option id not corresponding to any custom shipping option, then it should throw an invalid error", async () => {
      const api = useApi()

      try {
        await api.post(
          "/store/carts/test-cart-with-cso/shipping-methods",
          {
            option_id: "orphan-so",
          },
          { withCredentials: true }
        )
      } catch (err) {
        expect(err.response.status).toEqual(400)
        expect(err.response.data.message).toEqual("Wrong shipping option")
      }
    })

    it("adds a giftcard to cart, but ensures discount only applied to discountable items", async () => {
      const api = useApi()

      // Add standard line item to cart
      await api.post(
        "/store/carts/test-cart/line-items",
        {
          variant_id: "test-variant",
          quantity: 1,
        },
        { withCredentials: true }
      )

      // Add gift card to cart
      await api.post(
        "/store/carts/test-cart/line-items",
        {
          variant_id: "giftcard-denom",
          quantity: 1,
        },
        { withCredentials: true }
      )

      // Add a 10% discount to the cart
      const cartWithGiftcard = await api
        .post(
          "/store/carts/test-cart",
          {
            discounts: [{ code: "10PERCENT" }],
          },
          { withCredentials: true }
        )
        .catch((err) => console.log(err))

      // Ensure that the discount is only applied to the standard item
      const itemId = cartWithGiftcard.data.cart.items.find(
        (item) => !item.is_giftcard
      ).id
      expect(cartWithGiftcard.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            quantity: 1,
            adjustments: [
              expect.objectContaining({
                discount_id: "10Percent",
                amount: 100,
                item_id: itemId,
              }),
            ],
          }),
        ])
      )
      expect(cartWithGiftcard.data.cart.total).toBe(2900) // 1000 (giftcard) + 900 (standard item with 10% discount) + 1000 Shipping
      expect(cartWithGiftcard.data.cart.discount_total).toBe(100)
      expect(cartWithGiftcard.status).toEqual(200)
    })

    it("adds no more than 1 shipping method per shipping profile", async () => {
      const api = useApi()
      const addShippingMethod = async (option_id) => {
        return await api.post(
          "/store/carts/test-cart/shipping-methods",
          {
            option_id,
          },
          { withCredentials: true }
        )
      }

      await addShippingMethod("test-option")
      const cartWithAnotherShippingMethod = await addShippingMethod(
        "test-option-2"
      )

      expect(
        cartWithAnotherShippingMethod.data.cart.shipping_methods.length
      ).toEqual(1)
      expect(
        cartWithAnotherShippingMethod.data.cart.shipping_methods
      ).toContainEqual(
        expect.objectContaining({
          shipping_option_id: "test-option-2",
          price: 500,
        })
      )
      expect(cartWithAnotherShippingMethod.status).toEqual(200)
    })
  })

  describe("DELETE /store/carts/:id/discounts/:code", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
        await dbConnection.manager.query(
          `INSERT INTO "cart_discounts" (cart_id, discount_id) VALUES ('test-cart', 'free-shipping')`
        )
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("removes free shipping and updates shipping total", async () => {
      const api = useApi()

      const cartWithFreeShipping = await api.post(
        "/store/carts/test-cart",
        {
          discounts: [{ code: "FREE_SHIPPING" }],
        },
        { withCredentials: true }
      )

      expect(cartWithFreeShipping.data.cart.shipping_total).toBe(0)
      expect(cartWithFreeShipping.status).toEqual(200)

      const response = await api.delete(
        "/store/carts/test-cart/discounts/FREE_SHIPPING"
      )

      expect(response.data.cart.shipping_total).toBe(1000)
      expect(response.status).toEqual(200)
    })
  })

  describe("get-cart with session customer", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("updates empty cart.customer_id on cart retrieval", async () => {
      const api = useApi()

      const customer = await api.post(
        "/store/customers",
        {
          email: "oli@test.dk",
          password: "olitest",
          first_name: "oli",
          last_name: "oli",
        },
        { withCredentials: true }
      )

      const cookie = customer.headers["set-cookie"][0]

      const cart = await api.post("/store/carts", {}, { withCredentials: true })

      const response = await api.get(`/store/carts/${cart.data.cart.id}`, {
        headers: {
          cookie,
        },
        withCredentials: true,
      })

      expect(response.data.cart.customer_id).toEqual(customer.data.customer.id)
      expect(response.status).toEqual(200)
    })

    it("updates cart.customer_id on cart retrieval if cart.customer_id differ from session customer", async () => {
      const api = useApi()

      const customer = await api.post(
        "/store/customers",
        {
          email: "oli@test.dk",
          password: "olitest",
          first_name: "oli",
          last_name: "oli",
        },
        { withCredentials: true }
      )

      const cookie = customer.headers["set-cookie"][0]

      const cart = await api.post("/store/carts")

      const updatedCart = await api.post(`/store/carts/${cart.data.cart.id}`, {
        customer_id: "test-customer",
      })

      const response = await api.get(
        `/store/carts/${updatedCart.data.cart.id}`,
        {
          headers: {
            cookie,
          },
        }
      )

      expect(response.data.cart.customer_id).toEqual(customer.data.customer.id)
      expect(response.status).toEqual(200)
    })
  })

  describe("shipping address + region updates", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("updates region only - single to multiple countries", async () => {
      const api = useApi()

      const { data, status } = await api
        .post(`/store/carts/test-cart`, {
          region_id: `test-region-multiple`,
        })
        .catch((err) => {
          console.log(err)
          throw err
        })

      expect(status).toEqual(200)
      expect(data.cart.region_id).toEqual("test-region-multiple")
      expect(data.cart.shipping_address).toMatchSnapshot({
        id: expect.any(String),
        country_code: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("should reset the shipping_address on null value", async () => {
      const api = useApi()

      const { data, status } = await api
        .post(`/store/carts/test-cart`, {
          shipping_address: null,
        })
        .catch((err) => {
          console.log(err)
          throw err
        })

      expect(status).toEqual(200)
      expect(data.cart.shipping_address).toEqual(null)
    })
  })

  describe("calculated prices for shipping option", () => {
    afterEach(async () => {
      await doAfterEach()
    })

    it("it fetches prices with calculated amount", async () => {
      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)
      const cart = await simpleCartFactory(dbConnection, {
        region: region.id,
        line_items: [{ variant_id: product.variants[0].id, quantity: 1 }],
      })
      await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
        price_type: "calculated",
        data: { price: 123 },
      })

      const api = useApi()

      const { data, status } = await api
        .get(`/store/shipping-options/${cart.id}`)
        .catch((err) => {
          console.log(err)
          throw err
        })

      expect(status).toEqual(200)
      expect(data.shipping_options[0].amount).toEqual(123)
    })
  })

  describe("mix of calculated and flat rate prices", () => {
    afterEach(async () => {
      await doAfterEach()
    })

    it("it fetches prices with calculated amount", async () => {
      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)
      const cart = await simpleCartFactory(dbConnection, {
        region: region.id,
        line_items: [{ variant_id: product.variants[0].id, quantity: 1 }],
      })
      await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
        price_type: "flat_rate",
        data: { price: 123 },
      })
      await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
        price_type: "calculated",
        data: { price: 123 },
      })

      const api = useApi()

      const { data, status } = await api
        .get(`/store/shipping-options/${cart.id}`)
        .catch((err) => {
          console.log(err)
          throw err
        })

      expect(status).toEqual(200)
      expect(data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 123,
            price_type: "calculated",
          }),
          expect.objectContaining({
            amount: 500,
            price_type: "flat_rate",
          }),
        ])
      )
    })
  })
})
