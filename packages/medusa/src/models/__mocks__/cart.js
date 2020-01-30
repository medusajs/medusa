import { IdMap } from "medusa-test-utils"

export const carts = {
  emptyCart: {
    _id: IdMap.getId("emptyCart"),
    title: "test",
    region: IdMap.getId("testRegion"),
    items: [],
    shippingAddress: {},
    billingAddress: {},
    discounts: [],
    customer_id: "",
  },
  cartWithLine: {
    _id: IdMap.getId("emptyCart"),
    title: "test",
    region: IdMap.getId("testRegion"),
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
    shippingAddress: {},
    billingAddress: {},
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
    if (query._id === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    if (query._id === IdMap.getId("cartWithLine")) {
      return Promise.resolve(carts.cartWithLine)
    }
    return Promise.resolve(undefined)
  }),
}
