import { initialize } from "../../src"
import { databaseOptions, TestDatabase } from "../utils"

describe("Product module", function () {
  beforeEach(async () => {
    await TestDatabase.setupDatabase()
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  it("should initialize", async () => {
    const module = await initialize({
      database: {
        clientUrl: databaseOptions!.clientUrl,
      },
    })

    expect(module).toBeDefined()
  })

  it("should initialize with custom data layer options", async () => {
    const module = await initialize({
      database: {
        clientUrl: "test",
      },
    })

    expect(module).toBeDefined()
  })
})
