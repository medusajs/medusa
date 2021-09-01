const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const productSeeder = require("../../helpers/product-seeder")
jest.setTimeout(30000)
describe("/store/products", () => {
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

  describe("/store/products/:id", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Fetching successfull product gives status code 200", async () => {
      const api = useApi()
      const response = await api.get("/store/products/test-product")

      expect(response.status).toEqual(200)
    })

    it("Fetching non-existing product rejects", async () => {
      const api = useApi()
      const response = async () =>
        await api.get("/store/products/non-existing-product")

      expect(response()).rejects.toBeDefined()
    })

    describe("Fetch product has default relations", () => {
      it("Includes collections", async () => {
        const api = useApi()

        const response = await api.get("/store/products/test-product")

        const product = response.data.product

        expect(response.status).toEqual(200)
        expect(product.collection).toBeDefined()
      })

      it("Includes type", async () => {
        const api = useApi()

        const response = await api.get("/store/products/test-product")

        const product = response.data.product

        expect(response.status).toEqual(200)
        expect(product.type).toBeDefined()
      })
      it("Includes tags", async () => {
        const api = useApi()

        const response = await api.get("/store/products/test-product")

        const product = response.data.product

        expect(response.status).toEqual(200)
        expect(product.tags).toBeDefined()
        expect(product.tags.every((tag) => tag.id)).toEqual(true)
      })
      it("Includes images", async () => {
        const api = useApi()

        const response = await api.get("/store/products/test-product")

        const product = response.data.product

        expect(response.status).toEqual(200)
        expect(product.images).toBeDefined()
        expect(product.images.every((image) => image.id)).toEqual(true)
      })
      it("Includes options", async () => {
        const api = useApi()

        const response = await api.get("/store/products/test-product")

        const product = response.data.product

        expect(response.status).toEqual(200)
        expect(product.options).toBeDefined()
        expect(product.options.every((option) => option.id)).toEqual(true)
      })
      it("Includes variants with prices", async () => {
        const api = useApi()

        const response = await api.get("/store/products/test-product")

        const product = response.data.product

        expect(response.status).toEqual(200)
        expect(product.variants).toBeDefined()
        expect(product.variants).not.toBeNull()
        expect(product.variants.some((variant) => variant.prices)).toEqual(true)
      })
    })
    describe("Fetch data without relation descriptions", () => {
      it("Does not include variant options", async () => {
        const api = useApi()

        const response = await api.get("/store/products/test-product")

        const product = response.data.product

        expect(response.status).toEqual(200)
        expect(product.variants).toBeDefined()
        expect(product.variants).not.toBeNull()
        expect(product.variants.options).toBeUndefined()
      })
    })
  })
})
