import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ReturnService } from "../../../../../services/__mocks__/return"
import { EventBusServiceMock } from "../../../../../services/__mocks__/event-bus"

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
            no_notification: true,
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
        no_notification: true,
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
            no_notification: true,
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
        no_notification: true,
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
          no_notification: true,
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
        no_notification: true,
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
            no_notification: true,
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
        no_notification: true,
        shipping_method: {
          option_id: "opt_1234",
          price: 12,
        },
      })

      expect(ReturnService.fulfill).toHaveBeenCalledTimes(1)
      expect(ReturnService.fulfill).toHaveBeenCalledWith("return")
    })
  })

  describe("the api call overrides notification settings of order", () => {
    it("eventBus is called with the proper no notification feature", async () => {
      jest.clearAllMocks()
      const subject = await request(
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
            no_notification: false,
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        expect.any(String),
        {
          id: expect.any(String),
          no_notification: false,
          return_id: expect.any(String),
        }
      )
    })
  })

  describe("the api call inherits notification settings of order", () => {
    it("eventBus is called with the proper no notification feature", async () => {
      jest.clearAllMocks()
      await request(
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

      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        expect.any(String),
        {
          id: expect.any(String),
          no_notification: true,
          return_id: expect.any(String),
        }
      )
    })
  })
})
