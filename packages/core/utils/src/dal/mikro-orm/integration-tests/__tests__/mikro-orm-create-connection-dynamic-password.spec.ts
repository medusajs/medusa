import { mikroOrmCreateConnection } from "../../mikro-orm-create-connection"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""

// Passwordless URL - the dynamic password is the only credential source,
// mirroring IAM-style database authentication (e.g. AWS RDS)
const clientUrl = `postgres://${encodeURIComponent(
  DB_USERNAME
)}@${DB_HOST}:5432/postgres`

describe("mikroOrmCreateConnection | dynamic password integration", () => {
  test("connects using the password returned by the dynamic password function", async () => {
    const dynamicPassword = jest.fn().mockResolvedValue(DB_PASSWORD)

    const orm = await mikroOrmCreateConnection(
      {
        clientUrl,
        schema: "public",
        driverOptions: { dynamicPassword },
      },
      [],
      "migrations"
    )

    try {
      // mikroOrmCreateConnection initializes lazily (connect:false), so
      // executing a query forces pg to authenticate with the resolved password
      const res = (await orm.em.execute("SELECT 1 AS ok")) as any[]
      expect(res[0].ok).toBe(1)
      expect(dynamicPassword).toHaveBeenCalled()
    } finally {
      await orm.close(true)
    }
  }, 60000)
})
