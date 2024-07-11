import { defineMikroOrmCliConfig } from "../mikro-orm-cli-config-builder"

const moduleName = "myTestService"

describe("defineMikroOrmCliConfig", () => {
  test(`should throw an error if entities is not provided`, () => {
    const options = {}

    expect(() => defineMikroOrmCliConfig(moduleName, options as any)).toThrow(
      "defineMikroOrmCliConfig failed with: entities is required"
    )
  })

  test("should return the correct config", () => {
    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [{} as any],
      dbName: "medusa-fulfillment",
    })

    expect(config).toEqual({
      entities: [{}],
      type: "postgresql",
      dbName: "medusa-fulfillment",
      migrations: {
        generator: expect.any(Function),
      },
    })
  })

  test("should return the correct config inferring the databaseName", () => {
    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [{} as any],
    })

    expect(config).toEqual({
      entities: [{}],
      type: "postgresql",
      dbName: "medusa-my-test",
      migrations: {
        generator: expect.any(Function),
      },
    })
  })
})
