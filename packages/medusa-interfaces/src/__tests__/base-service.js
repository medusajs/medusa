import BaseService from "../base-service"

describe("BaseService", () => {
  describe("addDecorator", () => {
    const baseService = new BaseService()

    it("successfully adds decorator", () => {
      baseService.addDecorator(obj => {
        return (obj.decorator1 = true)
      })

      expect(baseService.decorators_.length).toEqual(1)
    })

    it("throws if decorator is not a function", () => {
      expect(() => baseService.addDecorator("not a function")).toThrow(
        "Decorators must be of type function"
      )
    })
  })

  describe("runDecorators_", () => {
    it("returns success when passwords match", async () => {
      const baseService = new BaseService()

      baseService.addDecorator(obj => {
        obj.decorator1 = true
        return obj
      })
      baseService.addDecorator(obj => {
        obj.decorator2 = true
        return obj
      })

      const result = await baseService.runDecorators_({ data: "initial" })
      expect(result).toEqual({
        data: "initial",
        decorator1: true,
        decorator2: true,
      })
    })

    it("skips failing decorator", async () => {
      const baseService = new BaseService()

      baseService.addDecorator(obj => {
        obj.decorator1 = true
        return obj
      })
      baseService.addDecorator(obj => {
        return Promise.reject("fail")
      })
      baseService.addDecorator(obj => {
        obj.decorator3 = true
        return Promise.resolve(obj)
      })

      const result = await baseService.runDecorators_({ data: "initial" })
      expect(result).toEqual({
        data: "initial",
        decorator1: true,
        decorator3: true,
      })
    })
  })
})
