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
    return Promise.resolve({
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
  }),
  create: jest.fn().mockImplementation((data, context) => {
    return Promise.resolve({
      order_id: data.order_id,
      internal_note: data.internal_note,
      created_by: context.loggedInUserId,
    })
  }),
  getTotals: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  delete: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return orderEditServiceMock
})

export default mock
