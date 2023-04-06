import { IdMap } from "medusa-test-utils"

export const orderEdit = {
  id: IdMap.getId("testCreatedOrder"),
  order_id: IdMap.getId("test-order"),
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
}

const computeLineItems = (orderEdit) => ({
  ...orderEdit,
  items: [
    {
      id: IdMap.getId("existingLine"),
      title: "merge line",
      description: "This is a new line",
      thumbnail: "test-img-yeah.com/thumb",
      content: {
        unit_price: 123,
        variant: {
          id: IdMap.getId("can-cover"),
        },
        product: {
          id: IdMap.getId("validId"),
        },
        quantity: 1,
      },
      quantity: 10,
    },
  ],
  removedItems: [],
})
export const orderEditServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation((orderId) => {
    if (orderId === IdMap.getId("testCreatedOrder")) {
      return Promise.resolve(orderEdit)
    }
    if (orderId === IdMap.getId("testConfirmOrderEdit")) {
      return Promise.resolve({
        ...orderEdit,
        id: IdMap.getId("testConfirmOrderEdit"),
        confirmed_at: new Date(),
        confirmed_by: "admin_user",
        status: "confirmed",
      })
    }
    if (orderId === IdMap.getId("testDeclineOrderEdit")) {
      return Promise.resolve({
        ...orderEdit,
        id: IdMap.getId("testDeclineOrderEdit"),
        declined_reason: "Wrong size",
        declined_at: new Date(),
        status: "declined",
      })
    }
    if (orderId === IdMap.getId("testCompleteOrderEdit")) {
      return Promise.resolve({
        ...orderEdit,
        id: IdMap.getId("testCompleteOrderEdit"),
        confirmed_at: new Date(),
        status: "completed",
      })
    }
    if (orderId === IdMap.getId("testCancelOrderEdit")) {
      return Promise.resolve({
        ...orderEdit,
        id: orderId,
        canceled_at: new Date(),
        status: "canceled",
      })
    }
    if (orderId === IdMap.getId("testRequestOrder")) {
      return Promise.resolve({
        ...orderEdit,
        id: IdMap.getId("testRequestOrder"),
        requested_by: IdMap.getId("admin_user"),
        requested_at: new Date(),
        status: "requested",
      })
    }
    return Promise.resolve(undefined)
  }),
  listAndCount: jest.fn().mockImplementation(() => {
    return Promise.resolve([[orderEdit], 1])
  }),
  computeLineItems: jest.fn().mockImplementation((orderEdit) => {
    return Promise.resolve(computeLineItems(orderEdit))
  }),
  create: jest.fn().mockImplementation((data, context) => {
    return Promise.resolve({
      order_id: data.order_id,
      internal_note: data.internal_note,
      created_by: context.loggedInUserId,
    })
  }),
  update: jest.fn().mockImplementation((id, data) => {
    return Promise.resolve(data)
  }),
  decline: jest.fn().mockImplementation((id, reason, userId) => {
    return Promise.resolve({
      id,
      declined_reason: reason,
      declined_by: userId,
      declined_at: new Date(),
    })
  }),
  delete: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
  decorateTotals: jest.fn().mockImplementation((orderEdit) => {
    const withLineItems = computeLineItems(orderEdit)
    return Promise.resolve({
      ...withLineItems,
    })
  }),
  deleteItemChange: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
  requestConfirmation: jest.fn().mockImplementation((orderEditId, userId) => {
    return Promise.resolve({
      ...orderEdit,
      id: orderEditId,
      requested_at: new Date(),
      requested_by: userId,
    })
  }),
  cancel: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  confirm: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  complete: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  updateLineItem: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
  removeLineItem: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return orderEditServiceMock
})

export default mock
