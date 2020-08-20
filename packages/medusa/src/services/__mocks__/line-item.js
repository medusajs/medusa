import { IdMap } from "medusa-test-utils"
import { MedusaError } from "medusa-core-utils"

export const LineItemServiceMock = {
  validate: jest.fn().mockImplementation(data => {
    if (data.title === "invalid lineitem") {
      throw new Error(`"content" is required`)
    }
    return data
  }),
  generate: jest.fn().mockImplementation((variantId, quantity, regionId) => {
    if (variantId === IdMap.getId("fail") || regionId === IdMap.getId("fail")) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Doesn't exist")
    }

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
