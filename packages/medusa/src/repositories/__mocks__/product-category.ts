import { IdMap, MockRepository } from "medusa-test-utils"
import { tempReorderPosition } from "../../types/product-category"

export const validProdCategoryId = "skinny-jeans"
export const invalidProdCategoryId = "not-found"
export const validProdCategoryIdWithChildren = "with-children"
export const validProdCategoryWithSiblings = "with-siblings"
export const validProdCategoryPositionChange = "position-change"
export const validProdCategoryPositionParent = "position-parent"

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

      if (query.where.parent_category_id === IdMap.getId(validProdCategoryIdWithChildren)) {
        return null
      }

      if (query.where.id === IdMap.getId(validProdCategoryPositionChange)) {
        return Promise.resolve({
          id: IdMap.getId(validProdCategoryPositionChange),
          parent_category_id: IdMap.getId(validProdCategoryPositionParent),
          category_children: [],
          position: 1,
        })
      }

      if (query.where.id === IdMap.getId(validProdCategoryWithSiblings)) {
        return Promise.resolve({
          id: IdMap.getId(validProdCategoryWithSiblings),
          parent_category_id: IdMap.getId(validProdCategoryIdWithChildren),
          category_children: [],
        })
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

    find: query => {
      if (query.where.parent_category_id === IdMap.getId(validProdCategoryPositionParent)) {
        return Promise.resolve([{
          id: IdMap.getId(validProdCategoryWithSiblings),
          parent_category_id: IdMap.getId(validProdCategoryPositionParent),
          category_children: [],
          position: 0
        }, {
          id: IdMap.getId(validProdCategoryPositionChange),
          parent_category_id: IdMap.getId(validProdCategoryPositionParent),
          category_children: [],
          position: 1
        }])
      }

      return Promise.resolve([{
        id: IdMap.getId(validProdCategoryWithSiblings),
        category_children: [],
        position: 0
      }, {
        id: IdMap.getId(validProdCategoryId),
        category_children: [],
        position: 1
      }])
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
  }),

  countBy: jest.fn().mockImplementation((args) => {
    if (!args.parent_category_id) {
      return Promise.resolve(0)
    }

    if (args.parent_category_id === IdMap.getId(validProdCategoryPositionParent)) {
      return Promise.resolve(2)
    }

    if (args.parent_category_id === IdMap.getId(validProdCategoryIdWithChildren)) {
      return Promise.resolve(1)
    }

    return Promise.resolve(1)
  }),
}
