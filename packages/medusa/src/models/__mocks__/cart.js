import { IdMap } from "medusa-test-utils"

export const carts = {
  emptyCart: {
    _id: IdMap.getId("emptyCart"),
    title: "test",
    region_id: IdMap.getId("testRegion"),
    items: [],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  withShippingOptions: {
    _id: IdMap.getId("withShippingOptions"),
    title: "test",
    region_id: IdMap.getId("region-france"),
    items: [],
    shipping_options: [
      {
        _id: IdMap.getId("freeShipping"),
        name: "Free Shipping",
        region_id: IdMap.getId("testRegion"),
        price: 10,
        provider_id: "test_shipper",
      },
      {
        _id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        region_id: IdMap.getId("testRegion"),
        price: 100,
        provider_id: "test_shipper",
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  cartWithPaySessionsDifRegion: {
    _id: IdMap.getId("cartWithPaySessionsDifRegion"),
    region_id: IdMap.getId("region-france"),
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    payment_sessions: [
      {
        provider_id: "default_provider",
        data: {
          id: "default_provider_session",
        },
      },
      {
        provider_id: "unregistered",
        data: {
          id: "unregistered_session",
        },
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  cartWithPaySessions: {
    _id: IdMap.getId("cartWithPaySessions"),
    region_id: IdMap.getId("testRegion"),
    shipping_methods: [],
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    payment_sessions: [
      {
        provider_id: "default_provider",
        data: {
          id: "default_provider_session",
        },
      },
      {
        provider_id: "unregistered",
        data: {
          id: "unregistered_session",
        },
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  cartWithLine: {
    _id: IdMap.getId("cartWithLine"),
    title: "test",
    region_id: IdMap.getId("testRegion"),
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  completeCart: {
    _id: IdMap.getId("complete-cart"),
    title: "test",
    region_id: IdMap.getId("region-france"),
    items: [],
    payment_method: {
      provider_id: "stripe",
      data: {
        yes: "sir",
      },
    },
    shipping_methods: [
      {
        provider_id: "gls",
        data: {
          yes: "sir",
        },
      },
    ],
    shipping_address: {
      first_name: "hi",
      last_name: "you",
      country_code: "DK",
      city: "of lights",
      address_1: "You bet street",
      postal_code: "4242",
    },
    billing_address: {
      first_name: "hi",
      last_name: "you",
      country_code: "DK",
      city: "of lights",
      address_1: "You bet street",
      postal_code: "4242",
    },
    discounts: [],
    customer_id: "",
  },
  frCart: {
    _id: IdMap.getId("fr-cart"),
    title: "test",
    region_id: IdMap.getId("region-france"),
    items: [
      {
        _id: IdMap.getId("line"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: [
          {
            unit_price: 8,
            variant: {
              _id: IdMap.getId("eur-8-us-10"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          {
            unit_price: 10,
            variant: {
              _id: IdMap.getId("eur-10-us-12"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
        ],
        quantity: 10,
      },
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 10,
          variant: {
            _id: IdMap.getId("eur-10-us-12"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    shipping_methods: [
      {
        _id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      },
    ],
    shipping_options: [
      {
        _id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
}

export const CartModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("withShippingOptions")) {
      return Promise.resolve(carts.withShippingOptions)
    }
    if (query._id === IdMap.getId("cartWithPaySessionsDifRegion")) {
      return Promise.resolve(carts.cartWithPaySessionsDifRegion)
    }
    if (query._id === IdMap.getId("cartWithPaySessions")) {
      return Promise.resolve(carts.cartWithPaySessions)
    }
    if (query._id === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    if (query._id === IdMap.getId("cartWithLine")) {
      return Promise.resolve(carts.cartWithLine)
    }
    if (query._id === IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart)
    }
    if (query._id === IdMap.getId("complete-cart")) {
      return Promise.resolve(carts.completeCart)
    }
    return Promise.resolve(undefined)
  }),
}
