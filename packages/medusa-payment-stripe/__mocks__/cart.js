"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CartServiceMock = exports.carts = void 0;

var _medusaTestUtils = require("medusa-test-utils");

var carts = {
  emptyCart: {
    _id: _medusaTestUtils.IdMap.getId("emptyCart"),
    items: [],
    region_id: _medusaTestUtils.IdMap.getId("testRegion"),
    shipping_options: [{
      _id: _medusaTestUtils.IdMap.getId("freeShipping"),
      profile_id: "default_profile",
      data: {
        some_data: "yes"
      }
    }]
  },
  frCart: {
    _id: _medusaTestUtils.IdMap.getId("fr-cart"),
    title: "test",
    region_id: _medusaTestUtils.IdMap.getId("region-france"),
    items: [{
      _id: _medusaTestUtils.IdMap.getId("line"),
      title: "merge line",
      description: "This is a new line",
      thumbnail: "test-img-yeah.com/thumb",
      content: [{
        unit_price: 8,
        variant: {
          _id: _medusaTestUtils.IdMap.getId("eur-8-us-10")
        },
        product: {
          _id: _medusaTestUtils.IdMap.getId("product")
        },
        quantity: 1
      }, {
        unit_price: 10,
        variant: {
          _id: _medusaTestUtils.IdMap.getId("eur-10-us-12")
        },
        product: {
          _id: _medusaTestUtils.IdMap.getId("product")
        },
        quantity: 1
      }],
      quantity: 10
    }, {
      _id: _medusaTestUtils.IdMap.getId("existingLine"),
      title: "merge line",
      description: "This is a new line",
      thumbnail: "test-img-yeah.com/thumb",
      content: {
        unit_price: 10,
        variant: {
          _id: _medusaTestUtils.IdMap.getId("eur-10-us-12")
        },
        product: {
          _id: _medusaTestUtils.IdMap.getId("product")
        },
        quantity: 1
      },
      quantity: 10
    }],
    shipping_methods: [{
      _id: _medusaTestUtils.IdMap.getId("freeShipping"),
      profile_id: "default_profile"
    }],
    shipping_options: [{
      _id: _medusaTestUtils.IdMap.getId("freeShipping"),
      profile_id: "default_profile"
    }],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: ""
  }
};
exports.carts = carts;
var CartServiceMock = {
  retrieve: jest.fn().mockImplementation(function (cartId) {
    if (cartId === _medusaTestUtils.IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart);
    }

    if (cartId === _medusaTestUtils.IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart);
    }

    return Promise.resolve(undefined);
  })
};
exports.CartServiceMock = CartServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return CartServiceMock;
});
var _default = mock;
exports["default"] = _default;