import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CartServiceMock } from "../../../../../services/__mocks__/cart"
import { LineItemServiceMock } from "../../../../../services/__mocks__/line-item"

describe("POST /store/carts", () => {
  describe("successfully creates a cart", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/store/carts`, {
        payload: {
          region_id: IdMap.getId("testRegion"),
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.create).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.create).toHaveBeenCalledWith({
        email: "",
        customer_id: "",
        region_id: IdMap.getId("testRegion"),
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart._id).toEqual(IdMap.getId("regionCart"))
      expect(subject.body.cart.decorated).toEqual(true)
    })
  })

  describe("handles failed create operation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/store/carts`, {
        payload: {
          region_id: IdMap.getId("fail"),
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns error", () => {
      expect(subject.status).toEqual(400)
      expect(subject.body.message).toEqual("Region not found")
    })
  })

  describe("creates cart with line items", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/store/carts`, {
        payload: {
          region_id: IdMap.getId("testRegion"),
          items: [
            {
              variant_id: IdMap.getId("testVariant"),
              quantity: 3,
            },
            {
              variant_id: IdMap.getId("testVariant1"),
              quantity: 1,
            },
          ],
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls line item generate", () => {
      expect(LineItemServiceMock.generate).toHaveBeenCalledTimes(2)
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        3,
        IdMap.getId("testRegion")
      )
      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        IdMap.getId("testVariant1"),
        1,
        IdMap.getId("testRegion")
      )
    })

    it("returns cart", () => {
      expect(subject.body.cart._id).toEqual(IdMap.getId("regionCart"))
      expect(subject.body.cart.decorated).toEqual(true)
    })
  })

  describe("fails if line items are not formatted correctly", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/store/carts`, {
        payload: {
          region_id: IdMap.getId("testRegion"),
          items: [
            {
              quantity: 3,
            },
            {
              variant_id: IdMap.getId("testVariant1"),
              quantity: 1,
            },
          ],
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })
  })
})
