import { IdMap, MockRepository } from "medusa-test-utils"
import { tempReorderRank } from "../../types/product-category"

export const validProdCategoryId = "skinny-jeans"
export const invalidProdCategoryId = "not-found"
export const validProdCategoryIdWithChildren = "with-children"
export const validProdCategoryWithSiblings = "with-siblings"
export const validProdCategoryRankChange = "rank-change"
export const validProdCategoryRankParent = "rank-parent"

const findOneQuery = (query) => {
  if (query.where.id === IdMap.getId(invalidProdCategoryId)) {
    return null
  }

  if (query.where.parent_category_id === IdMap.getId(validProdCategoryIdWithChildren)) {
    return null
  }

  if (query.where.id === IdMap.getId(validProdCategoryRankChange)) {
    return Promise.resolve({
      id: IdMap.getId(validProdCategoryRankChange),
      parent_category_id: IdMap.getId(validProdCategoryRankParent),
      category_children: [],
      rank: 1,
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
      parent_category_id: null,
      category_children: [{
        id: IdMap.getId(validProdCategoryId),
      }]
    })
  }

  return Promise.resolve({
    id: IdMap.getId(validProdCategoryId),
    parent_category_id: null,
    category_children: []
  })
}

export const productCategoryRepositoryMock = {
  ...MockRepository({
    create: () => Promise.resolve({
      id: IdMap.getId(validProdCategoryId)
    }),

    save: (record) => Promise.resolve(record),

    findOne: query => {
      return findOneQuery(query)
    },

    find: query => {
      if (query.where.parent_category_id === IdMap.getId(validProdCategoryRankParent)) {
        return Promise.resolve([{
          id: IdMap.getId(validProdCategoryWithSiblings),
          parent_category_id: IdMap.getId(validProdCategoryRankParent),
          category_children: [],
          rank: 0
        }, {
          id: IdMap.getId(validProdCategoryRankChange),
          parent_category_id: IdMap.getId(validProdCategoryRankParent),
          category_children: [],
          rank: 1
        }])
      }

      return Promise.resolve([{
        id: IdMap.getId(validProdCategoryWithSiblings),
        parent_category_id: null,
        category_children: [],
        rank: 0
      }, {
        id: IdMap.getId(validProdCategoryId),
        parent_category_id: null,
        category_children: [],
        rank: 1
      }])
    },

    findDescendantsTree: productCategory => {
      return Promise.resolve(productCategory)
    },
  }),

  findOneWithDescendants: jest.fn().mockImplementation((query) => {
    return findOneQuery(query)
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

    if (args.parent_category_id === IdMap.getId(validProdCategoryRankParent)) {
      return Promise.resolve(2)
    }

    if (args.parent_category_id === IdMap.getId(validProdCategoryIdWithChildren)) {
      return Promise.resolve(1)
    }

    return Promise.resolve(1)
  }),
}
