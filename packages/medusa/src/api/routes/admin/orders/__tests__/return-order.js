import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orders } from "../../../../../services/__mocks__/order"
import { ReturnService } from "../../../../../services/__mocks__/return"

describe("POST /admin/orders/:id/return", () => {
  describe("successfully returns full order", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/return`,
        {
          payload: {
            items: [
              {
                item_id: IdMap.getId("existingLine"),
                quantity: 10,
              },
            ],
            refund: 10,
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls OrderService return", () => {
      expect(ReturnService.create).toHaveBeenCalledTimes(1)
      expect(ReturnService.create).toHaveBeenCalledWith({
        order_id: IdMap.getId("test-order"),
        idempotency_key: "testkey",
        items: [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ],
        refund_amount: 10,
        shipping_method: undefined,
      })
    })
  })

  describe("defaults to 0 on negative refund amount", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/return`,
        {
          payload: {
            items: [
              {
                item_id: IdMap.getId("existingLine"),
                quantity: 10,
              },
            ],
            refund: -1,
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls OrderService return", () => {
      expect(ReturnService.create).toHaveBeenCalledTimes(1)
      expect(ReturnService.create).toHaveBeenCalledWith({
        order_id: IdMap.getId("test-order"),
        idempotency_key: "testkey",
        items: [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ],
        refund_amount: 0,
        shipping_method: undefined,
      })
    })
  })

  describe("defaults to 0 on negative refund amount", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/return`,
        {
          payload: {
            items: [
              {
                item_id: IdMap.getId("existingLine"),
                quantity: 10,
              },
            ],
            refund: -1,
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls OrderService return", () => {
      expect(ReturnService.create).toHaveBeenCalledTimes(1)
      expect(ReturnService.create).toHaveBeenCalledWith({
        order_id: IdMap.getId("test-order"),
        idempotency_key: "testkey",
        items: [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ],
        refund_amount: 0,
        shipping_method: undefined,
      })
    })
  })

  describe("fulfills", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/return`,
        {
          payload: {
            items: [
              {
                item_id: IdMap.getId("existingLine"),
                quantity: 10,
              },
            ],
            refund: 100,
            return_shipping: {
              option_id: "opt_1234",
              price: 12,
            },
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls OrderService return", () => {
      expect(ReturnService.create).toHaveBeenCalledTimes(1)
      expect(ReturnService.create).toHaveBeenCalledWith({
        order_id: IdMap.getId("test-order"),
        idempotency_key: "testkey",
        items: [
          {
            item_id: IdMap.getId("existingLine"),
            quantity: 10,
          },
        ],
        refund_amount: 100,
        shipping_method: {
          option_id: "opt_1234",
          price: 12,
        },
      })

      expect(ReturnService.fulfill).toHaveBeenCalledTimes(1)
      expect(ReturnService.fulfill).toHaveBeenCalledWith("return")
    })
  })
})
