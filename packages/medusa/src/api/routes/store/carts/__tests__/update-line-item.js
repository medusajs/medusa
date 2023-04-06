import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"

describe("POST /store/carts/:id/line-items/:line_id", () => {
  describe("successfully updates a line item", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("fr-cart")
      const lineId = IdMap.getId("existingLine")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/line-items/${lineId}`,
        {
          payload: {
            quantity: 3,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls cartService.updateLineItem", () => {
      expect(CartServiceMock.updateLineItem).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.updateLineItem).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        IdMap.getId("existingLine"),
        {
          variant_id: IdMap.getId("eur-10-us-12"),
          region_id: IdMap.getId("region-france"),
          quantity: 3,
          metadata: {},
        }
      )
    })

    it("calls CartService retrieve", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(2)
      expect(CartServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("fr-cart"))
    })
  })

  describe("removes line item on quantity 0", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("fr-cart")
      const lineId = IdMap.getId("existingLine")
      subject = await request(
        "POST",
        `/store/carts/${cartId}/line-items/${lineId}`,
        {
          payload: {
            quantity: 0,
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.removeLineItem).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.removeLineItem).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        IdMap.getId("existingLine")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("fr-cart"))
    })
  })
})
