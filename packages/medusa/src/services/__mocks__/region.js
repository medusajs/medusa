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
  regionFrance: {
    _id: IdMap.getId("region-france"),
    name: "France",
    countries: ["FR"],
    currency_code: "eur",
  },
  regionUs: {
    _id: IdMap.getId("region-us"),
    name: "USA",
    countries: ["US"],
    currency_code: "usd",
  },
}

export const RegionServiceMock = {
  retrieve: jest.fn().mockImplementation(regionId => {
    if (regionId === IdMap.getId("testRegion")) {
      return Promise.resolve(regions.testRegion)
    }
    if (regionId === IdMap.getId("region-france")) {
      return Promise.resolve(regions.regionFrance)
    }
    if (regionId === IdMap.getId("region-us")) {
      return Promise.resolve(regions.regionUs)
    }
    return Promise.resolve(undefined)
  }),
  list: jest.fn().mockImplementation(data => {
    return Promise.resolve([
      regions.testRegion,
      regions.regionFrance,
      regions.regionUs,
    ])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return RegionServiceMock
})

export default mock
