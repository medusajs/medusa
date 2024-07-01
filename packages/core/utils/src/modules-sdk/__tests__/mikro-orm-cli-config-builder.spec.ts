import { defineMikroOrmCliConfig } from "../mikro-orm-cli-config-builder"

describe("defineMikroOrmCliConfig", () => {
  test(`should throw an error if entities is not provided`, () => {
    const options = {
      databaseName: "medusa-fulfillment",
    }

    expect(() => defineMikroOrmCliConfig(options as any)).toThrow(
      "defineMikroOrmCliConfig failed with: entities is required"
    )
  })

  test("should throw an error if databaseName is not provided", () => {
    const options = {
      entities: [{}],
    }

    expect(() => defineMikroOrmCliConfig(options as any)).toThrow(
      "defineMikroOrmCliConfig failed with: databaseName is required"
    )
  })

  test("should return the correct config", () => {
    const config = defineMikroOrmCliConfig({
      entities: [{} as any],
      databaseName: "medusa-fulfillment",
    })

    expect(config).toEqual({
      entities: [{}],
      clientUrl: "postgres://postgres@localhost/medusa-fulfillment",
      type: "postgresql",
      migrations: {
        generator: expect.any(Function),
      },
    })
  })
})
