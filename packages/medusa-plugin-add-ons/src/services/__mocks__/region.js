import { IdMap } from "medusa-test-utils"

export const regions = {
  testRegion: {
    _id: IdMap.getId("world"),
    name: "Test Region",
    countries: ["DK", "US", "DE"],
    tax_rate: 0.25,
    payment_providers: ["default_provider", "unregistered"],
    fulfillment_providers: ["test_shipper"],
    currency_code: "DKK",
  },
}

export const RegionServiceMock = {
  retrieve: jest.fn().mockImplementation((regionId) => {
    if (regionId === IdMap.getId("world")) {
      return Promise.resolve(regions.testRegion)
    }
    throw Error(regionId + "not found")
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return RegionServiceMock
})

export default mock
