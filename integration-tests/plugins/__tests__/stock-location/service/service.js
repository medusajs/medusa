const path = require("path")

const {
  startBootstrapApp,
} = require("../../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")
const { useExpressServer } = require("../../../../environment-helpers/use-api")

jest.setTimeout(30000)

describe("Stock Location Module", () => {
  let appContainer
  let dbConnection
  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    shutdownServer = await startBootstrapApp({ cwd })
    appContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    const db = useDb()
    return await db.teardown()
  })

  describe("Stock Location Module Interface", () => {
    it("create", async () => {
      const stockLocationService = appContainer.resolve("stockLocationService")

      expect(
        await stockLocationService.create({
          name: "first location",
        })
      ).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "first location",
          deleted_at: null,
          address_id: null,
          metadata: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )

      expect(
        await stockLocationService.create({
          name: "second location",
          metadata: {
            extra: "abc",
          },
          address: {
            address_1: "addr_1",
            address_2: "line 2",
            country_code: "DK",
            city: "city",
            phone: "111222333",
            province: "province",
            postal_code: "555-714",
            metadata: {
              abc: 123,
            },
          },
        })
      ).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "second location",
          metadata: {
            extra: "abc",
          },
          address_id: expect.any(String),
        })
      )
    })

    it("update", async () => {
      const stockLocationService = appContainer.resolve("stockLocationService")

      const loc = await stockLocationService.create({
        name: "location",
        address: {
          address_1: "addr_1",
          address_2: "line 2",
          country_code: "DK",
          city: "city",
          phone: "111222333",
          province: "province",
          postal_code: "555-714",
          metadata: {
            abc: 123,
          },
        },
      })
      const addressId = loc.address_id

      expect(
        await stockLocationService.retrieve(loc.id, {
          relations: ["address"],
        })
      ).toEqual(
        expect.objectContaining({
          id: loc.id,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
          name: "location",
          address_id: addressId,
          metadata: null,
          address: expect.objectContaining({
            id: addressId,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            deleted_at: null,
            address_1: "addr_1",
            address_2: "line 2",
            company: null,
            city: "city",
            country_code: "DK",
            phone: "111222333",
            province: "province",
            postal_code: "555-714",
            metadata: { abc: 123 },
          }),
        })
      )

      expect(
        await stockLocationService.update(loc.id, {
          name: "location name",
          address_id: addressId,
          address: {
            address_1: "addr_1 updated",
            country_code: "US",
          },
        })
      ).toEqual(
        expect.objectContaining({
          id: loc.id,
          name: "location name",
          address_id: addressId,
        })
      )

      expect(
        await stockLocationService.retrieve(loc.id, {
          relations: ["address"],
        })
      ).toEqual(
        expect.objectContaining({
          id: loc.id,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
          name: "location name",
          address_id: addressId,
          metadata: null,
          address: expect.objectContaining({
            id: addressId,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            deleted_at: null,
            address_1: "addr_1 updated",
            address_2: "line 2",
            company: null,
            city: "city",
            country_code: "US",
            phone: "111222333",
            province: "province",
            postal_code: "555-714",
            metadata: { abc: 123 },
          }),
        })
      )
    })

    it("updateAddress", async () => {
      const stockLocationService = appContainer.resolve("stockLocationService")

      const loc = await stockLocationService.create({
        name: "location",
        address: {
          address_1: "addr_1",
          address_2: "line 2",
          country_code: "DK",
          city: "city",
          phone: "111222333",
          province: "province",
          postal_code: "555-714",
          metadata: {
            abc: 123,
          },
        },
      })
      const addressId = loc.address_id

      expect(
        await stockLocationService.updateAddress(addressId, {
          address_1: "addr_1 updated",
          country_code: "US",
        })
      ).toEqual(
        expect.objectContaining({
          id: addressId,
          address_1: "addr_1 updated",
          address_2: "line 2",
          country_code: "US",
          city: "city",
          phone: "111222333",
          province: "province",
          postal_code: "555-714",
          metadata: {
            abc: 123,
          },
        })
      )

      expect(
        await stockLocationService.retrieve(loc.id, {
          relations: ["address"],
        })
      ).toEqual(
        expect.objectContaining({
          id: loc.id,
          address_id: addressId,
          address: expect.objectContaining({
            id: addressId,
            address_1: "addr_1 updated",
          }),
        })
      )
    })

    it("delete", async () => {
      const stockLocationService = appContainer.resolve("stockLocationService")

      const loc = await stockLocationService.create({
        name: "location",
        address: {
          address_1: "addr_1",
          address_2: "line 2",
          country_code: "DK",
          city: "city",
          phone: "111222333",
          province: "province",
          postal_code: "555-714",
          metadata: {
            abc: 123,
          },
        },
      })

      await stockLocationService.delete(loc.id)

      const deletedItem = stockLocationService.retrieve(loc.id)

      await expect(deletedItem).rejects.toThrow(
        `StockLocation with id ${loc.id} was not found`
      )
    })
  })
})
