import { IdMap } from "medusa-test-utils"

export const RegionServiceMock = {
  retrieve: jest.fn().mockImplementation((regionId) => {
    return Promise.resolve({
      _id: IdMap.getId("testRegion"),
      name: "Test Region",
      countries: ["DK", "US", "DE"],
      tax_rate: 0.25,
      payment_providers: ["default_provider", "unregistered"],
      fulfillment_providers: ["test_shipper"],
      currency_code: "usd",
    })
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return RegionServiceMock
})

export default mock
