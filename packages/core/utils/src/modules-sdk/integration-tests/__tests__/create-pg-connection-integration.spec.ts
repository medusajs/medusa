import { createPgConnection } from "../../create-pg-connection"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""

// Passwordless URL - the dynamic password is the only credential source,
// mirroring IAM-style database authentication (e.g. AWS RDS)
const clientUrl = `postgres://${encodeURIComponent(
  DB_USERNAME
)}@${DB_HOST}:5432/postgres`

describe("createPgConnection | integration", () => {
  let knex: ReturnType<typeof createPgConnection>

  afterEach(async () => {
    await knex?.destroy()
  })

  test("authenticates using the password returned by the dynamic password function", async () => {
    const dynamicPassword = jest.fn().mockResolvedValue(DB_PASSWORD)

    knex = createPgConnection({
      clientUrl,
      driverOptions: { dynamicPassword },
    })

    const result = await knex.raw("SELECT 1 AS ok")

    expect(result.rows[0].ok).toBe(1)
    // the bug being guarded against: pg silently discards the password
    // function when a connectionString is also provided, so it never runs
    expect(dynamicPassword).toHaveBeenCalled()
  })
})
