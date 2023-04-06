import { FlagRouter } from "../flag-router"

describe("Flag Router", () => {
  describe("listFlags", () => {
    it("should list all feature flags", () => {
      const flagRouter = new FlagRouter({})

      flagRouter.setFlag("test", false)
      flagRouter.setFlag("test2", true)
      flagRouter.setFlag("test3", false)

      const listOfFlags = flagRouter.listFlags()

      expect(listOfFlags).toEqual([
        {
          key: "test",
          value: false,
        },
        {
          key: "test2",
          value: true,
        },
        {
          key: "test3",
          value: false,
        },
      ])
    })
  })
})
