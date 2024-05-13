import { ProductStatus } from "@medusajs/utils"
import { z } from "zod"
import { GetProductsParams } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const statusEnum = z.nativeEnum(ProductStatus)

export const AdminGetProductParams = createSelectParams()
export const AdminGetProductVariantParams = createSelectParams()
export const AdminGetProductOptionParams = createSelectParams()

export type AdminGetProductVariantsParamsType = z.infer<
  typeof AdminGetProductVariantsParams
>
export const AdminGetProductVariantsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    manage_inventory: z.boolean().optional(),
    allow_backorder: z.boolean().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetProductsParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductsParams.array()).optional(),
  })
)

export type AdminGetProductsParamsType = z.infer<typeof AdminGetProductsParams>
export const AdminGetProductsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z
    .object({
      variants: AdminGetProductVariantsParams.optional(),
      price_list_id: z.string().array().optional(),
      $and: z.lazy(() => AdminGetProductsParams.array()).optional(),
      $or: z.lazy(() => AdminGetProductsParams.array()).optional(),
    })
    .merge(GetProductsParams)
)

export type AdminGetProductOptionsParamsType = z.infer<
  typeof AdminGetProductOptionsParams
>
export const AdminGetProductOptionsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    title: z.string().optional(),
    $and: z.lazy(() => AdminGetProductsParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductsParams.array()).optional(),
  })
)

export type AdminCreateProductTagType = z.infer<typeof AdminCreateProductTag>
export const AdminCreateProductTag = z.object({
  value: z.string().optional(),
})

export type AdminUpdateProductTagType = z.infer<typeof AdminUpdateProductTag>
export const AdminUpdateProductTag = z.object({
  id: z.string().optional(),
  value: z.string().optional(),
})

export type AdminCreateProductOptionType = z.infer<
  typeof AdminCreateProductOption
>
export const AdminCreateProductOption = z.object({
  title: z.string(),
  values: z.array(z.string()),
})

export type AdminUpdateProductOptionType = z.infer<
  typeof AdminUpdateProductOption
>
export const AdminUpdateProductOption = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  values: z.array(z.string()).optional(),
})

// TODO: Add support for rules
export type AdminCreateVariantPriceType = z.infer<
  typeof AdminCreateVariantPrice
>
export const AdminCreateVariantPrice = z.object({
  currency_code: z.string(),
  amount: z.number(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
})

// TODO: Add support for rules
export type AdminUpdateVariantPriceType = z.infer<
  typeof AdminUpdateVariantPrice
>
export const AdminUpdateVariantPrice = z.object({
  id: z.string().optional(),
  currency_code: z.string().optional(),
  amount: z.number().optional(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
})

export type AdminCreateProductTypeType = z.infer<typeof AdminCreateProductType>
export const AdminCreateProductType = z.object({
  value: z.string(),
})

export type AdminCreateProductVariantType = z.infer<
  typeof AdminCreateProductVariant
>
export const AdminCreateProductVariant = z.object({
  title: z.string(),
  sku: z.string().optional(),
  ean: z.string().optional(),
  upc: z.string().optional(),
  barcode: z.string().optional(),
  hs_code: z.string().optional(),
  mid_code: z.string().optional(),
  allow_backorder: z.boolean().optional().default(false),
  manage_inventory: z.boolean().optional().default(true),
  variant_rank: z.number().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  origin_country: z.string().optional(),
  material: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  prices: z.array(AdminCreateVariantPrice),
  options: z.record(z.string()).optional(),
})

export type AdminUpdateProductVariantType = z.infer<
  typeof AdminUpdateProductVariant
>
export const AdminUpdateProductVariant = AdminCreateProductVariant.extend({
  id: z.string().optional(),
  title: z.string().optional(),
  prices: z.array(AdminUpdateVariantPrice).optional(),
  allow_backorder: z.boolean().optional(),
  manage_inventory: z.boolean().optional(),
}).strict()

export type AdminBatchUpdateProductVariantType = z.infer<
  typeof AdminBatchUpdateProductVariant
>
export const AdminBatchUpdateProductVariant = AdminUpdateProductVariant.extend({
  id: z.string(),
})

export const AdminCreateProductProductCategory = z.object({
  id: z.string(),
})

export type AdminCreateProductType = z.infer<typeof AdminCreateProduct>
export const AdminCreateProduct = z
  .object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    is_giftcard: z.boolean().optional().default(false),
    discountable: z.boolean().optional().default(true),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().optional(),
    handle: z.string().optional(),
    status: statusEnum.optional().default(ProductStatus.DRAFT),
    type_id: z.string().nullable().optional(),
    collection_id: z.string().nullable().optional(),
    categories: z.array(AdminCreateProductProductCategory).optional(),
    tags: z.array(AdminUpdateProductTag).optional(),
    options: z.array(AdminCreateProductOption).optional(),
    variants: z.array(AdminCreateProductVariant).optional(),
    sales_channels: z.array(z.object({ id: z.string() })).optional(),
    weight: z.number().optional(),
    length: z.number().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
    hs_code: z.string().optional(),
    mid_code: z.string().optional(),
    origin_country: z.string().optional(),
    material: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict()

export type AdminUpdateProductType = z.infer<typeof AdminUpdateProduct>
export const AdminUpdateProduct = AdminCreateProduct.omit({ is_giftcard: true })
  .extend({
    title: z.string().optional(),
    discountable: z.boolean().optional(),
    options: z.array(AdminUpdateProductOption).optional(),
    variants: z.array(AdminUpdateProductVariant).optional(),
    status: statusEnum.optional(),
  })
  .strict()

export type AdminBatchUpdateProductType = z.infer<
  typeof AdminBatchUpdateProduct
>
export const AdminBatchUpdateProduct = AdminUpdateProduct.extend({
  id: z.string(),
})

// TODO: Handle in create and update product once ready
// @IsOptional()
// @Type(() => ProductProductCategoryReq)
// @ValidateNested({ each: true })
// @IsArray()
// categories?: ProductProductCategoryReq[]
