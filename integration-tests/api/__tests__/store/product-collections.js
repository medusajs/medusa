const { Product } = require("@medusajs/medusa")
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
    medusaProcess = await setupServer({ cwd, verbose: true })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("/store/ceollections", () => {
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

      expect(response.data.collections.length).toEqual(4)
    })
  })

  describe("/store/collections/:id", () => {
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

      expect(response.data).toMatchSnapshot({
        collection: {
          id: "test-collection",
          handle: "test-collection",
          title: "Test collection",
        },
      })
    })
  })

  describe("/store/collections/:id/products", () => {
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
            id: "test-product",
            tags: expect.arrayContaining([
              expect.objectContaining({
                id: "tag1",
              }),
            ]),
            type: expect.objectContaining({ id: "test-type" }),
            options: expect.arrayContaining([
              expect.objectContaining({
                id: "test-option",
                values: expect.anything(),
              }),
            ]),
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant",
                prices: expect.anything(),
              }),
            ]),
          }),
        ])
      )
    })

    it("respects search on title", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/collections/test-collection/products?q=copy"
      )

      expect(response.data.products.length).toEqual(1)
      expect(response.data.products[0].id).toEqual("test-product-copy")
    })

    it("respects search on tag id", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/collections/test-collection/products?tags[]=tag1"
      )

      expect(response.data.products.length).toEqual(1)
      expect(response.data.products[0].id).toEqual("test-product")
    })

    it("respects search on tag id and title", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/collections/test-collection/products?tags[]=tag1&q=copy"
      )

      expect(response.data.products.length).toEqual(0)
    })
  })
})
