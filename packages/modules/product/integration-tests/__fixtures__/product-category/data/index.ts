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

export const eletronicsCategoriesData = [
  {
    id: "electronics",
    name: "Electronics",
    parent_category_id: null,
  },
  {
    id: "computers",
    name: "Computers & Accessories",
    parent_category_id: "electronics",
  },
  {
    id: "desktops",
    name: "Desktops",
    parent_category_id: "computers",
  },
  {
    id: "gaming-desktops",
    name: "Gaming Desktops",
    parent_category_id: "desktops",
  },
  {
    id: "office-desktops",
    name: "Office Desktops",
    parent_category_id: "desktops",
  },
  {
    id: "laptops",
    name: "Laptops",
    parent_category_id: "computers",
  },
  {
    id: "gaming-laptops",
    name: "Gaming Laptops",
    parent_category_id: "laptops",
  },
  {
    id: "budget-gaming",
    name: "Budget Gaming Laptops",
    parent_category_id: "gaming-laptops",
  },
  {
    id: "high-performance",
    name: "High Performance Gaming Laptops",
    parent_category_id: "gaming-laptops",
  },
  {
    id: "vr-ready",
    name: "VR-Ready High Performance Gaming Laptops",
    parent_category_id: "high-performance",
  },
  {
    id: "4k-gaming",
    name: "4K Gaming Laptops",
    parent_category_id: "high-performance",
  },
  {
    id: "ultrabooks",
    name: "Ultrabooks",
    parent_category_id: "laptops",
  },
  {
    id: "thin-light",
    name: "Thin & Light Ultrabooks",
    parent_category_id: "ultrabooks",
  },
  {
    id: "convertible-ultrabooks",
    name: "Convertible Ultrabooks",
    parent_category_id: "ultrabooks",
  },
  {
    id: "touchscreen-ultrabooks",
    name: "Touchscreen Ultrabooks",
    parent_category_id: "convertible-ultrabooks",
  },
  {
    id: "detachable-ultrabooks",
    name: "Detachable Ultrabooks",
    parent_category_id: "convertible-ultrabooks",
  },

  {
    id: "mobile",
    name: "Mobile Phones & Accessories",
    parent_category_id: "electronics",
  },
  {
    id: "smartphones",
    name: "Smartphones",
    parent_category_id: "mobile",
  },
  {
    id: "android-phones",
    name: "Android Phones",
    parent_category_id: "smartphones",
  },
  {
    id: "flagship-phones",
    name: "Flagship Smartphones",
    parent_category_id: "android-phones",
  },
  {
    id: "budget-phones",
    name: "Budget Smartphones",
    parent_category_id: "android-phones",
  },
  {
    id: "iphones",
    name: "iPhones",
    parent_category_id: "smartphones",
  },
  {
    id: "pro-phones",
    name: "Pro Models",
    parent_category_id: "iphones",
  },
  {
    id: "mini-phones",
    name: "Mini Models",
    parent_category_id: "iphones",
  },
]
