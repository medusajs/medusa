const defineConfigMock = jest.fn((config) => config)
const initMock = jest.fn(async (config) => ({ config }))

jest.mock("@medusajs/deps/mikro-orm/postgresql", () => ({
  MikroORM: { init: (config: unknown) => initMock(config) },
  defineConfig: (config: unknown) => defineConfigMock(config),
}))

import { mikroOrmCreateConnection } from "../mikro-orm-create-connection"

describe("mikroOrmCreateConnection", () => {
  const clientUrl = "postgres://localhost:5432/medusa"

  const getDriverOptions = async (
    database: Parameters<typeof mikroOrmCreateConnection>[0]
  ) => {
    await mikroOrmCreateConnection(database, [], "/migrations")
    return defineConfigMock.mock.calls.at(-1)![0].driverOptions
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should resolve unqualified SQL in a custom schema", async () => {
    const driverOptions = await getDriverOptions({
      clientUrl,
      schema: "custom",
    })

    expect(driverOptions.searchPath).toBe("custom")
  })

  it("should keep the provided driver options when setting the search path", async () => {
    const driverOptions = await getDriverOptions({
      clientUrl,
      schema: "custom",
      driverOptions: { connection: { ssl: true } },
    })

    expect(driverOptions).toEqual({
      connection: { ssl: true },
      searchPath: "custom",
    })
  })

  it("should not change the search path for the default schema", async () => {
    const driverOptions = await getDriverOptions({ clientUrl })

    expect(driverOptions).not.toHaveProperty("searchPath")
  })

  it("should leave a shared connection untouched", async () => {
    const connection = {
      context: {
        client: {
          config: {
            connection: { connectionString: clientUrl },
            searchPath: "custom",
          },
        },
      },
    }

    const driverOptions = await getDriverOptions({ connection })

    expect(driverOptions).toBe(connection)
  })
})
