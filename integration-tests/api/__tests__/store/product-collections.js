const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const productSeeder = require("../../helpers/product-seeder")
const adminSeeder = require("../../helpers/admin-seeder")
jest.setTimeout(30000)
describe("/store/collections", () => {
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

  describe("GET /store/collections", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("fetches all collections", async () => {
      const api = useApi()

      const response = await api.get("/store/collections")

      expect(response.data.collections.length).toEqual(3)
    })

    it("respects search on title", async () => {
      const api = useApi()

      const response = await api.get("/store/collections?q=1")

      expect(response.data.collections.length).toEqual(1)
      expect(response.data.collections[0].id).toEqual("test-collection1")
    })

    it("respects search on handle", async () => {
      const api = useApi()

      const response = await api.get("/store/collections?q=two")

      expect(response.data.collections.length).toEqual(1)
      expect(response.data.collections[0].id).toEqual("test-collection2")
    })

    it(`orders and uses q parameter`, async () => {
      const api = useApi()

      const response = await api.get(`/store/collections?order=title&q=1`)

      expect(response.data.collections[0].id).toEqual("test-collection1")
    })

    describe.each([["title"], ["handle"]])(
      "Test order functionality",
      (order) => {
        it(`orders ASC for ${order}`, async () => {
          const api = useApi()

          const response = await api.get(`/store/collections?order=${order}`)

          expect(response.data.collections[0].id).toEqual("test-collection")
          expect(response.data.collections[1].id).toEqual("test-collection1")
        })

        it(`orders DESC for ${order}`, async () => {
          const api = useApi()

          const response = await api.get(`/store/collections?order=-${order}`)

          expect(response.data.collections[0].id).toEqual("test-collection2")
          expect(response.data.collections[1].id).toEqual("test-collection1")
        })
      }
    )
  })

  describe("GET /store/collections/:id", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("includes default relations", async () => {
      const api = useApi()

      const response = await api.get("/store/collections/test-collection")

      expect(response.data.collection).toEqual(
        expect.objectContaining({
          id: "test-collection",
          handle: "test-collection",
          title: "Test collection",
        })
      )
    })
  })

  describe("GET /store/collections/:id/products", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("includes default relations", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/collections/test-collection/products"
      )

      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product-copy",
            tags: [],
            type: expect.objectContaining({ id: "test-type" }),
            options: expect.arrayContaining([
              expect.objectContaining({
                id: "test-option-copy",
                values: expect.anything(),
              }),
            ]),
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant-copy",
                prices: expect.arrayContaining([
                  expect.objectContaining({ id: "test-price-copy" }),
                ]),
              }),
            ]),
          }),
        ])
      )
    })

    it("respects search on title", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/collections/test-collection/products?q=Product%202"
      )

      expect(response.data.products.length).toEqual(1)
      expect(response.data.products[0].id).toEqual("test-other-product")
    })

    it("respects search on tag id", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/collections/test-collection/products?tags[]=tag1"
      )

      expect(response.data.products.length).toEqual(1)
      expect(response.data.products[0].id).toEqual("test-other-product")
    })

    it("respects search on tag id and title", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/collections/test-collection/products?tags[]=tag1&q=copy"
      )

      expect(response.data.products.length).toEqual(0)
    })

    it(`orders and uses q parameter`, async () => {
      const api = useApi()

      const response = await api.get(
        `/store/collections/test-collection/products?order=title&q=1`
      )

      expect(response.data.products[0].id).toEqual("test-product-copy")
    })

    describe.each([["title"], ["handle"]])(
      "Test order functionality",
      (order) => {
        it(`orders ASC for ${order}`, async () => {
          const api = useApi()

          const response = await api.get(
            `/store/collections/test-collection/products?order=${order}`
          )

          expect(response.data.products[0].id).toEqual("test-product-copy")
          expect(response.data.products[1].id).toEqual("test-other-product")
        })

        it(`orders DESC for ${order}`, async () => {
          const api = useApi()

          const response = await api.get(
            `/store/collections/test-collection/products?order=-${order}`
          )

          expect(response.data.products[0].id).toEqual("test-other-product")
          expect(response.data.products[1].id).toEqual("test-product-copy")
        })
      }
    )
  })
})
