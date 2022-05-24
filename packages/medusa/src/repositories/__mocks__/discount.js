import { IdMap } from "medusa-test-utils"

export const discounts = {
  dynamic: {
    _id: IdMap.getId("dynamic"),
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
    _id: IdMap.getId("total10"),
    code: "10%OFF",
    rule: {
      type: "percentage",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  item10Percent: {
    _id: IdMap.getId("item10Percent"),
    code: "MEDUSA",
    rule: {
      type: "percentage",
      allocation: "item",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  total10Fixed: {
    _id: IdMap.getId("total10Fixed"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  item9Fixed: {
    _id: IdMap.getId("item9Fixed"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "item",
      value: 9,
    },
    regions: [IdMap.getId("region-france")],
  },
  item2Fixed: {
    _id: IdMap.getId("item2Fixed"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "item",
      value: 2,
    },
    regions: [IdMap.getId("region-france")],
  },
  item10FixedNoVariants: {
    _id: IdMap.getId("item10FixedNoVariants"),
    code: "MEDUSA",
    rule: {
      type: "fixed",
      allocation: "item",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  expiredDiscount: {
    _id: IdMap.getId("expired"),
    code: "MEDUSA",
    ends_at: new Date("December 17, 1995 03:24:00"),
    rule: {
      type: "fixed",
      allocation: "item",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  freeShipping: {
    _id: IdMap.getId("freeshipping"),
    code: "FREESHIPPING",
    rule: {
      type: "free_shipping",
      allocation: "total",
      value: 10,
    },
    regions: [IdMap.getId("region-france")],
  },
  USDiscount: {
    _id: IdMap.getId("us-discount"),
    code: "US10",
    rule: {
      type: "free_shipping",
      allocation: "total",
      value: 10,
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

export const DiscountModelMock = {
  create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id === IdMap.getId("dynamic")) {
      return Promise.resolve(discounts.dynamic)
    }
    if (query._id === IdMap.getId("total10")) {
      return Promise.resolve(discounts.total10Percent)
    }
    if (query._id === IdMap.getId("item10Percent")) {
      return Promise.resolve(discounts.item10Percent)
    }
    if (query._id === IdMap.getId("total10Fixed")) {
      return Promise.resolve(discounts.total10Fixed)
    }
    if (query._id === IdMap.getId("item2Fixed")) {
      return Promise.resolve(discounts.item2Fixed)
    }
    if (query._id === IdMap.getId("item10FixedNoVariants")) {
      return Promise.resolve(discounts.item10FixedNoVariants)
    }
    if (query._id === IdMap.getId("expired")) {
      return Promise.resolve(discounts.expiredDiscount)
    }
    if (query.code === "10%OFF") {
      return Promise.resolve(discounts.total10Percent)
    }
    if (query.code === "aLrEaDyExIsts") {
      return Promise.resolve(discounts.alreadyExists)
    }
    return Promise.resolve(undefined)
  }),
}
