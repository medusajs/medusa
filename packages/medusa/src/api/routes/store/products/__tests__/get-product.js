import mongoose from "mongoose"
import getProduct from "../get-product"

describe("Get product by id", () => {
  const testId = `${mongoose.Types.ObjectId("56cb91bdc3464f14678934ca")}`
  const productServiceMock = {
    getProduct: jest.fn().mockImplementation(id => {
      if (id === testId) {
        return Promise.resolve({ _id: id, title: "test" })
      }
      return Promise.resolve(undefined)
    }),
  }
  const reqMock = id => {
    return {
      params: {
        productId: id,
      },
      scope: {
        resolve: jest.fn().mockImplementation(name => {
          if (name === "productService") {
            return productServiceMock
          }
          return undefined
        }),
      },
    }
  }

  const resMock = {
    sendStatus: jest.fn().mockReturnValue(),
    json: jest.fn().mockReturnValue(),
  }

  describe("get product by id successfull", () => {
    beforeAll(async () => {
      await getProduct(reqMock(testId), resMock)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(productServiceMock.getProduct).toHaveBeenCalledTimes(1)
      expect(productServiceMock.getProduct).toHaveBeenCalledWith(testId)
    })

    it("calls res.json", () => {
      expect(resMock.json).toHaveBeenCalledTimes(1)
      expect(resMock.json).toHaveBeenCalledWith({
        _id: testId,
        title: "test",
      })
    })
  })

  describe("returns 404 when product not found", () => {
    beforeAll(async () => {
      const id = mongoose.Types.ObjectId()
      await getProduct(reqMock(`${id}`), resMock)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("return 404", () => {
      expect(resMock.sendStatus).toHaveBeenCalledTimes(1)
      expect(resMock.json).toHaveBeenCalledTimes(0)
      expect(resMock.sendStatus).toHaveBeenCalledWith(404)
    })
  })

  describe("fails when validation fails", () => {
    let res
    beforeAll(async () => {
      try {
        await getProduct(reqMock(`not object id`), resMock)
      } catch (err) {
        res = err
      }
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("return 404", () => {
      expect(res.name).toEqual("ValidationError")
    })
  })
})
