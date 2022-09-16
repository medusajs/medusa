import { IdMap } from "medusa-test-utils"

export const orderEdits = {
  testCreatedOrder: {
    id: IdMap.getId("testCreatedOrder"),
    order_id: "empty-id",
    internal_note: "internal note",
    declined_reason: null,
    declined_at: null,
    declined_by: null,
    canceled_at: null,
    canceled_by: null,
    requested_at: null,
    requested_by: null,
    created_at: new Date(),
    created_by: "admin_user",
    confirmed_at: null,
    confirmed_by: null,
  },
}

export const orderEditServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation((orderId) => {
    if (orderId === IdMap.getId("testCreatedOrder")) {
      return Promise.resolve(orderEdits.testCreatedOrder)
    }
    return Promise.resolve(undefined)
  }),
  computeLineItems: jest.fn().mockImplementation((orderEdit) => {
    return Promise.resolve(orderEdit)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return orderEditServiceMock
})

export default mock
