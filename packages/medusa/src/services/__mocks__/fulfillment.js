import { IdMap } from "medusa-test-utils"

export const FulfillmentServiceMock = {
  withTransaction: function() {
    return this
  },
  retrieve: jest.fn().mockImplementation(data => {
    switch (data) {
      case IdMap.getId("order-fulfillment"):
        return Promise.resolve({ order_id: IdMap.getId("test-order") })
      case IdMap.getId("swap-fulfillment"):
        return Promise.resolve({ swap_id: IdMap.getId("test-swap") })
      case IdMap.getId("claim-fulfillment"):
        return Promise.resolve({ claim_order_id: IdMap.getId("test-claim") })
    }
  }),
  cancelFulfillment: jest.fn().mockImplementation(data => {
    return Promise.resolve({ order_id: IdMap.getId("test-order") })
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return FulfillmentServiceMock
})

export default mock
