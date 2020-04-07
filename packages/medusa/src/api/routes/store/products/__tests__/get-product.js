import mongoose from "mongoose"
import getProduct from "../get-product"
import { request } from "../../../../../helpers/test-request"
import { IdMap } from "medusa-test-utils"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("Get product by id", () => {
  const testId = `${mongoose.Types.ObjectId("56cb91bdc3464f14678934ca")}`
  // const productServiceMock = {
  //   retrieve: jest.fn().mockImplementation(id => {
  //     if (id === testId) {
  //       return Promise.resolve({ _id: id, title: "test" })
  //     }
  //     return Promise.resolve(undefined)
  //   }),
  // }
  // const reqMock = id => {
  //   return {
  //     params: {
  //       productId: id,
  //     },
  //     scope: {
  //       resolve: jest.fn().mockImplementation(name => {
  //         if (name === "productService") {
  //           return productServiceMock
  //         }
  //         return undefined
  //       }),
  //     },
  //   }
  // }

  // const resMock = {
  //   sendStatus: jest.fn().mockReturnValue(),
  //   json: jest.fn().mockReturnValue(),
  // }

  describe("get product by id successfull", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/products/${IdMap.getId("product1")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(ProductServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("product1")
      )
    })

    it("returns product decorated", () => {
      expect(subject.body._id).toEqual(IdMap.getId("product1"))
      expect(subject.body.decorated).toEqual(true)
    })
  })
})
