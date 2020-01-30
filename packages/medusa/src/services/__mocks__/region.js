import { IdMap } from "medusa-test-utils"

export const regions = {
  testRegion: {
    _id: IdMap.getId("testRegion"),
    name: "Test Region",
    countries: ["DK", "US", "DE"],
    tax_rate: 0.25,
    payment_providers: ["default_provider"],
    shipping_providers: ["test_shipper"],
    currency_code: "usd",
  },
}

export const RegionServiceMock = {
  retrieve: jest.fn().mockImplementation(regionId => {
    if (regionId === IdMap.getId("testRegion")) {
      return Promise.resolve(regions.testRegion)
    }
    return Promise.resolve(undefined)
  }),
  list: jest.fn().mockImplementation(data => {
    return Promise.resolve([regions.testRegion])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return RegionServiceMock
})

export default mock
