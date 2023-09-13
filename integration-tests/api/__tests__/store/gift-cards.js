const path = require("path")
const { Region, GiftCard, GiftCardTransaction } = require("@medusajs/medusa")

const setupServer = require("../../../environment-helpers/setup-server")
const { useApi } = require("../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../environment-helpers/use-db")
const {
  simpleProductFactory,
  simpleCartFactory,
  simpleRegionFactory,
  simpleGiftCardFactory,
} = require("../../../factories")

jest.setTimeout(30000)

describe("/store/gift-cards", () => {
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

  describe("GET /store/gift-cards/:code", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
      await manager.insert(GiftCard, {
        id: "gift_test",
        code: "GC_TEST",
        value: 200,
        balance: 120,
        region_id: "region",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("retrieves a gift card", async () => {
      const api = useApi()

      const response = await api.get("/store/gift-cards/GC_TEST")
      expect(response.status).toEqual(200)
      expect(response.data.gift_card).toEqual({
        id: "gift_test",
        code: "GC_TEST",
        value: 200,
        balance: 120,
        region: expect.any(Object),
      })
    })
  })

  describe("gift card transactions", () => {
    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("only creates transactions for gift cards used", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, {
        currency_code: "usd",
      })
      const cart = await simpleCartFactory(dbConnection, {
        region: region.id,
      })
      const product = await simpleProductFactory(dbConnection)
      const giftCard1 = await simpleGiftCardFactory(dbConnection, {
        code: "GC_1",
        region_id: region.id,
        balance: 50000,
        value: 50000,
      })
      const giftCard2 = await simpleGiftCardFactory(dbConnection, {
        code: "GC_2",
        region_id: region.id,
        balance: 50000,
        value: 50000,
      })

      await api.post(`/store/carts/${cart.id}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })

      await api.post(`/store/carts/${cart.id}`, {
        email: "some@customer.com",
        gift_cards: [{ code: "GC_1" }, { code: "GC_2" }],
      })

      const response = await api.post(`/store/carts/${cart.id}/complete`)
      expect(response.status).toEqual(200)
      const orderId = response.data.data.id

      const transaction1 = await dbConnection.manager.find(
        GiftCardTransaction,
        {
          order_id: orderId,
        }
      )

      expect(transaction1.length).toEqual(1)
      expect(transaction1[0].amount).toEqual(100)
    })
  })

  describe("gift card transaction ordering", () => {
    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("choose the gift card with shortest expiry", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, {
        currency_code: "usd",
      })
      const cart = await simpleCartFactory(dbConnection, {
        region: region.id,
      })
      const product = await simpleProductFactory(dbConnection)
      const ends_first = new Date(2050, 1, 1)
      const ends_later = new Date(2050, 1, 2)
      const giftCard1 = await simpleGiftCardFactory(dbConnection, {
        id: "GC_1",
        code: "GC_1",
        region_id: region.id,
        balance: 50000,
        value: 50000,
        ends_at: ends_later
      })
      const giftCard2 = await simpleGiftCardFactory(dbConnection, {
        id: "GC_2",
        code: "GC_2",
        region_id: region.id,
        balance: 50000,
        value: 50000,
        ends_at: ends_first
      })
      
      await api.post(`/store/carts/${cart.id}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })

      await api.post(`/store/carts/${cart.id}`, {
        email: "some@customer.com",
        gift_cards: [{ code: "GC_1" }, { code: "GC_2" }],
      })

      const response = await api.post(`/store/carts/${cart.id}/complete`)
      expect(response.status).toEqual(200)
      const orderId = response.data.data.id

      const transaction1 = await dbConnection.manager.find(
        GiftCardTransaction,
        {
          order_id: orderId,
        }
      )

      expect(transaction1.length).toEqual(1)
      expect(transaction1[0].gift_card_id).toEqual(giftCard2.id)
    })
  })

  it("choose the gift card with lowest balance if same expiry", async () => {
    const api = useApi()

    const region = await simpleRegionFactory(dbConnection, {
      currency_code: "usd",
    })
    const cart = await simpleCartFactory(dbConnection, {
      region: region.id,
    })
    const product = await simpleProductFactory(dbConnection)
    const same_end = new Date(2050, 1, 1)
    const giftCard1 = await simpleGiftCardFactory(dbConnection, {
      id: "GC_1",
      code: "GC_1",
      region_id: region.id,
      balance: 50000,
      value: 50000,
      ends_at: same_end
    })
    const giftCard2 = await simpleGiftCardFactory(dbConnection, {
      id: "GC_2",
      code: "GC_2",
      region_id: region.id,
      balance: 30000,
      value: 50000,
      ends_at: same_end
    })
    const giftCard3 = await simpleGiftCardFactory(dbConnection, {
      id: "GC_3",
      code: "GC_3",
      region_id: region.id,
      balance: 20000,
      value: 50000
    })
    
    await api.post(`/store/carts/${cart.id}/line-items`, {
      variant_id: product.variants[0].id,
      quantity: 1,
    })

    await api.post(`/store/carts/${cart.id}`, {
      email: "some@customer.com",
      gift_cards: [{ code: "GC_1" }, { code: "GC_2" }, { code: "GC_3" }],
    })

    const response = await api.post(`/store/carts/${cart.id}/complete`)
    expect(response.status).toEqual(200)
    const orderId = response.data.data.id

    const transaction1 = await dbConnection.manager.find(
      GiftCardTransaction,
      {
        order_id: orderId,
      }
    )

    expect(transaction1.length).toEqual(1)
    expect(transaction1[0].gift_card_id).toEqual(giftCard2.id)
  })
})
