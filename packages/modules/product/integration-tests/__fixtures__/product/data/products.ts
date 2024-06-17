import { ProductStatus } from "@medusajs/utils"

export const productsData = [
  {
    id: "test-1",
    title: "product 1",
    status: ProductStatus.PUBLISHED,
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
    status: ProductStatus.PUBLISHED,
    tags: [
      {
        id: "tag-2",
        value: "Germany",
      },
    ],
  },
  {
    id: "test-3",
    title: "product 3",
    status: ProductStatus.PUBLISHED,
    tags: [
      {
        id: "tag-3",
        value: "Netherlands",
      },
    ],
  },
]

export const variantsData = [
  {
    id: "test-1",
    title: "variant title",
    sku: "sku 1",
    product: { id: productsData[0].id },
  },
  {
    id: "test-2",
    title: "variant title",
    sku: "sku 2",
    product: { id: productsData[1].id },
  },
]
