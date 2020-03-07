import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

describe("POST /store/carts/:id/line-items/:line_id", () => {
  describe("successfully updates a line item", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("emptyCart")
      const lineId = IdMap.getId("existingLine")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/line-items/${lineId}`,
        {
          payload: {
            variant_id: IdMap.getId("can-cover"),
            quantity: 3,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.updateLineItem).toHaveBeenCalledTimes(1)
    })

    it("calls LineItemService generate", () => {
      expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("can-cover"),
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
      const cartId = IdMap.getId("emptyCart")
      const lineId = IdMap.getId("existingLine")

      subject = await request(
        "POST",
        `/store/carts/${cartId}/line-items/${lineId}`,
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
