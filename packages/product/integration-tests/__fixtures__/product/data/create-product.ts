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

/*export const createProductData: ProductTypes.CreateProductDTO = [
  {
    title: "product 1",
    description: "product 1 description",
    subtitle: "product 1 subtitle",
    is_giftcard: false,
    discountable: true,
    images: ["image 1", "image 2"],
    thumbnail: "image 1",
    status: ProductTypes.ProductStatus.PUBLISHED,
    options: [
      {
        title: "option 1",
      },
      {
        title: "option 2",
      },
    ],
    // TODO: add type, must be created first
    // TODO: add categories, must be created first
    tags: [
      {
        value: "tag 1",
      },
    ],
    variants: [
      {
        title: "variant 1",
        sku: "variant 1 sku",
      },
    ],
  },
]*/
