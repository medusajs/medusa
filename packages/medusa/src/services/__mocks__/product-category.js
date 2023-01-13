import { MedusaError } from "medusa-core-utils"
import { IdMap } from "medusa-test-utils"

export const validProdCategoryId = "skinny-jeans"
export const invalidProdCategoryId = "not-found"

export const ProductCategoryServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ id: IdMap.getId(validProdCategoryId), ...data })
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    if (id === IdMap.getId(invalidProdCategoryId)) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "ProductCategory not found")
    }

    if (id === IdMap.getId(validProdCategoryId)) {
      return Promise.resolve({ id: IdMap.getId(validProdCategoryId) })
    }
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  update: jest.fn().mockImplementation((id, data) => {
    if (id === IdMap.getId(invalidProdCategoryId)) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "ProductCategory not found")
    }

    return Promise.resolve(Object.assign({ id }, data))
  }),
  list: jest.fn().mockImplementation((data) => {
    return Promise.resolve([{ id: IdMap.getId(validProdCategoryId) }])
  }),
  listAndCount: jest.fn().mockImplementation((data) => {
    return Promise.resolve([[{ id: IdMap.getId(validProdCategoryId) }], 1])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductCategoryServiceMock
})

export default mock
