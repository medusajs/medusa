import { IdMap } from "medusa-test-utils"
import { MedusaError } from "medusa-core-utils"

export const LineItemServiceMock = {
  withTransaction: function () {
    return this
  },
  list: jest.fn().mockImplementation((data) => {
    return Promise.resolve([])
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    return Promise.resolve({})
  }),
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ ...data })
  }),
  update: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ ...data })
  }),
  validate: jest.fn().mockImplementation((data) => {
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
            c.variant.id === match[index].variant.id &&
            c.quantity === match[index].quantity
        )
      }
    } else if (!Array.isArray(match.content)) {
      return (
        line.content.variant.id === match.content.variant.id &&
        line.content.quantity === match.content.quantity
      )
    }

    return false
  }),
  generate: jest
    .fn()
    .mockImplementation((variantId, regionId, quantity, metadata = {}) => {
      if (
        variantId === IdMap.getId("fail") ||
        regionId === IdMap.getId("fail")
      ) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "Doesn't exist")
      }

      return Promise.resolve({
        variant_id: variantId,
        unit_price: 100,
        quantity,
        metadata,
      })
    }),
  delete: jest.fn().mockImplementation(() => Promise.resolve()),
}

const mock = jest.fn().mockImplementation(() => {
  return LineItemServiceMock
})

export default mock
