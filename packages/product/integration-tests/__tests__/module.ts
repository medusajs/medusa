import { initialize } from "../../src"

describe("Product module", function () {
  it("should initialize", async () => {
    const module = await initialize({
      database: {
        clientUrl: "test",
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
