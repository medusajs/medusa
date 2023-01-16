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
          context: {
            clientId: "test",
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CartService create", () => {
      expect(CartServiceMock.create).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.create).toHaveBeenCalledWith({
        context: {
          ip: "::ffff:127.0.0.1",
          user_agent: "node-superagent/3.8.3",
          clientId: "test",
        },
        region_id: IdMap.getId("testRegion"),
      })
    })

    it("calls CartService retrieve", () => {
      expect(CartServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("regionCart"))
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
      expect(CartServiceMock.addOrUpdateLineItems).toHaveBeenCalledTimes(1)

      expect(LineItemServiceMock.generate).toHaveBeenCalledWith(
        [
          {
            variantId: IdMap.getId("testVariant"),
            quantity: 3,
          },
          {
            variantId: IdMap.getId("testVariant1"),
            quantity: 1,
          },
        ],
        {
          region_id: IdMap.getId("testRegion"),
          customer_id: undefined,
        }
      )
    })

    it("returns cart", () => {
      expect(subject.body.cart.id).toEqual(IdMap.getId("regionCart"))
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
