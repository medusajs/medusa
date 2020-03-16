import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

describe("POST /store/carts/:id", () => {
  describe("successfully creates a line item", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("emptyCart")}/line-items`,
        {
          payload: {
            variant_id: IdMap.getId("testVariant"),
            quantity: 3,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.addLineItem).toHaveBeenCalledTimes(1)
    })

    it("calls LineItemService generate", () => {
      expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        3,
        IdMap.getId("testRegion")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body._id).toEqual(IdMap.getId("emptyCart"))
      expect(subject.body.decorated).toEqual(true)
    })
  })

  describe("handles unsuccessful line item generation", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/carts/${IdMap.getId("emptyCart")}/line-items`,
        {
          payload: {
            variant_id: IdMap.getId("fail"),
            quantity: 3,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls LineItemService generate", () => {
      expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("fail"),
        3,
        IdMap.getId("testRegion")
      )
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns error", () => {
      expect(subject.body.message).toEqual("Doesn't exist")
    })
  })
})
