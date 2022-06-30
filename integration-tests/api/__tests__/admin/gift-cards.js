const path = require("path")
const { Region, GiftCard } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/gift-cards", () => {
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

  describe("GET /admin/gift-cards", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      try {
        await adminSeeder(dbConnection)
        await manager.insert(Region, {
          id: "test-region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        })
        await manager.insert(GiftCard, {
          id: "gift_test",
          code: "GC_TEST",
          value: 20000,
          balance: 20000,
          region_id: "test-region",
        })
        await manager.insert(GiftCard, {
          id: "another_gift_test",
          code: "CARD_TEST",
          value: 200000,
          balance: 200000,
          region_id: "test-region",
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists gift cards and query count", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/gift-cards", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.gift_cards).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "gift_test",
            code: "GC_TEST",
          }),
          expect.objectContaining({
            id: "another_gift_test",
            code: "CARD_TEST",
          }),
        ])
      )
    })

    it("lists gift cards with specific query", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/gift-cards?q=gc", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.gift_cards.length).toEqual(1)
      expect(response.data.gift_cards).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "gift_test",
            code: "GC_TEST",
          }),
        ])
      )
    })

    it("lists no gift cards on query for non-existing gift card code", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/gift-cards?q=bla", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.gift_cards.length).toEqual(0)
      expect(response.data.gift_cards).toEqual([])
    })
  })

  describe("POST /admin/gift-cards", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      try {
        await adminSeeder(dbConnection)
        await manager.insert(Region, {
          id: "region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        })
        await manager.insert(GiftCard, {
          id: "gift_test",
          code: "GC_TEST",
          value: 20000,
          balance: 20000,
          region_id: "region",
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates a balance", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/gift-cards/gift_test",
          {
            balance: 0,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.gift_card.balance).toEqual(0)
    })

    it("creates a gift card", async () => {
      const api = useApi()

      const dateString = new Date().toISOString()

      const response = await api
        .post(
          "/admin/gift-cards",
          {
            value: 1000,
            region_id: "region",
            ends_at: dateString,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.gift_card.value).toEqual(1000)
      expect(response.data.gift_card.balance).toEqual(1000)
      expect(response.data.gift_card.region_id).toEqual("region")
    })
  })
})
