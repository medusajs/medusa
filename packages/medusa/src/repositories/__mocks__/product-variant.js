import { IdMap } from "medusa-test-utils"

export const ProductVariantModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("validId")) {
      return Promise.resolve({
        _id: IdMap.getId("validId"),
        title: "test",
      })
    }
    if (query._id === IdMap.getId("testVariant")) {
      return Promise.resolve({
        _id: IdMap.getId("testVariant"),
        title: "test",
      })
    }
    if (query._id === IdMap.getId("deleteId")) {
      return Promise.resolve({
        _id: IdMap.getId("deleteId"),
        title: "test",
      })
    }
    if (query._id === IdMap.getId("failId")) {
      return Promise.reject(new Error("test error"))
    }
    if (query._id === IdMap.getId("inventory-test")) {
      return Promise.resolve({
        _id: IdMap.getId("inventory-test"),
        title: "inventory",
        allow_backorder: false,
        manage_inventory: true,
      })
    }
    if (query._id === IdMap.getId("no-inventory-test")) {
      return Promise.resolve({
        _id: IdMap.getId("no-inventory-test"),
        title: "inventory",
        allow_backorder: false,
        manage_inventory: false,
      })
    }
    if (query._id === IdMap.getId("backorder-test")) {
      return Promise.resolve({
        _id: IdMap.getId("backorder-test"),
        title: "inventory",
        allow_backorder: true,
        manage_inventory: true,
      })
    }

    if (query._id === IdMap.getId("no-prices")) {
      return Promise.resolve({
        _id: IdMap.getId("no-prices"),
        title: "No Prices",
        prices: [],
      })
    }

    if (query._id === IdMap.getId("eur-prices")) {
      return Promise.resolve({
        _id: IdMap.getId("eur-prices"),
        title: "eur Prices",
        prices: [
          {
            currency_code: "eur",
            amount: 1000,
          },
          {
            region_id: IdMap.getId("region-france"),
            currency_code: "eur",
            amount: 950,
          },
        ],
      })
    }

    if (query._id === IdMap.getId("france-prices")) {
      return Promise.resolve({
        _id: IdMap.getId("france-prices"),
        title: "France Prices",
        prices: [
          {
            currency_code: "eur",
            amount: 1000,
          },
          {
            region_id: IdMap.getId("region-france"),
            currency_code: "eur",
            amount: 950,
          },
          {
            region_id: IdMap.getId("region-us"),
            currency_code: "usd",
            amount: 1200,
          },
        ],
      })
    }

    return Promise.resolve(undefined)
  }),
}
