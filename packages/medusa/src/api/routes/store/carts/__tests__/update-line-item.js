import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

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

    it("calls LineItemService update", () => {
      expect(LineItemServiceMock.update).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.update).toHaveBeenCalledWith(
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
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("fr-cart"))
    })
  })

  describe("successfully updates a line item with metadata", () => {
    let subject

    beforeAll(async () => {
      const cartId = IdMap.getId("cartLineItemMetadata")
      const lineId = IdMap.getId("lineWithMetadata")
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

    it("calls CartService retrieve", () => {
      expect(CartServiceMock.retrieve).toHaveBeenCalledTimes(2)
    })

    it("calls LineItemService update", () => {
      expect(LineItemServiceMock.update).toHaveBeenCalledTimes(1)
      expect(LineItemServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("lineWithMetadata"),
        {
          variant_id: IdMap.getId("eur-10-us-12"),
          region_id: IdMap.getId("region-france"),
          quantity: 3,
          metadata: { status: "confirmed" },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("cartLineItemMetadata"))
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
