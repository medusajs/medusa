import { Client } from "@medusajs/deps/pg"
import { createPgConnection } from "../../../modules-sdk/create-pg-connection"
import { mikroOrmCreateConnection } from "../mikro-orm-create-connection"

const CLIENT_URL = "postgres://u@db/medusa"
const dynamicPassword = async () => "token"
const disposables: (() => Promise<unknown>)[] = []

async function create(
  database: Parameters<typeof mikroOrmCreateConnection>[0]
) {
  const orm = await mikroOrmCreateConnection(database, [], "")
  disposables.push(() => orm.close(true))
  return orm.em.getConnection().getKnex().client as any
}

describe("mikroOrmCreateConnection", () => {
  afterEach(async () => {
    await Promise.all(disposables.splice(0).map((dispose) => dispose()))
  })

  it.each([
    ["a connection string", {}],
    ["dynamicPassword", { dynamicPassword }],
  ])("resolves the database of a shared pool using %s", async (_, options) => {
    const knex = createPgConnection({
      clientUrl: CLIENT_URL,
      driverOptions: options,
    })
    disposables.push(() => knex.destroy())

    const client = await create({ connection: knex })

    expect(client.ormConfig.get("dbName")).toBe("medusa")
  })

  it.each([
    ["a URL without a password", CLIENT_URL],
    ["a URL with a password", "postgres://u:static@db/medusa"],
  ])("gives pg the password function for %s", async (_, clientUrl) => {
    const client = await create({
      clientUrl,
      driverOptions: { dynamicPassword },
    })

    expect(new Client(client.connectionSettings).password).toBe(dynamicPassword)
  })

  it("keeps MikroORM's own Postgres client and settings", async () => {
    const withoutIt = await create({
      clientUrl: "postgres://u:static@db/medusa",
      driverOptions: { connection: { ssl: false } },
    })
    const withIt = await create({
      clientUrl: CLIENT_URL,
      driverOptions: {
        dynamicPassword,
        expirationChecker: () => false,
        connection: { ssl: false },
      },
    })
    // The password is not enumerable; the type parsers are equal but
    // separate instances
    const { types: typesWithout, ...settingsWithout } =
      withoutIt.connectionSettings
    const { types: typesWith, ...settingsWith } = withIt.connectionSettings

    expect(withoutIt.connectionSettings.password).toBe("static")
    expect(withIt.constructor).toBe(withoutIt.constructor)
    expect(settingsWith).toEqual(settingsWithout)
    expect(Object.keys(typesWith.text)).toEqual(Object.keys(typesWithout.text))
    expect(Object.keys(typesWith.text).length).toBeGreaterThan(0)
    expect(withIt.config).not.toHaveProperty("dynamicPassword")
    expect(withIt.config).not.toHaveProperty("expirationChecker")
  })

  it.each([
    [undefined, { min: 2 }],
    [
      { min: 1, max: 1 },
      { min: 1, max: 1 },
    ],
  ])("keeps the database, schema and pool %j", async (pool, expected) => {
    const client = await create({
      clientUrl: CLIENT_URL,
      schema: "",
      driverOptions: { dynamicPassword },
      pool,
    })

    expect(client.ormConfig.get("dbName")).toBe("medusa")
    expect(client.ormConfig.get("schema")).toBe("public")
    expect(client.config.pool).toMatchObject(expected)
  })
})
