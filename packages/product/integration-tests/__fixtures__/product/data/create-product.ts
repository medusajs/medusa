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
  type,
  tags,
  options,
}: {
  title?: string
  description?: string
  subtitle?: string
  is_giftcard?: boolean
  discountable?: boolean
  thumbnail?: string
  images?: string[] | { id?: string; url: string }[]
  status?: ProductTypes.ProductStatus
  type?: string
  tags?: { value: string }[]
  options?: { title: string }[]
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
    type: type ? { value: type } : { value: faker.commerce.productName() },
    tags: tags ?? [{ value: "tag-1" }],
    options: options ?? [
      {
        title: "option-1",
      },
    ],
    // TODO: add categories, must be created first
    // TODO: add variants
  }
}
