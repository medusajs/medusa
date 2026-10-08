import { createPgConnection } from "../../../../modules-sdk/create-pg-connection"
import { mikroOrmCreateConnection } from "../../mikro-orm-create-connection"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""
// No password in the URL, so only dynamicPassword can authenticate
const CLIENT_URL = `postgres://${DB_USERNAME}@${DB_HOST}/postgres`

// A server that trusts every connection never calls the function
const describeWithPassword = DB_PASSWORD ? describe : describe.skip

describeWithPassword(
  "dynamicPassword against a password-protected database",
  () => {
    const pgPassword = process.env.PGPASSWORD
    const disposables: (() => Promise<unknown>)[] = []
    const dynamicPassword = jest.fn(async () => DB_PASSWORD)

    beforeEach(() => {
      // pg falls back to PGPASSWORD, which would hide a dropped function
      delete process.env.PGPASSWORD
      dynamicPassword.mockClear()
    })

    afterEach(async () => {
      await Promise.all(disposables.splice(0).map((dispose) => dispose()))
      if (pgPassword !== undefined) {
        process.env.PGPASSWORD = pgPassword
      }
    })

    async function migrationConnection(password = dynamicPassword) {
      const orm = await mikroOrmCreateConnection(
        {
          clientUrl: CLIENT_URL,
          driverOptions: { dynamicPassword: password },
          pool: { min: 0, max: 2 },
        },
        [],
        ""
      )
      disposables.push(() => orm.close(true))
      return orm.em.getConnection()
    }

    it("authenticates every new connection in the shared pool", async () => {
      const knex = createPgConnection({
        clientUrl: CLIENT_URL,
        driverOptions: { dynamicPassword },
        pool: { min: 0, max: 2 },
      })
      disposables.push(() => knex.destroy())

      await Promise.all([1, 2].map(() => knex.raw("select pg_sleep(0.2)")))

      expect(dynamicPassword).toHaveBeenCalledTimes(2)
    })

    it("authenticates every new connection opened for migrations", async () => {
      const connection = await migrationConnection()

      await Promise.all(
        [1, 2].map(() => connection.execute("select pg_sleep(0.2)"))
      )

      expect(dynamicPassword).toHaveBeenCalledTimes(2)
    })

    it("reports a rejected password for migrations without retrying", async () => {
      const wrongPassword = jest.fn(async () => "wrong")
      const connection = await migrationConnection(wrongPassword)

      await expect(connection.execute("select 1")).rejects.toThrow(
        /password authentication failed/
      )
      expect(wrongPassword).toHaveBeenCalledTimes(1)
    })
  }
)
