import { ProductTypes } from "@medusajs/types"
import { ProductStatus } from "@medusajs/utils"
import { Image } from "@models"
import faker from "faker"

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
  status?: ProductStatus
} = {}) => {
  return {
    title: title ?? faker.commerce.productName(),
    description: description ?? faker.commerce.productName(),
    subtitle: subtitle ?? faker.commerce.productName(),
    is_giftcard: is_giftcard ?? false,
    discountable: discountable ?? true,
    thumbnail: thumbnail as string,
    status: status ?? ProductStatus.PUBLISHED,
    images: (images ?? []) as Image[],
  }
}

export const buildProductAndRelationsData = ({
  title,
  description,
  subtitle,
  is_giftcard,
  discountable,
  thumbnail,
  images,
  status,
  type_id,
  tags,
  options,
  variants,
  collection_id,
}: Partial<ProductTypes.CreateProductDTO>) => {
  const defaultOptionTitle = "test-option"
  const defaultOptionValue = "test-value"

  return {
    title: title ?? faker.commerce.productName(),
    description: description ?? faker.commerce.productName(),
    subtitle: subtitle ?? faker.commerce.productName(),
    is_giftcard: is_giftcard ?? false,
    discountable: discountable ?? true,
    thumbnail: thumbnail as string,
    status: status ?? ProductStatus.PUBLISHED,
    images: (images ?? []) as Image[],
    type_id,
    tags: tags ?? [{ value: "tag-1" }],
    collection_id,
    options: options ?? [
      {
        title: defaultOptionTitle,
        values: [defaultOptionValue],
      },
    ],
    variants: variants ?? [
      {
        title: faker.commerce.productName(),
        sku: faker.commerce.productName(),
        options: {
          [defaultOptionTitle]: defaultOptionValue,
        },
      },
    ],
    // TODO: add categories, must be created first
  }
}
