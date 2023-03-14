import { IdMap, MockRepository } from "medusa-test-utils"

export const validProdCategoryId = "skinny-jeans"
export const invalidProdCategoryId = "not-found"
export const validProdCategoryIdWithChildren = "with-children"

export const productCategoryRepositoryMock = {
  ...MockRepository({
    create: () => Promise.resolve({
      id: IdMap.getId(validProdCategoryId)
    }),

    save: (record) => Promise.resolve(record),

    findOne: query => {
      if (query.where.id === IdMap.getId(invalidProdCategoryId)) {
        return null
      }

      if (query.where.id === IdMap.getId(validProdCategoryIdWithChildren)) {
        return Promise.resolve({
          id: IdMap.getId(validProdCategoryIdWithChildren),
          category_children: [{
            id: IdMap.getId(validProdCategoryId),
          }]
        })
      }

      return Promise.resolve({
        id: IdMap.getId(validProdCategoryId),
        category_children: []
      })
    },

    findDescendantsTree: productCategory => {
      return Promise.resolve(productCategory)
    },
  }),

  addProducts: jest.fn().mockImplementation((id, productIds) => {
    return Promise.resolve()
  }),

  removeProducts: jest.fn().mockImplementation((id, productIds) => {
    return Promise.resolve()
  }),

  getFreeTextSearchResultsAndCount: jest.fn().mockImplementation((query, q, treeSelector = {}) => {
    if (q == IdMap.getId(invalidProdCategoryId)) {
      return Promise.resolve([[], 0])
    }

    return Promise.resolve([[{ id: IdMap.getId(validProdCategoryId) }], 1])
  })
}
