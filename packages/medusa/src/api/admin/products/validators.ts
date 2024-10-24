import { BatchMethodRequest } from "@medusajs/framework/types"
import { ProductStatus } from "@medusajs/framework/utils"
import { z } from "zod"
import {
  applyAndAndOrOperators,
  booleanString,
  GetProductsParams,
  transformProductParams,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"

const statusEnum = z.nativeEnum(ProductStatus)

export const AdminGetProductParams = createSelectParams()
export const AdminGetProductVariantParams = createSelectParams()
export const AdminGetProductOptionParams = createSelectParams()

export const AdminGetProductVariantsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  manage_inventory: booleanString().optional(),
  allow_backorder: booleanString().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetProductVariantsParamsType = z.infer<
  typeof AdminGetProductVariantsParams
>
export const AdminGetProductVariantsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(AdminGetProductVariantsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetProductVariantsParamsFields))

export const AdminGetProductsParamsDirectFields = z.object({
  variants: AdminGetProductVariantsParams.optional(),
  status: statusEnum.array().optional(),
})

export type AdminGetProductsParamsType = z.infer<typeof AdminGetProductsParams>
export const AdminGetProductsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(AdminGetProductsParamsDirectFields)
  .merge(
    z
      .object({
        price_list_id: z.string().array().optional(),
      })
      .merge(applyAndAndOrOperators(AdminGetProductsParamsDirectFields))
      .merge(GetProductsParams)
  )
  .transform(transformProductParams)

export const AdminGetProductOptionsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  title: z.string().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetProductOptionsParamsType = z.infer<
  typeof AdminGetProductOptionsParams
>
export const AdminGetProductOptionsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(AdminGetProductOptionsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetProductOptionsParamsFields))

export type AdminCreateProductTagType = z.infer<typeof AdminCreateProductTag>
export const AdminCreateProductTag = z.object({
  value: z.string(),
})

export type AdminUpdateProductTagType = z.infer<typeof AdminUpdateProductTag>
export const AdminUpdateProductTag = z.object({
  id: z.string().optional(),
  value: z.string().optional(),
})

export type AdminCreateProductOptionType = z.infer<typeof CreateProductOption>
export const CreateProductOption = z.object({
  title: z.string(),
  values: z.array(z.string()),
})
export const AdminCreateProductOption = WithAdditionalData(CreateProductOption)

export type AdminUpdateProductOptionType = z.infer<typeof UpdateProductOption>
export const UpdateProductOption = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  values: z.array(z.string()).optional(),
})

export const AdminUpdateProductOption = WithAdditionalData(UpdateProductOption)

export type AdminCreateVariantPriceType = z.infer<
  typeof AdminCreateVariantPrice
>
export const AdminCreateVariantPrice = z.object({
  currency_code: z.string(),
  amount: z.number(),
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
  rules: z.record(z.string(), z.string()).optional(),
})

export type AdminUpdateVariantPriceType = z.infer<
  typeof AdminUpdateVariantPrice
>
export const AdminUpdateVariantPrice = z.object({
  id: z.string().optional(),
  currency_code: z.string().optional(),
  amount: z.number().optional(),
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
  rules: z.record(z.string(), z.string()).optional(),
})

export type AdminCreateProductTypeType = z.infer<typeof AdminCreateProductType>
export const AdminCreateProductType = z.object({
  value: z.string(),
})

export type AdminCreateProductVariantType = z.infer<typeof CreateProductVariant>
export const CreateProductVariant = z
  .object({
    title: z.string(),
    sku: z.string().nullish(),
    ean: z.string().nullish(),
    upc: z.string().nullish(),
    barcode: z.string().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    allow_backorder: booleanString().optional().default(false),
    manage_inventory: booleanString().optional().default(true),
    variant_rank: z.number().optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
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
export const AdminCreateProductVariant =
  WithAdditionalData(CreateProductVariant)

export type AdminUpdateProductVariantType = z.infer<typeof UpdateProductVariant>
export const UpdateProductVariant = z
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
    allow_backorder: booleanString().optional(),
    manage_inventory: booleanString().optional(),
    variant_rank: z.number().optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    options: z.record(z.string()).optional(),
  })
  .strict()

export const AdminUpdateProductVariant =
  WithAdditionalData(UpdateProductVariant)

export type AdminBatchUpdateProductVariantType = z.infer<
  typeof AdminBatchUpdateProductVariant
>
export const AdminBatchUpdateProductVariant = UpdateProductVariant.extend({
  id: z.string(),
})

export const IdAssociation = z.object({
  id: z.string(),
})

export type AdminCreateProductType = z.infer<typeof CreateProduct>
export const CreateProduct = z
  .object({
    title: z.string(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    is_giftcard: booleanString().optional().default(false),
    discountable: booleanString().optional().default(true),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().nullish(),
    handle: z.string().optional(),
    status: statusEnum.nullish().default(ProductStatus.DRAFT),
    external_id: z.string().nullish(),
    type_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(IdAssociation).optional(),
    tags: z.array(IdAssociation).optional(),
    options: z.array(CreateProductOption).optional(),
    variants: z.array(CreateProductVariant).optional(),
    sales_channels: z.array(z.object({ id: z.string() })).optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export const AdminCreateProduct = WithAdditionalData(CreateProduct)

export type AdminUpdateProductType = z.infer<typeof UpdateProduct>
export const UpdateProduct = z
  .object({
    title: z.string().optional(),
    discountable: booleanString().optional(),
    is_giftcard: booleanString().optional(),
    options: z.array(UpdateProductOption).optional(),
    variants: z.array(UpdateProductVariant).optional(),
    status: statusEnum.optional(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().nullish(),
    handle: z.string().nullish(),
    type_id: z.string().nullish(),
    external_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(IdAssociation).optional(),
    tags: z.array(IdAssociation).optional(),
    sales_channels: z.array(z.object({ id: z.string() })).optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export const AdminUpdateProduct = WithAdditionalData(UpdateProduct)

export type AdminBatchUpdateProductType = z.infer<
  typeof AdminBatchUpdateProduct
>
export const AdminBatchUpdateProduct = UpdateProduct.extend({
  id: z.string(),
})

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
