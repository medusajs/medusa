import IdMap from "../../helpers/id-map"

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
    return Promise.resolve(undefined)
  }),
}
