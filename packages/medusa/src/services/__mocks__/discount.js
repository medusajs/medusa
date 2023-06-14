import { IdMap } from "medusa-test-utils"

export const discounts = {
  dynamic: {
    id: IdMap.getId("dynamic"),
    code: "Something",
    is_dynamic: true,
    rule: {
      id: IdMap.getId("dynamic_rule"),
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
      id: IdMap.getId("total10_rule"),
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
      id: IdMap.getId("item10Percent_rule"),
      type: "percentage",
      allocation: "item",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  total10Fixed: {
    id: IdMap.getId("total10Fixed"),
    code: "MEDUSA",
    rule: {
      id: IdMap.getId("total10Fixed_rule"),
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
      id: IdMap.getId("item9Fixed_rule"),
      type: "fixed",
      allocation: "item",
      value: 9,
    },
    regions: [IdMap.getId("region-france")],
  },
  item2Fixed: {
    id: IdMap.getId("item2Fixed"),
    code: "MEDUSA",
    rule: {
      id: IdMap.getId("item2Fixed_rule"),
      type: "fixed",
      allocation: "item",
      value: 2,
    },
    regions: [IdMap.getId("region-france")],
  },
  item10FixedNoVariants: {
    id: IdMap.getId("item10FixedNoVariants"),
    code: "MEDUSA",
    rule: {
      id: IdMap.getId("item10FixedNoVariants_rule"),
      type: "fixed",
      allocation: "item",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  expiredDiscount: {
    id: IdMap.getId("expired"),
    code: "MEDUSA",
    ends_at: new Date("December 17, 1995 03:24:00"),
    rule: {
      id: IdMap.getId("expired_rule"),
      type: "fixed",
      allocation: "item",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  freeShipping: {
    id: IdMap.getId("freeshipping"),
    code: "FREESHIPPING",
    rule: {
      id: IdMap.getId("freeshipping_rule"),
      type: "free_shipping",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  USDiscount: {
    id: IdMap.getId("us-discount"),
    code: "US10",
    rule: {
      id: IdMap.getId("us-discount_rule"),
      type: "free_shipping",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("us")],
  },
  alreadyExists: {
    code: "ALREADYEXISTS",
    rule: {
      id: IdMap.getId("ALREADYEXISTS_rule"),
      type: "percentage",
      allocation: "total",
      value: 20,
    },
    regions: [IdMap.getId("fr-cart")],
  },
}

export const DiscountServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve(data)
  }),
  retrieveByCode: jest.fn().mockImplementation((data) => {
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
  retrieve: jest.fn().mockImplementation((data) => {
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
  update: jest.fn().mockImplementation((data) => {
    return Promise.resolve()
  }),
  delete: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: IdMap.getId("total10"),
      object: "discount",
      deleted: true,
    })
  }),
  list: jest.fn().mockImplementation((data) => {
    return Promise.resolve([{}])
  }),
  listAndCount: jest.fn().mockImplementation((data) => {
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
