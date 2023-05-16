import { ProductTypes } from "@medusajs/types"

export const productsData = [
  {
    id: "test-1",
    title: "product 1",
    status: ProductTypes.ProductStatus.PUBLISHED,
    tags: [
      {
        id: "tag-1",
        value: "France",
      },
    ],
  },
  {
    id: "test-2",
    title: "product",
    status: ProductTypes.ProductStatus.PUBLISHED,
    tags: [
      {
        id: "tag-2",
        value: "Germany",
      },
    ],
  },
]
