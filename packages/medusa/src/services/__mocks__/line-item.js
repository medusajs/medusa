import { IdMap } from "medusa-test-utils"

export const LineItemServiceMock = {
  validate: jest.fn().mockImplementation(data => {
    if (data.title === "invalid lineitem") {
      throw new Error(`"content" is required`)
    }
    return data
  }),
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
}

const mock = jest.fn().mockImplementation(() => {
  return LineItemServiceMock
})

export default mock
