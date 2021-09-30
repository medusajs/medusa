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
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  it("creates store session correctly", async () => {
    const api = useApi()

    await api
      .post("/store/customers", {
        email: "test@testesen.dk",
        password: "secret_password",
        first_name: "test",
        last_name: "testesen",
        phone: "12345678",
      })
      .catch((err) => {
        console.log(err)
      })

    const response = await api
      .post("/store/auth", {
        email: "test@testesen.dk",
        password: "secret_password",
      })
      .catch((err) => {
        console.log(err)
      })

    expect(response.status).toEqual(200)
    expect(response.data.customer.password_hash).toEqual(undefined)
    expect(response.data.customer).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      first_name: "test",
      last_name: "testesen",
      phone: "12345678",
      email: "test@testesen.dk",
    })
  })
})
