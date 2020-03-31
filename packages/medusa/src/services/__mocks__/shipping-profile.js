import { IdMap } from "medusa-test-utils"

export const profiles = {
  default: {
    _id: IdMap.getId("default"),
    name: "default_profile",
    products: [],
    shipping_options: [],
  },
}

export const ShippingProfileServiceMock = {
  fetchCartOptions: jest.fn().mockImplementation(cart => {
    if (cart._id === IdMap.getId("cartWithLine")) {
      return Promise.resolve([
        {
          _id: IdMap.getId("freeShipping"),
          name: "Free Shipping",
          region_id: IdMap.getId("testRegion"),
          price: 10,
          data: {
            id: "fs",
          },
          provider_id: "test_shipper",
        },
      ])
    }
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ShippingProfileServiceMock
})

export default mock
