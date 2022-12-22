const path = require("path")

const { ReturnReason } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

jest.setTimeout(30000)

describe("/store/return-reasons", () => {
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

  describe("GET /store/return-reasons/:id", () => {
    let rrId

    beforeEach(async () => {
      const created = dbConnection.manager.create(ReturnReason, {
        value: "wrong_size",
        label: "Wrong size",
      })

      const result = await dbConnection.manager.save(created)
      rrId = result.id
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("get a return reason", async () => {
      const api = useApi()

      const response = await api
        .get(`/store/return-reasons/${rrId}`)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          id: rrId,
          value: "wrong_size",
        })
      )
    })
  })

  describe("GET /store/return-reasons", () => {
    let rrId
    let rrId_1
    let rrId_2

    beforeEach(async () => {
      const created = dbConnection.manager.create(ReturnReason, {
        value: "wrong_size",
        label: "Wrong size",
      })

      const result = await dbConnection.manager.save(created)
      rrId = result.id

      const created_child = dbConnection.manager.create(ReturnReason, {
        value: "too_big",
        label: "Too Big",
        parent_return_reason_id: rrId,
      })

      const result_child = await dbConnection.manager.save(created_child)
      rrId_1 = result_child.id

      const created_2 = dbConnection.manager.create(ReturnReason, {
        value: "too_big_1",
        label: "Too Big 1",
      })

      const result_2 = await dbConnection.manager.save(created_2)
      rrId_2 = result_2.id
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("list return reasons", async () => {
      const api = useApi()

      const response = await api.get("/store/return-reasons").catch((err) => {
        console.log(err)
      })

      expect(response.status).toEqual(200)

      expect(response.data.return_reasons).toHaveLength(2)
      expect(response.data.return_reasons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: rrId,
            value: "wrong_size",
            return_reason_children: [
              expect.objectContaining({
                id: rrId_1,
                value: "too_big",
              }),
            ],
          }),
          expect.objectContaining({
            id: rrId_2,
            value: "too_big_1",
          }),
        ])
      )
    })
  })
})
