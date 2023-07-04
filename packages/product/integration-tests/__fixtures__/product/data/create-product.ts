import { ProductTypes } from "@medusajs/types"
import faker from "faker"
import { Image } from "@models"

export const buildProductOnlyData = ({
  title,
  description,
  subtitle,
  is_giftcard,
  discountable,
  thumbnail,
  images,
  status,
}: {
  title?: string
  description?: string
  subtitle?: string
  is_giftcard?: boolean
  discountable?: boolean
  thumbnail?: string
  images?: { id?: string; url: string }[]
  status?: ProductTypes.ProductStatus
}) => {
  return {
    title: title ?? faker.commerce.productName(),
    description: description ?? faker.commerce.productName(),
    subtitle: subtitle ?? faker.commerce.productName(),
    is_giftcard: is_giftcard ?? false,
    discountable: discountable ?? true,
    thumbnail: thumbnail as string,
    status: status ?? ProductTypes.ProductStatus.PUBLISHED,
    images: (images ?? []) as Image[],
    // TODO: add type, must be created first
    // TODO: add categories, must be created first
    // TODO: add tags, must be created first
  }
}

export const buildProductData = ({
  title,
  description,
  subtitle,
  is_giftcard,
  discountable,
  thumbnail,
  images,
  status,
  manage_inventory,
  inventory_quantity,
  type,
  tags,
  options,
  variants,
}: {
  title?: string
  description?: string
  subtitle?: string
  is_giftcard?: boolean
  discountable?: boolean
  thumbnail?: string
  images?: string[] | { id?: string; url: string }[]
  status?: ProductTypes.ProductStatus
  manage_inventory?: boolean
  inventory_quantity?: number
  type?: string
  tags?: { value: string }[]
  options?: { title: string }[]
  variants?: ProductTypes.CreateProductVariantDTO[]
}) => {
  const defaultOptionTitle = faker.commerce.productName()
  return {
    title: title ?? faker.commerce.productName(),
    description: description ?? faker.commerce.productName(),
    subtitle: subtitle ?? faker.commerce.productName(),
    is_giftcard: is_giftcard ?? false,
    discountable: discountable ?? true,
    thumbnail: thumbnail as string,
    status: status ?? ProductTypes.ProductStatus.PUBLISHED,
    images: (images ?? []) as Image[],
    type: type ? { value: type } : { value: faker.commerce.productName() },
    tags: tags ?? [{ value: "tag-1" }],
    inventory_quantity,
    manage_inventory,
    options: options ?? [
      {
        title: defaultOptionTitle,
      },
    ],
    variants: variants ?? [
      {
        title: faker.commerce.productName(),
        sku: faker.commerce.productName(),
        options: [
          {
            value: defaultOptionTitle + faker.commerce.productName(),
          },
        ],
      },
    ],
    // TODO: add categories, must be created first
    // TODO: add variants
  }
}
