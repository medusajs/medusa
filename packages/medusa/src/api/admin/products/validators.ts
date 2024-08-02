import { BatchMethodRequest } from "@medusajs/types"
import { ProductStatus } from "@medusajs/utils"
import {
  GetProductsParams,
  transformProductParams,
} from "../../utils/common-validators"
import { z, ZodObject } from "zod"
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
})
  .merge(
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
  .transform(transformProductParams)

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
  typeof _AdminCreateProductOption
>
const _AdminCreateProductOption = z.object({
  title: z.string(),
  values: z.array(z.string()),
})
export const AdminCreateProductOption = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return _AdminCreateProductOption.extend({
      additional_data: z.record(z.unknown()).nullish(),
    })
  }

  return _AdminCreateProductOption.extend({
    additional_data: additionalDataValidator,
  })
}

export type AdminUpdateProductOptionType = z.infer<
  typeof _AdminUpdateProductOption
>
const _AdminUpdateProductOption = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  values: z.array(z.string()).optional(),
})

export const AdminUpdateProductOption = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return _AdminUpdateProductOption.extend({
      additional_data: z.record(z.unknown()).nullish(),
    })
  }

  return _AdminUpdateProductOption.extend({
    additional_data: additionalDataValidator,
  })
}

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

export type AdminCreateProductVariantType = z.infer<
  typeof _AdminCreateProductVariant
>
const _AdminCreateProductVariant = z
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
export const AdminCreateProductVariant = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return _AdminCreateProductVariant.extend({
      additional_data: z.record(z.string()).optional(),
    })
  }

  return _AdminCreateProductVariant.extend({
    additional_data: additionalDataValidator,
  })
}

export type AdminUpdateProductVariantType = z.infer<
  typeof _AdminUpdateProductVariant
>
const _AdminUpdateProductVariant = z
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
    metadata: z.record(z.unknown()).nullish(),
    options: z.record(z.string()).optional(),
  })
  .strict()

export const AdminUpdateProductVariant = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return _AdminUpdateProductVariant.extend({
      additional_data: z.record(z.string()).optional(),
    })
  }

  return _AdminUpdateProductVariant.extend({
    additional_data: additionalDataValidator,
  })
}

export type AdminBatchUpdateProductVariantType = z.infer<
  typeof AdminBatchUpdateProductVariant
>
export const AdminBatchUpdateProductVariant = _AdminUpdateProductVariant.extend(
  {
    id: z.string(),
  }
)

export const IdAssociation = z.object({
  id: z.string(),
})

export type AdminCreateProductType = z.infer<typeof _AdminCreateProduct>
const _AdminCreateProduct = z
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
    categories: z.array(IdAssociation).optional(),
    tags: z.array(IdAssociation).optional(),
    options: z.array(_AdminCreateProductOption).optional(),
    variants: z.array(_AdminCreateProductVariant).optional(),
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

export const AdminCreateProduct = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return _AdminCreateProduct.extend({
      additional_data: z.record(z.unknown()).nullish(),
    })
  }

  return _AdminCreateProduct.extend({
    additional_data: additionalDataValidator,
  })
}

export type AdminUpdateProductType = z.infer<typeof _AdminUpdateProduct>
const _AdminUpdateProduct = z
  .object({
    title: z.string().optional(),
    discountable: z.boolean().optional(),
    is_giftcard: z.boolean().optional(),
    options: z.array(_AdminUpdateProductOption).optional(),
    variants: z.array(_AdminUpdateProductVariant).optional(),
    status: statusEnum.optional(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().nullish(),
    handle: z.string().nullish(),
    type_id: z.string().nullish(),
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

export const AdminUpdateProduct = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return _AdminUpdateProduct.extend({
      additional_data: z.record(z.unknown()).nullish(),
    })
  }

  return _AdminUpdateProduct.extend({
    additional_data: additionalDataValidator,
  })
}

export type AdminBatchUpdateProductType = z.infer<
  typeof AdminBatchUpdateProduct
>
export const AdminBatchUpdateProduct = _AdminUpdateProduct.extend({
  id: z.string(),
})

export type AdminExportProductType = z.infer<typeof AdminExportProduct>
export const AdminExportProduct = z.object({})

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
