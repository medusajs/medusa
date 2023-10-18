import { MoneyAmount, PriceList, Region } from "@medusajs/medusa"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { setPort, useApi } from "../../../../environment-helpers/use-api"
import { simpleDiscountFactory, simpleProductFactory } from "../../../../factories"

import { AllocationType } from "@medusajs/medusa"
import { AxiosInstance } from "axios"
import { DiscountRuleType } from "@medusajs/medusa"
import { ProductVariantMoneyAmount } from "@medusajs/medusa"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import path from "path"
import setupServer from "../../../../environment-helpers/setup-server"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

describe("/store/carts", () => {
  let medusaProcess
  let dbConnection
  let express

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd, verbose: true })
    const { app, port } = await bootstrapApp({ cwd, env: { 
      MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true
    } })
    setPort(port)
    express = app.listen(port, () => {
      process.send?.(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("POST /store/carts", () => {
    let prod1
    let prodSale

    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)

      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
        automatic_taxes: false
      })

      await manager.query(
        `UPDATE "country"
         SET region_id='region'
         WHERE iso_2 = 'us'`
      )

      prod1 = await simpleProductFactory(dbConnection, {
        id: "test-product",
        variants: [{ id: "test-variant_1" }],
      })

      prodSale = await simpleProductFactory(dbConnection, {
        id: "test-product-sale",
        variants: [
          {
            id: "test-variant-sale",
            prices: [{ amount: 1000, currency: "usd" }],
          },
        ],
      })
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("should create a cart", async () => {
      const api = useApi()! as AxiosInstance
      const response = await api.post("/store/carts")

      expect(response.status).toEqual(200)

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it("should fail to create a cart when no region exist", async () => {
      const api = useApi()! as AxiosInstance

      await dbConnection.manager.query(
        `UPDATE "country"
         SET region_id=null
         WHERE iso_2 = 'us'`
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

    it("should create a cart with items", async () => {
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
        currency_code: "usd",
        amount: 800,
        price_list_id: "pl_current",
      })

      await dbConnection.manager.save(ma_sale_1)

      await dbConnection.manager.insert(ProductVariantMoneyAmount, {
        id: 'pvma-test', 
        variant_id: prodSale.variants[0].id,
        money_amount_id: ma_sale_1.id,
      })

      const api = useApi()! as AxiosInstance

      const response = await api
        .post("/store/carts", {
          items: [
            {
              variant_id: prod1.variants[0].id,
              quantity: 1,
            },
            {
              variant_id: prodSale.variants[0].id,
              quantity: 2,
            },
          ],
        })

      response.data.cart.items.sort((a, b) => a.quantity - b.quantity)

      expect(response.status).toEqual(200)
      expect(response.data.cart.items).toHaveLength(2)
      expect(response.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: prod1.variants[0].id,
            quantity: 1,
          }),
          expect.objectContaining({
            variant_id: prodSale.variants[0].id,
            quantity: 2,
            unit_price: 800,
          }),
        ])
      )

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it.skip("should apply discount to cart", async () => {
      const api = useApi()! as AxiosInstance
      
      await simpleDiscountFactory(dbConnection, {
        code: 'test-discount',
        regions: ['region'],
        rule: { 
          allocation: AllocationType.TOTAL, 
          type: DiscountRuleType.PERCENTAGE,
          value: 50,
        }
      })

      const payload = {
        title: "Test",
        discountable: false,
        description: "test-product-description",
        images: ["test-image.png", "test-image-2.png"],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      }

      const product = await api.post("/admin/products", payload, adminHeaders)

      const variantId = product.data.product.variants[0].id

      const response = await api
        .post("/store/carts", {
          items: [
            {
              variant_id: variantId,
              quantity: 2,
            },
          ],
        })

      const cartId = response.data.cart.id

      const cartResult = await api.post(`/store/carts/${cartId}`, { 
        discounts: [ { code: 'test-discount' }]
      })

      expect(cartResult.data.cart.items).toEqual(expect.arrayContaining([
        expect.objectContaining({
          "subtotal": 200,
          "discount_total": 100,
          "total": 100,
        })
      ]))
    })

    it("should create a cart with country", async () => {
      const api = useApi()! as AxiosInstance
      const response = await api.post("/store/carts", {
        country_code: "us",
      })

      expect(response.status).toEqual(200)
      expect(response.data.cart.shipping_address.country_code).toEqual("us")

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it("should create a cart with context", async () => {
      const api = useApi()! as AxiosInstance

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
        ip: expect.any(String),
        user_agent: expect.stringContaining("axios/0.21."),
        test_id: "test",
      })
    })
  })
})
