const path = require("path")
const { Region, DiscountRule, Discount } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const { exportAllDeclaration } = require("@babel/types")

jest.setTimeout(30000)

describe("/admin/auth", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })

    await adminSeeder(dbConnection)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  it("creates admin session correctly", async () => {
    const api = useApi()

    const response = await api
      .post("/admin/auth", {
        email: "admin@medusa.js",
        password: "secret_password",
      })
      .catch((err) => {
        console.log(err)
      })

    expect(response.status).toEqual(200)
    expect(response.data.user.password_hash).toEqual(undefined)
    expect(response.data.user).toMatchSnapshot({
      email: "admin@medusa.js",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  })
})
