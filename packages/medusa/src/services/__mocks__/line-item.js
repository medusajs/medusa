import { IdMap } from "medusa-test-utils"
import { MedusaError } from "medusa-core-utils"

export const LineItemServiceMock = {
  validate: jest.fn().mockImplementation(data => {
    if (data.title === "invalid lineitem") {
      throw new Error(`"content" is required`)
    }
    return data
  }),
  isEqual: jest.fn().mockImplementation((line, match) => {
    if (Array.isArray(line.content)) {
      if (
        Array.isArray(match.content) &&
        match.content.length === line.content.length
      ) {
        return line.content.every(
          (c, index) =>
            c.variant._id === match[index].variant._id &&
            c.quantity === match[index].quantity
        )
      }
    } else if (!Array.isArray(match.content)) {
      return (
        line.content.variant._id === match.content.variant._id &&
        line.content.quantity === match.content.quantity
      )
    }

    return false
  }),
  generate: jest.fn().mockImplementation((variantId, regionId, quantity) => {
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
