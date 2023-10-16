export const productCategoriesData = [
  {
    id: "category-0",
    name: "category 0",
    parent_category_id: null,
  },
  {
    id: "category-1",
    name: "category 1",
    parent_category_id: "category-0",
  },
  {
    id: "category-1-a",
    name: "category 1 a",
    parent_category_id: "category-1",
  },
  {
    id: "category-1-b",
    name: "category 1 b",
    parent_category_id: "category-1",
    is_internal: true,
  },
  {
    id: "category-1-b-1",
    name: "category 1 b 1",
    parent_category_id: "category-1-b",
  },
]

export const productCategoriesRankData = [
  {
    id: "category-0-0",
    name: "category 0 0",
    parent_category_id: null,
    rank: 0,
  },
  {
    id: "category-0-1",
    name: "category 0 1",
    parent_category_id: null,
    rank: 1,
  },
  {
    id: "category-0-2",
    name: "category 0 2",
    parent_category_id: null,
    rank: 2,
  },
  {
    id: "category-0-0-0",
    name: "category 0 0-0",
    parent_category_id: "category-0-0",
    rank: 0,
  },
  {
    id: "category-0-0-1",
    name: "category 0 0-1",
    parent_category_id: "category-0-0",
    rank: 1,
  },
  {
    id: "category-0-0-2",
    name: "category 0 0-2",
    parent_category_id: "category-0-0",
    rank: 2,
  },
]
