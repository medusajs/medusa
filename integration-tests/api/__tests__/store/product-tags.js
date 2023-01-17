const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const {
  simpleProductTagFactory,
} = require("../../factories/simple-product-tag-factory")

jest.setTimeout(30000)

describe("/store/product-tags", () => {
  let medusaProcess
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    await db.teardown()
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

  describe("GET /store/product-tags", () => {
    beforeEach(async () => {
      for (let i = 0; i < 10; i++) {
        await simpleProductTagFactory(dbConnection, {
          id: `ptag-${i}`,
          value: `tag-${i}`,
        })
      }
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("lists product tags in store", async () => {
      const api = useApi()

      const res = await api.get("/store/product-tags")

      expect(res.status).toEqual(200)
      expect(res.data.product_tags.length).toEqual(10)
    })

    it("lists product tags in store with limit", async () => {
      const api = useApi()

      const res = await api.get("/store/product-tags?limit=5")

      expect(res.status).toEqual(200)
      expect(res.data.product_tags.length).toEqual(5)
    })

    it("lists product tags in store with offset", async () => {
      const api = useApi()

      const res = await api.get("/store/product-tags?offset=5")

      expect(res.status).toEqual(200)
      expect(res.data.product_tags.length).toEqual(5)
    })

    it("lists product tags in store with offset and limit", async () => {
      const api = useApi()

      const res = await api.get("/store/product-tags?offset=5&limit=5")

      expect(res.status).toEqual(200)
      expect(res.data.product_tags.length).toEqual(5)
    })

    it("lists product tags in store where id matches query", async () => {
      const api = useApi()

      const res = await api.get("/store/product-tags?id=ptag-1")

      expect(res.status).toEqual(200)
      expect(res.data.product_tags.length).toEqual(1)
      expect(res.data.product_tags[0].id).toEqual("ptag-1")
    })

    it("lists product tags in store where value matches query", async () => {
      const api = useApi()

      const res = await api.get("/store/product-tags?value=tag-1")

      expect(res.status).toEqual(200)
      expect(res.data.product_tags.length).toEqual(1)
      expect(res.data.product_tags[0].value).toEqual("tag-1")
    })

    it("lists product tags in store where value matches free text", async () => {
      const api = useApi()

      const res = await api.get("/store/product-tags?q=tag-1")

      expect(res.status).toEqual(200)
      expect(res.data.product_tags.length).toEqual(1)
      expect(res.data.product_tags[0].value).toEqual("tag-1")
    })
  })
})
