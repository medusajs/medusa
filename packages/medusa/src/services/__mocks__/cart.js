import { MedusaError } from "medusa-core-utils"
import { IdMap } from "medusa-test-utils"

export const carts = {
  emptyCart: {
    _id: IdMap.getId("emptyCart"),
    items: [],
  },
  regionCart: {
    _id: IdMap.getId("regionCart"),
    name: "Product 1",
    region_id: IdMap.getId("testRegion"),
  },
}

export const CartServiceMock = {
  create: jest.fn().mockImplementation(data => {
    if (data.region_id === IdMap.getId("testRegion")) {
      return Promise.resolve(carts.regionCart)
    }
    if (data.region_id === IdMap.getId("fail")) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Region not found")
    }
  }),
  retrieve: jest.fn().mockImplementation(cartId => {
    if (cartId === IdMap.getId("regionCart")) {
      return Promise.resolve(carts.regionCart)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    return Promise.resolve(undefined)
  }),
  addLineItem: jest.fn().mockImplementation((cartId, lineItem) => {
    return Promise.resolve()
  }),
  setRegion: jest.fn().mockImplementation((cartId, regionId) => {
    if (regionId === IdMap.getId("fail")) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Region not found")
    }
    return Promise.resolve()
  }),
  updateEmail: jest.fn().mockImplementation((cartId, email) => {
    return Promise.resolve()
  }),
  updateShippingAddress: jest.fn().mockImplementation((cartId, address) => {
    return Promise.resolve()
  }),
  updateBillingAddress: jest.fn().mockImplementation((cartId, address) => {
    return Promise.resolve()
  }),
  applyPromoCode: jest.fn().mockImplementation((cartId, code) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return CartServiceMock
})

export default mock
