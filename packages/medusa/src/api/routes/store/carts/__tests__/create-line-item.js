import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

jest.mock("@medusajs/utils", () => {
  const original = jest.requireActual("@medusajs/utils")
  return {
    ...original,
    prepareLineItemData: jest
      .fn()
      .mockReturnValue({ variant_id: "item-variant", quantity: 3 }),
  }
})

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
        { quantity: 3, variant_id: "item-variant" },
        {
          customer_id: undefined,
          metadata: undefined,
          region_id: IdMap.getId("testRegion"),
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("emptyCart"))
    })
  })
})
