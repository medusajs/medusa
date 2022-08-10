import { IdMap } from "medusa-test-utils"

export const carts = {
  emptyCart: {
    id: IdMap.getId("emptyCart"),
    items: [],
    region_id: IdMap.getId("testRegion"),
    customer_id: "test-customer",
    payment_sessions: [],
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
  frCart: {
    id: IdMap.getId("fr-cart"),
    email: "lebron@james.com",
    title: "test",
    region_id: IdMap.getId("region-france"),
    items: [
      {
        id: IdMap.getId("line"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",

        unit_price: 8,
        variant: {
          id: IdMap.getId("eur-8-us-10"),
        },
        product: {
          id: IdMap.getId("product"),
        },
        // {
        //   unit_price: 10,
        //   variant: {
        //     id: IdMap.getId("eur-10-us-12"),
        //   },
        //   product: {
        //     id: IdMap.getId("product"),
        //   },
        //   quantity: 1,
        // },
        quantity: 10,
      },
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
        quantity: 1,
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
    payment_sessions: [
      {
        provider_id: "stripe",
        data: {
          id: "pi_123456789",
          customer: IdMap.getId("not-lebron"),
        },
      },
    ],
    payment_method: {
      provider_id: "stripe",
      data: {
        id: "pi_123456789",
        customer: IdMap.getId("not-lebron"),
      },
    },
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: IdMap.getId("lebron"),
    context: {}
  },
  frCartNoStripeCustomer: {
    id: IdMap.getId("fr-cart-no-customer"),
    title: "test",
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
    payment_sessions: [
      {
        provider_id: "stripe",
        data: {
          id: "pi_no",
          customer: IdMap.getId("not-lebron"),
        },
      },
    ],
    payment_method: {
      provider_id: "stripe",
      data: {
        id: "pi_no",
        customer: IdMap.getId("not-lebron"),
      },
    },
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: IdMap.getId("vvd"),
  },
}

export const CartServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation((cartId) => {
    if (cartId === IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart)
    }
    if (cartId === IdMap.getId("fr-cart-no-customer")) {
      return Promise.resolve(carts.frCartNoStripeCustomer)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    return Promise.resolve(undefined)
  }),
  updatePaymentSession: jest
    .fn()
    .mockImplementation((cartId, stripe, paymentIntent) => {
      return Promise.resolve()
    }),
}

const mock = jest.fn().mockImplementation(() => {
  return CartServiceMock
})

export default mock
