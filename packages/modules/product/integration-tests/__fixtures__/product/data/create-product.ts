import { ProductTypes } from "@zjedene-medusa/framework/types"
import { ProductStatus, toHandle } from "@zjedene-medusa/framework/utils"
import { ProductImage } from "@models"
import faker from "faker"

export const buildProductOnlyData = ({
  title,
  handle,
  description,
  subtitle,
  is_giftcard,
  discountable,
  thumbnail,
  images,
  status,
}: {
  title?: string
  handle?: string
  description?: string
  subtitle?: string
  is_giftcard?: boolean
  discountable?: boolean
  thumbnail?: string
  images?: { id?: string; url: string }[]
  status?: ProductStatus
} = {}) => {
  title ??= faker.commerce.productName()
  return {
    title: title as string,
    handle: handle ?? toHandle(title!),
    description: description ?? faker.commerce.productName(),
    subtitle: subtitle ?? faker.commerce.productName(),
    is_giftcard: is_giftcard ?? false,
    discountable: discountable ?? true,
    thumbnail: thumbnail as string,
    status: status ?? ProductStatus.PUBLISHED,
    images: (images ?? []) as ProductImage[],
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
  tag_ids,
  options,
  variants,
  collection_id,
}: Partial<ProductTypes.CreateProductDTO> & { tags?: { value: string }[] }) => {
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
    images: (images ?? []) as ProductImage[],
    type_id,
    tag_ids,
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
        options: options
          ? options.reduce((acc, option) => {
              acc[option.title] = option.values[0]
              return acc
            }, {} as Record<string, string>)
          : {
              [defaultOptionTitle]: defaultOptionValue,
            },
      },
    ],
    // TODO: add categories, must be created first
  }
}
