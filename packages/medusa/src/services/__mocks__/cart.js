import { MedusaError } from "medusa-core-utils"
import { IdMap } from "medusa-test-utils"

export const carts = {
  emptyCart: {
    id: IdMap.getId("emptyCart"),
    items: [],
    region_id: IdMap.getId("testRegion"),
    shipping_options: [
      {
        id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
        data: {
          some_data: "yes",
        },
      },
    ],
  },
  testCart: {
    id: IdMap.getId("test-cart"),
    items: [],
    payment: {
      data: "some-data",
    },
    payment_session: {
      status: "authorized",
    },
    total: 1000,
    region_id: IdMap.getId("testRegion"),
  },
  testCartTaxInclusive: {
    id: IdMap.getId("test-cart"),
    items: [],
    payment: {
      data: "some-data",
    },
    payment_session: {
      status: "authorized",
    },
    total: 1000,
    region_id: IdMap.getId("testRegion"),
    shipping_options: [
      {
        id: IdMap.getId("tax-inclusive-option"),
        includes_tax: true,
      },
    ],
  },
  testSwapCart: {
    id: IdMap.getId("test-swap"),
    items: [],
    type: "swap",
    payment: {
      data: "some-data",
    },
    payment_session: {
      status: "authorized",
    },
    metadata: {
      swap_id: "test-swap",
    },
    total: 1000,
    region_id: IdMap.getId("testRegion"),
  },
  regionCart: {
    id: IdMap.getId("regionCart"),
    name: "Product 1",
    region_id: IdMap.getId("testRegion"),
  },
  frCart: {
    id: IdMap.getId("fr-cart"),
    title: "test",
    region_id: IdMap.getId("region-france"),
    items: [
      {
        id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        unit_price: 10,
        variant: {
          id: IdMap.getId("eur-10-us-12"),
        },
        product: {
          id: IdMap.getId("product"),
        },
        quantity: 10,
      },
    ],
    shipping_methods: [
      {
        id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      },
    ],
    shipping_options: [
      {
        id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  cartWithPaySessions: {
    id: IdMap.getId("cartWithPaySessions"),
    region_id: IdMap.getId("testRegion"),
    items: [
      {
        id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            id: IdMap.getId("can-cover"),
          },
          product: {
            id: IdMap.getId("product"),
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
  discountCart: {
    id: IdMap.getId("discount-cart"),
    discounts: [],
    region_id: IdMap.getId("region-france"),
    items: [
      {
        id: IdMap.getId("line"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: [
          {
            unit_price: 8,
            variant: {
              id: IdMap.getId("eur-8-us-10"),
            },
            product: {
              id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          {
            unit_price: 10,
            variant: {
              id: IdMap.getId("eur-10-us-12"),
            },
            product: {
              id: IdMap.getId("product"),
            },
            quantity: 1,
          },
        ],
        quantity: 10,
      },
      {
        id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 10,
          variant: {
            id: IdMap.getId("eur-10-us-12"),
          },
          product: {
            id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
  },
  cartWithMetadataLineItem: {
    id: IdMap.getId("cartLineItemMetadata"),
    discounts: [],
    region_id: IdMap.getId("region-france"),
    items: [
      {
        id: IdMap.getId("lineWithMetadata"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        unit_price: 10,
        variant: {
          id: IdMap.getId("eur-10-us-12"),
        },
        product: {
          id: IdMap.getId("product"),
        },
        quantity: 10,
        metadata: {
          status: "confirmed",
        },
      },
    ],
  },
}

export const CartServiceMock = {
  withTransaction: function () {
    return this
  },
  updatePaymentSession: jest.fn().mockImplementation((data) => {
    return Promise.resolve()
  }),
  authorizePayment: jest.fn().mockImplementation((id, data) => {
    if (id === IdMap.getId("test-cart2")) {
      return Promise.resolve({
        ...carts.testCart,
        payment_session: { status: "requires_more" },
        id: IdMap.getId("test-cart2"),
      })
    }
    return Promise.resolve(carts.testCart)
  }),
  refreshPaymentSession: jest.fn().mockImplementation((data) => {
    return Promise.resolve()
  }),
  update: jest.fn().mockImplementation((data) => {
    return Promise.resolve()
  }),
  create: jest.fn().mockImplementation((data) => {
    if (data.region_id === IdMap.getId("testRegion")) {
      return Promise.resolve(carts.regionCart)
    }
    if (data.region_id === IdMap.getId("fail")) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Region not found")
    }
    return Promise.resolve(carts.regionCart)
  }),
  retrieveWithTotals: jest.fn().mockImplementation((cartId) => {
    if (cartId === IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart)
    }
    if (cartId === IdMap.getId("swap-cart")) {
      return Promise.resolve(carts.testSwapCart)
    }
    if (cartId === IdMap.getId("test-cart")) {
      return Promise.resolve(carts.testCart)
    }
    if (cartId === IdMap.getId("cartLineItemMetadata")) {
      return Promise.resolve(carts.cartWithMetadataLineItem)
    }
    if (cartId === IdMap.getId("regionCart")) {
      return Promise.resolve(carts.regionCart)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    if (cartId === IdMap.getId("cartWithPaySessions")) {
      return Promise.resolve(carts.cartWithPaySessions)
    }
    if (cartId === IdMap.getId("test-cart2")) {
      return Promise.resolve(carts.testCart)
    }
    if (cartId === IdMap.getId("tax-inclusive-option")) {
      return Promise.resolve(carts.testCartTaxInclusive)
    }
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "cart not found")
  }),
  retrieve: jest.fn().mockImplementation((cartId) => {
    if (cartId === IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart)
    }
    if (cartId === IdMap.getId("swap-cart")) {
      return Promise.resolve(carts.testSwapCart)
    }
    if (cartId === IdMap.getId("test-cart")) {
      return Promise.resolve(carts.testCart)
    }
    if (cartId === IdMap.getId("cartLineItemMetadata")) {
      return Promise.resolve(carts.cartWithMetadataLineItem)
    }
    if (cartId === IdMap.getId("regionCart")) {
      return Promise.resolve(carts.regionCart)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    if (cartId === IdMap.getId("cartWithPaySessions")) {
      return Promise.resolve(carts.cartWithPaySessions)
    }
    if (cartId === IdMap.getId("test-cart2")) {
      return Promise.resolve(carts.testCart)
    }
    if (cartId === IdMap.getId("tax-inclusive-option")) {
      return Promise.resolve(carts.testCartTaxInclusive)
    }
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "cart not found")
  }),
  addLineItem: jest.fn().mockImplementation((cartId, lineItem) => {
    return Promise.resolve()
  }),
  addOrUpdateLineItems: jest.fn().mockImplementation((cartId, lineItem) => {
    return Promise.resolve()
  }),
  setPaymentMethod: jest.fn().mockImplementation((cartId, method) => {
    if (method.provider_id === "default_provider") {
      return Promise.resolve(carts.cartWithPaySessions)
    }

    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Not allowed")
  }),
  removeLineItem: jest.fn().mockImplementation((cartId, lineItem) => {
    if (cartId === IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart)
    }
    if (cartId === IdMap.getId("regionCart")) {
      return Promise.resolve(carts.regionCart)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    if (cartId === IdMap.getId("cartWithPaySessions")) {
      return Promise.resolve(carts.cartWithPaySessions)
    }
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "cart not found")
  }),
  updateLineItem: jest.fn().mockImplementation((cartId, lineItem) => {
    if (cartId === IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart)
    }
    if (cartId === IdMap.getId("cartLineItemMetadata")) {
      return Promise.resolve(carts.cartWithMetadataLineItem)
    }
    if (cartId === IdMap.getId("regionCart")) {
      return Promise.resolve(carts.regionCart)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    if (cartId === IdMap.getId("cartWithPaySessions")) {
      return Promise.resolve(carts.cartWithPaySessions)
    }
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "cart not found")
  }),
  setRegion: jest.fn().mockImplementation((cartId, regionId) => {
    if (regionId === IdMap.getId("fail")) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Region not found")
    }
    return Promise.resolve()
  }),
  updateEmail: jest.fn().mockImplementation((cartId, email) => {
    return Promise.resolve()
  }),
  updateShippingAddress: jest.fn().mockImplementation((cartId, address) => {
    return Promise.resolve()
  }),
  updateBillingAddress: jest.fn().mockImplementation((cartId, address) => {
    return Promise.resolve()
  }),
  applyDiscount: jest.fn().mockImplementation((cartId, code) => {
    return Promise.resolve()
  }),
  setPaymentSession: jest.fn().mockImplementation((cartId) => {
    return Promise.resolve()
  }),
  setPaymentSessions: jest.fn().mockImplementation((cartId) => {
    return Promise.resolve()
  }),
  setShippingOptions: jest.fn().mockImplementation((cartId) => {
    return Promise.resolve()
  }),
  decorate: jest.fn().mockImplementation((cart) => {
    cart.decorated = true
    return cart
  }),
  addShippingMethod: jest.fn().mockImplementation((cartId) => {
    return Promise.resolve()
  }),
  retrieveShippingOption: jest.fn().mockImplementation((cartId, optionId) => {
    if (optionId === IdMap.getId("freeShipping")) {
      return {
        id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      }
    }
    if (optionId === IdMap.getId("withData")) {
      return {
        id: IdMap.getId("withData"),
        profile_id: "default_profile",
        data: {
          some_data: "yes",
        },
      }
    }
  }),
  retrievePaymentSession: jest.fn().mockImplementation((cartId, providerId) => {
    if (providerId === "default_provider") {
      return {
        provider_id: "default_provider",
        data: {
          money_id: "success",
        },
      }
    }

    if (providerId === "nono") {
      return {
        provider_id: "nono",
        data: {
          money_id: "fail",
        },
      }
    }
  }),
  refreshAdjustments_: jest.fn().mockImplementation((cart) => {
    return Promise.resolve({})
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return CartServiceMock
})

export default mock
