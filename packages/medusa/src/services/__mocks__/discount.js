import { IdMap } from "medusa-test-utils"

export const discounts = {
  dynamic: {
    id: IdMap.getId("dynamic"),
    code: "Something",
    is_dynamic: true,
    rule: {
      type: "percentage",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  total10Percent: {
    id: IdMap.getId("total10"),
    code: "10%OFF",
    rule: {
      type: "percentage",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  item10Percent: {
    id: IdMap.getId("item10Percent"),
    code: "MEDUSA",
    rule: {
      type: "percentage",
      allocation: "item",
      value: 10,
      valid_for: [IdMap.getId("eur-8-us-10"), IdMap.getId("eur-10-us-12")],
    },
    regions: [IdMap.getId("region-france")],
  },
  total10Fixed: {
    id: IdMap.getId("total10Fixed"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  item9Fixed: {
    id: IdMap.getId("item9Fixed"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "item",
      value: 9,
      valid_for: [IdMap.getId("eur-8-us-10"), IdMap.getId("eur-10-us-12")],
    },
    regions: [IdMap.getId("region-france")],
  },
  item2Fixed: {
    id: IdMap.getId("item2Fixed"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "item",
      value: 2,
      valid_for: [IdMap.getId("eur-8-us-10"), IdMap.getId("eur-10-us-12")],
    },
    regions: [IdMap.getId("region-france")],
  },
  item10FixedNoVariants: {
    id: IdMap.getId("item10FixedNoVariants"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "item",
      value: 10,
      valid_for: [],
    },
    regions: [IdMap.getId("region-france")],
  },
  expiredDiscount: {
    id: IdMap.getId("expired"),
    code: "MEDUSA",
    ends_at: new Date("December 17, 1995 03:24:00"),
    rule: {
      type: "fixed",
      allocation: "item",
      value: 10,
      valid_for: [],
    },
    regions: [IdMap.getId("region-france")],
  },
  freeShipping: {
    id: IdMap.getId("freeshipping"),
    code: "FREESHIPPING",
    rule: {
      type: "free_shipping",
      allocation: "total",
      value: 10,
      valid_for: [],
    },
    regions: [IdMap.getId("region-france")],
  },
  USDiscount: {
    id: IdMap.getId("us-discount"),
    code: "US10",
    rule: {
      type: "free_shipping",
      allocation: "total",
      value: 10,
      valid_for: [],
    },
    regions: [IdMap.getId("us")],
  },
  alreadyExists: {
    code: "ALREADYEXISTS",
    rule: {
      type: "percentage",
      allocation: "total",
      value: 20,
    },
    regions: [IdMap.getId("fr-cart")],
  },
}

export const DiscountServiceMock = {
  withTransaction: function() {
    return this
  },
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve(data)
  }),
  retrieveByCode: jest.fn().mockImplementation(data => {
    if (data === "10%OFF") {
      return Promise.resolve(discounts.total10Percent)
    }
    if (data === "FREESHIPPING") {
      return Promise.resolve(discounts.freeShipping)
    }
    if (data === "US10") {
      return Promise.resolve(discounts.USDiscount)
    }
    return Promise.resolve(undefined)
  }),
  retrieve: jest.fn().mockImplementation(data => {
    if (data === IdMap.getId("total10")) {
      return Promise.resolve(discounts.total10Percent)
    }
    if (data === IdMap.getId("item10Percent")) {
      return Promise.resolve(discounts.item10Percent)
    }
    if (data === IdMap.getId("freeshipping")) {
      return Promise.resolve(discounts.freeShipping)
    }
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  delete: jest.fn().mockImplementation(data => {
    return Promise.resolve({
      id: IdMap.getId("total10"),
      object: "discount",
      deleted: true,
    })
  }),
  list: jest.fn().mockImplementation(data => {
    return Promise.resolve([{}])
  }),
  listAndCount: jest.fn().mockImplementation(data => {
    return Promise.resolve([{}])
  }),
  addRegion: jest.fn().mockReturnValue(Promise.resolve()),
  removeRegion: jest.fn().mockReturnValue(Promise.resolve()),
  addValidProduct: jest.fn().mockReturnValue(Promise.resolve()),
  removeValidProduct: jest.fn().mockReturnValue(Promise.resolve()),
  generateGiftCard: jest.fn().mockReturnValue(
    Promise.resolve({
      id: IdMap.getId("gift_card_id"),
    })
  ),
}

const mock = jest.fn().mockImplementation(() => {
  return DiscountServiceMock
})

export default mock
