import { IdMap } from "medusa-test-utils"

export const orders = {
  testOrder: {
    _id: IdMap.getId("test-order"),
    email: "oliver@test.dk",
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
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
            _id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        fulfilled_quantity: 0,
        quantity: 10,
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
    },
    shipping_methods: [
      {
        _id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        price: 100,
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
        data: {
          extra: "hi",
        },
      },
    ],
    fulfillments: [
      {
        _id: IdMap.getId("fulfillment"),
        provider_id: "default_provider",
        data: {},
      },
    ],
    fulfillment_status: "not_fulfilled",
    payment_status: "awaiting",
    status: "pending",
    metadata: {
      cart_id: IdMap.getId("test-cart"),
    },
  },
  processedOrder: {
    _id: IdMap.getId("processed-order"),
    email: "oliver@test.dk",
    tax_rate: 0,
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        returned_quantity: 0,
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
      data: {
        hi: "hi",
      },
    },
    shipping_methods: [
      {
        _id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        price: 100,
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
      },
      {
        _id: IdMap.getId("freeShipping"),
        name: "Free Shipping",
        price: 10,
        provider_id: "default_provider",
        profile_id: IdMap.getId("profile1"),
      },
    ],
    fulfillment_status: "fulfilled",
    payment_status: "captured",
    status: "completed",
  },
  returnedOrder: {
    _id: IdMap.getId("returned-order"),
    email: "oliver@test.dk",
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        returned_quantity: 0,
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
      data: {
        hi: "hi",
      },
    },
    returns: [
      {
        _id: IdMap.getId("return"),
        status: "requested",
        shipping_method: {
          _id: IdMap.getId("return-shipping"),
          is_return: true,
          name: "Return Shipping",
          region_id: IdMap.getId("region-france"),
          profile_id: IdMap.getId("default-profile"),
          data: {
            id: "return_shipment",
          },
          price: 2,
          provider_id: "default_provider",
        },
        shipping_data: {
          id: "return_shipment",
          shipped: true,
        },
        documents: ["doc1234"],
        items: [
          {
            item_id: IdMap.getId("existingLine"),
            content: {
              unit_price: 123,
              variant: {
                _id: IdMap.getId("can-cover"),
              },
              product: {
                _id: IdMap.getId("validId"),
              },
              quantity: 1,
            },
            is_requested: true,
            quantity: 10,
          },
        ],
        refund_amount: 1228,
      },
    ],
    shipping_methods: [
      {
        _id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        price: 100,
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
      },
      {
        _id: IdMap.getId("freeShipping"),
        name: "Free Shipping",
        price: 10,
        provider_id: "default_provider",
        profile_id: IdMap.getId("profile1"),
      },
    ],
    fulfillment_status: "fulfilled",
    payment_status: "captured",
    status: "completed",
  },
  orderToRefund: {
    _id: IdMap.getId("refund-order"),
    email: "oliver@test.dk",
    tax_rate: 0.25,
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 100,
          variant: {
            _id: IdMap.getId("eur-8-us-10"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
        returned_quantity: 0,
      },
      {
        _id: IdMap.getId("existingLine2"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 100,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
        returned_quantity: 0,
        metadata: {},
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
    },
    returns: [
      {
        _id: IdMap.getId("return"),
        status: "requested",
        shipping_method: {
          _id: IdMap.getId("return-shipping"),
          is_return: true,
          name: "Return Shipping",
          region_id: IdMap.getId("region-france"),
          profile_id: IdMap.getId("default-profile"),
          data: {
            id: "return_shipment",
          },
          price: 2,
          provider_id: "default_provider",
        },
        shipping_data: {
          id: "return_shipment",
          shipped: true,
        },
        documents: ["doc1234"],
        items: [
          {
            item_id: IdMap.getId("existingLine"),
            content: {
              unit_price: 100,
              variant: {
                _id: IdMap.getId("can-cover"),
              },
              product: {
                _id: IdMap.getId("product"),
              },
              quantity: 1,
            },
            is_requested: true,
            quantity: 2,
            metadata: {},
          },
        ],
        refund_amount: 246,
      },
    ],
    shipping_methods: [
      {
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
        data: {},
        items: {},
      },
    ],
    discounts: [],
  },
  shippedOrder: {
    _id: IdMap.getId("shippedOrder"),
    email: "oliver@test.dk",
    billing_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
    shipping_address: {
      first_name: "Oli",
      last_name: "Medusa",
      address_1: "testaddress",
      city: "LA",
      country_code: "US",
      postal_code: "90002",
    },
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
            _id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        fulfilled_quantity: 10,
        shipped_quantity: 0,
        quantity: 10,
      },
    ],
    region_id: IdMap.getId("region-france"),
    customer_id: IdMap.getId("test-customer"),
    payment_method: {
      provider_id: "default_provider",
    },
    shipping_methods: [
      {
        _id: IdMap.getId("expensiveShipping"),
        name: "Expensive Shipping",
        price: 100,
        provider_id: "default_provider",
        profile_id: IdMap.getId("default"),
        data: {
          extra: "hi",
        },
      },
    ],
    fulfillments: [
      {
        _id: IdMap.getId("fulfillment"),
        provider_id: "default_provider",
        data: {},
        items: [
          {
            _id: IdMap.getId("existingLine"),
            content: {
              product: {
                _id: IdMap.getId("validId"),
              },
              quantity: 1,
              unit_price: 123,
              variant: {
                _id: IdMap.getId("can-cover"),
              },
            },
            description: "This is a new line",
            fulfilled_quantity: 10,
            quantity: 10,
            thumbnail: "test-img-yeah.com/thumb",
            title: "merge line",
          },
        ],
      },
    ],
    fulfillment_status: "not_fulfilled",
    payment_status: "awaiting",
    status: "pending",
    metadata: {
      cart_id: IdMap.getId("test-cart"),
    },
  },
}

export const OrderModelMock = {
  create: jest.fn().mockImplementation(data => Promise.resolve(data)),
  updateOne: jest.fn().mockImplementation((query, update) => {
    if (query._id === IdMap.getId("returned-order")) {
      return Promise.resolve(orders.returnedOrder)
    }
    if (query._id === IdMap.getId("order-refund")) {
      orders.orderToRefund.payment_status = "captured"
      return Promise.resolve(orders.orderToRefund)
    }
    return Promise.resolve({ fulfillments: [] })
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  startSession: jest.fn().mockReturnValue(
    Promise.resolve({
      withTransaction: fn => fn(),
    })
  ),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("test-order")) {
      orders.testOrder.payment_status = "awaiting"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("not-fulfilled-order")) {
      orders.testOrder.fulfillment_status = "not_fulfilled"
      orders.testOrder.payment_status = "awaiting"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("fulfilled-order")) {
      orders.testOrder.fulfillment_status = "fulfilled"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("payed-order")) {
      orders.testOrder.fulfillment_status = "not_fulfilled"
      orders.testOrder.payment_status = "captured"
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("processed-order")) {
      return Promise.resolve(orders.processedOrder)
    }
    if (query._id === IdMap.getId("returned-order")) {
      return Promise.resolve(orders.returnedOrder)
    }
    if (query._id === IdMap.getId("order-refund")) {
      orders.orderToRefund.payment_status = "captured"
      return Promise.resolve(orders.orderToRefund)
    }
    if (query.cart_id === IdMap.getId("test-cart")) {
      return Promise.resolve(orders.testOrder)
    }
    if (query._id === IdMap.getId("shippedOrder")) {
      return Promise.resolve(orders.shippedOrder)
    }
    return Promise.resolve(undefined)
  }),
}
