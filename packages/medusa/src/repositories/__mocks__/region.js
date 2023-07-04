import { IdMap } from "medusa-test-utils"

export const regions = {
  testRegion: {
    _id: IdMap.getId("testRegion"),
    name: "Test Region",
    countries: ["DK", "US", "DE"],
    tax_rate: 0.25,
    payment_providers: ["default_provider", "unregistered"],
    fulfillment_providers: ["test_shipper"],
    currency_code: "usd",
  },
  regionFrance: {
    _id: IdMap.getId("region-france"),
    name: "France",
    countries: ["FR"],
    payment_providers: ["default_provider", "france-provider"],
    currency_code: "eur",
  },
  regionUs: {
    _id: IdMap.getId("region-us"),
    name: "USA",
    countries: ["US"],
    currency_code: "usd",
  },
  regionGermany: {
    _id: IdMap.getId("region-de"),
    name: "Germany",
    countries: ["DE"],
    currency_code: "eur",
  },
  regionSweden: {
    _id: IdMap.getId("region-se"),
    name: "Sweden",
    countries: ["SE"],
    payment_providers: ["sweden_provider"],
    fulfillment_providers: ["sweden_provider"],
    currency_code: "SEK",
  },
}

export const RegionModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {}),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query.countries === "SE") {
      return Promise.resolve(regions.regionSweden)
    }

    switch (query._id) {
      case IdMap.getId("testRegion"):
        return Promise.resolve(regions.testRegion)
      case IdMap.getId("region-france"):
        return Promise.resolve(regions.regionFrance)
      case IdMap.getId("region-us"):
        return Promise.resolve(regions.regionUs)
      case IdMap.getId("region-de"):
        return Promise.resolve(regions.regionGermany)
      case IdMap.getId("region-se"):
        return Promise.resolve(regions.regionSweden)
      default:
        return Promise.resolve(undefined)
    }
  }),
}
