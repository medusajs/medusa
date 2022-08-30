import { IdMap } from "medusa-test-utils"

export const regions = {
  testRegion: {
    id: IdMap.getId("testRegion"),
    name: "Test Region",
    countries: ["DK", "US", "DE"],
    tax_rate: 0.25,
    payment_providers: ["default_provider", "unregistered"],
    fulfillment_providers: ["test_shipper"],
    currency_code: "usd",
  },
  regionFrance: {
    id: IdMap.getId("region-france"),
    name: "France",
    countries: ["FR"],
    payment_providers: ["default_provider", "france-provider"],
    fulfillment_providers: ["default_provider"],
    currency_code: "eur",
    tax_rate: 0.25,
  },
  regionUs: {
    id: IdMap.getId("region-us"),
    tax_rate: 0.25,
    name: "USA",
    countries: ["US"],
    currency_code: "usd",
  },
  regionGermany: {
    id: IdMap.getId("region-de"),
    tax_rate: 0.25,
    name: "Germany",
    countries: ["DE"],
    currency_code: "eur",
  },
  regionSweden: {
    id: IdMap.getId("region-se"),
    tax_rate: 0.25,
    name: "Sweden",
    countries: ["SE"],
    currency_code: "sek",
  },
}

export const RegionServiceMock = {
  withTransaction: function () {
    return this
  },
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
    if (regionId === IdMap.getId("region-de")) {
      return Promise.resolve(regions.regionGermany)
    }
    if (regionId === IdMap.getId("region-se")) {
      return Promise.resolve(regions.regionSweden)
    }
    return Promise.resolve(regions.testRegion)
  }),
  delete: jest.fn().mockImplementation(data => Promise.resolve()),
  create: jest
    .fn()
    .mockImplementation(data => Promise.resolve({ id: "region" })),
  addCountry: jest.fn().mockImplementation(data => Promise.resolve()),
  addFulfillmentProvider: jest
    .fn()
    .mockImplementation(data => Promise.resolve()),
  addPaymentProvider: jest.fn().mockImplementation(data => Promise.resolve()),
  removeCountry: jest.fn().mockImplementation(data => Promise.resolve()),
  removeFulfillmentProvider: jest
    .fn()
    .mockImplementation(data => Promise.resolve()),
  removePaymentProvider: jest
    .fn()
    .mockImplementation(data => Promise.resolve()),
  update: jest.fn().mockImplementation(data => Promise.resolve()),
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
