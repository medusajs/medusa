const path = require("path")

const { bootstrapApp } = require("../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../environment-helpers/use-db")
const { setPort, useApi } = require("../../../environment-helpers/use-api")

const adminSeeder = require("../../../helpers/admin-seeder")
const cartSeeder = require("../../../helpers/cart-seeder")
const {
  simpleProductFactory,
  simpleLineItemFactory,
  simpleCartFactory,
} = require("../../../factories")

jest.setTimeout(30000)

const adminHeaders = { headers: { Authorization: "Bearer test_token" } }

describe("/store/carts", () => {
  let express
  let appContainer
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    const { container, app, port } = await bootstrapApp({ cwd })
    appContainer = container

    setPort(port)
    express = app.listen(port, (err) => {
      process.send(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    express.close()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    const db = useDb()
    return await db.teardown()
  })

  describe("LineItemService", () => {
    beforeEach(async () => {})

    afterEach(async () => {
      await doAfterEach()
    })

    it("updates all line items", async () => {
      const lineItemService = appContainer.resolve("lineItemService")

      // Create 60 line items with same cart id
      const cart = await simpleCartFactory(dbConnection, {})
      const product = await simpleProductFactory(dbConnection, {})

      for (let i = 0; i < 60; i++) {
        await simpleLineItemFactory(dbConnection, {
          cart_id: cart.id,
          variant_id: product.variants[0].id,
        })
      }

      // Update all line items
      await lineItemService.update({ cart_id: cart.id }, { cart_id: null })

      const items = await lineItemService.list({
        cart_id: cart.id,
      })
      expect(items.length).toEqual(0)
    })
  })
})
