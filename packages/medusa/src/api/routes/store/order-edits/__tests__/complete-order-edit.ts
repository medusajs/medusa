import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"

describe("GET /store/order-edits/:id/complete", () => {
  describe("successfully complete an order edit", () => {
    const orderEditId = IdMap.getId("testRequestOrder")
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/order-edits/${orderEditId}/complete`,
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService confirm", () => {
      expect(orderEditServiceMock.confirm).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.confirm).toHaveBeenCalledWith(orderEditId, {
        loggedInUserId: undefined,
      })
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })

    it("returns orderEdit", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })

  describe("idempotently complete an order edit", () => {
    const orderEditId = IdMap.getId("testConfirmOrderEdit")
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/store/order-edits/${orderEditId}/complete`,
        {
          clientSession: {
            jwt: {
              user: IdMap.getId("lebron"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService confirm", () => {
      expect(orderEditServiceMock.confirm).toHaveBeenCalledTimes(0)
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })

    it("returns orderEdit", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })
})
