import { IdMap } from "medusa-test-utils"

export const LineItemServiceMock = {
  generate: jest.fn().mockImplementation((variantId, quantity, regionId) => {
    return Promise.resolve({
      content: {
        variant: {
          _id: variantId,
        },
        product: {
          _id: `p_${variantId}`,
        },
        quantity: 1,
        unit_price: 100,
      },
      quantity,
    })
  }),
  validate: jest.fn().mockImplementation(cartId => {
    if (cartId === IdMap.getId("regionCart")) {
      return Promise.resolve(carts.regionCart)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return LineItemServiceMock
})

export default mock
