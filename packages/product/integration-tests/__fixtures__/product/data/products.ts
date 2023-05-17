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

export const variantsData = [
  {
    id: "test-1",
    title: "variant title",
    sku: "sku 1",
    product: { id: productsData[0].id },
    inventory_quantity: 10,
  },
  {
    id: "test-2",
    title: "variant title",
    sku: "sku 2",
    product: { id: productsData[1].id },
    inventory_quantity: 10,
  },
]
