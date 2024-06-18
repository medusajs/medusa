import { BatchMethodRequest } from "@medusajs/types"
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
      status: statusEnum.array().optional(),
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
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetProductsParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductsParams.array()).optional(),
  })
)

export type AdminCreateProductTagType = z.infer<typeof AdminCreateProductTag>
export const AdminCreateProductTag = z.object({
  value: z.string(),
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
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
})

// TODO: Add support for rules
export type AdminUpdateVariantPriceType = z.infer<
  typeof AdminUpdateVariantPrice
>
export const AdminUpdateVariantPrice = z.object({
  id: z.string().optional(),
  currency_code: z.string().optional(),
  amount: z.number().optional(),
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
})

export type AdminCreateProductTypeType = z.infer<typeof AdminCreateProductType>
export const AdminCreateProductType = z.object({
  value: z.string(),
})

export type AdminCreateProductVariantType = z.infer<
  typeof AdminCreateProductVariant
>
export const AdminCreateProductVariant = z
  .object({
    title: z.string(),
    sku: z.string().nullish(),
    ean: z.string().nullish(),
    upc: z.string().nullish(),
    barcode: z.string().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    allow_backorder: z.boolean().optional().default(false),
    manage_inventory: z.boolean().optional().default(true),
    variant_rank: z.number().optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).optional(),
    prices: z.array(AdminCreateVariantPrice),
    options: z.record(z.string()).optional(),
    inventory_items: z
      .array(
        z.object({
          inventory_item_id: z.string(),
          required_quantity: z.number(),
        })
      )
      .optional(),
  })
  .strict()

export type AdminUpdateProductVariantType = z.infer<
  typeof AdminUpdateProductVariant
>
export const AdminUpdateProductVariant = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    prices: z.array(AdminUpdateVariantPrice).optional(),
    sku: z.string().nullish(),
    ean: z.string().nullish(),
    upc: z.string().nullish(),
    barcode: z.string().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    allow_backorder: z.boolean().optional(),
    manage_inventory: z.boolean().optional(),
    variant_rank: z.number().optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).optional(),
    options: z.record(z.string()).optional(),
  })
  .strict()

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
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    is_giftcard: z.boolean().optional().default(false),
    discountable: z.boolean().optional().default(true),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().nullish(),
    handle: z.string().optional(),
    status: statusEnum.nullish().default(ProductStatus.DRAFT),
    type_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(AdminCreateProductProductCategory).optional(),
    tags: z.array(AdminUpdateProductTag).optional(),
    options: z.array(AdminCreateProductOption).optional(),
    variants: z.array(AdminCreateProductVariant).optional(),
    sales_channels: z.array(z.object({ id: z.string() })).optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict()

export type AdminUpdateProductType = z.infer<typeof AdminUpdateProduct>
export const AdminUpdateProduct = z
  .object({
    title: z.string().optional(),
    discountable: z.boolean().optional(),
    is_giftcard: z.boolean().optional(),
    options: z.array(AdminUpdateProductOption).optional(),
    variants: z.array(AdminUpdateProductVariant).optional(),
    status: statusEnum.optional(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().nullish(),
    handle: z.string().nullish(),
    type_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(AdminCreateProductProductCategory).optional(),
    tags: z.array(AdminUpdateProductTag).optional(),
    sales_channels: z.array(z.object({ id: z.string() })).optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).optional(),
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

export const AdminCreateVariantInventoryItem = z.object({
  required_quantity: z.number(),
  inventory_item_id: z.string(),
})
export type AdminCreateVariantInventoryItemType = z.infer<
  typeof AdminCreateVariantInventoryItem
>

export const AdminUpdateVariantInventoryItem = z.object({
  required_quantity: z.number(),
})
export type AdminUpdateVariantInventoryItemType = z.infer<
  typeof AdminUpdateVariantInventoryItem
>

export const AdminBatchCreateVariantInventoryItem = z
  .object({
    required_quantity: z.number(),
    inventory_item_id: z.string(),
    variant_id: z.string(),
  })
  .strict()
export type AdminBatchCreateVariantInventoryItemType = z.infer<
  typeof AdminBatchCreateVariantInventoryItem
>

export const AdminBatchUpdateVariantInventoryItem = z
  .object({
    required_quantity: z.number(),
    inventory_item_id: z.string(),
    variant_id: z.string(),
  })
  .strict()
export type AdminBatchUpdateVariantInventoryItemType = z.infer<
  typeof AdminBatchUpdateVariantInventoryItem
>

export const AdminBatchDeleteVariantInventoryItem = z
  .object({
    inventory_item_id: z.string(),
    variant_id: z.string(),
  })
  .strict()
export type AdminBatchDeleteVariantInventoryItemType = z.infer<
  typeof AdminBatchDeleteVariantInventoryItem
>

export type AdminBatchVariantInventoryItemsType = BatchMethodRequest<
  AdminBatchCreateVariantInventoryItemType,
  AdminBatchUpdateVariantInventoryItemType,
  AdminBatchDeleteVariantInventoryItemType
>
