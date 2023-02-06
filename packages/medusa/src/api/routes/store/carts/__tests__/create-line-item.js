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

    it("calls CartService retrieve", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
    })

    it("calls LineItemService generate", () => {
      expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        IdMap.getId("testRegion"),
        3,
        { metadata: undefined }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("emptyCart"))
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
        IdMap.getId("testRegion"),
        3,
        { metadata: undefined }
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
