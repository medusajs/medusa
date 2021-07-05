import { IdMap } from "medusa-test-utils"
import idMap from "medusa-test-utils/dist/id-map"

export const FulfillmentServiceMock = {
  withTransaction: function() {
    return this
  },
  retrieve: jest.fn().mockImplementation(data => {
    switch (data) {
      case IdMap.getId("order-fulfillment"):
        return Promise.resolve({ order_id: idMap.getId("test-order") })
      case IdMap.getId("swap-fulfillment"):
        return Promise.resolve({ swap_id: idMap.getId("test-swap") })
      case IdMap.getId("claim-fulfillment"):
        return Promise.resolve({ swap_id: idMap.getId("test-claim") })
    }
  }),
  cancel: jest.fn().mockImplementation(data => {
    return Promise.resolve({ order_id: idMap.getId("test-order") })
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return FulfillmentServiceMock
})

export default mock
