import { MedusaError } from "medusa-core-utils"

export const ProductVariantInventoryServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation((id) => {
    return {
      id,
    }
  }),
  listByItem: jest.fn().mockImplementation(() => {
    return []
  }),
  listByVariant: jest.fn().mockImplementation(() => {
    return []
  }),
  listVariantsByItem: jest.fn().mockImplementation(() => {
    return []
  }),
  listInventoryItemsByVariant: jest.fn().mockImplementation(() => {
    return []
  }),
  attachInventoryItem: jest.fn().mockImplementation(() => {
    return {}
  }),
  detachInventoryItem: jest.fn().mockImplementation(() => {
    return {}
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductVariantInventoryServiceMock
})

export default mock
