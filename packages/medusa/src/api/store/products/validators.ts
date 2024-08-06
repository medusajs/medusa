import { z } from "zod"
import {
  GetProductsParams,
  ProductStatusEnum,
  transformProductParams,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type StoreGetProductParamsType = z.infer<typeof StoreGetProductParams>

export const StoreGetProductParams = createSelectParams().merge(
  // These are used to populate the tax and pricing context
  z.object({
    region_id: z.string().optional(),
    country_code: z.string().optional(),
    province: z.string().optional(),
    cart_id: z.string().optional(),
  })
)

export type StoreGetProductVariantsParamsType = z.infer<
  typeof StoreGetProductVariantsParams
>
export const StoreGetProductVariantsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: ProductStatusEnum.array().optional(),
    options: z.object({ value: z.string(), option_id: z.string() }).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => StoreGetProductsParams.array()).optional(),
    $or: z.lazy(() => StoreGetProductsParams.array()).optional(),
  })
)

export type StoreGetProductsParamsType = z.infer<typeof StoreGetProductsParams>
export const StoreGetProductsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(
    z
      .object({
        // These are used to populate the tax and pricing context
        region_id: z.string().optional(),
        country_code: z.string().optional(),
        province: z.string().optional(),
        cart_id: z.string().optional(),

        variants: z
          .object({
            status: ProductStatusEnum.array().optional(),
            options: z
              .object({ value: z.string(), option_id: z.string() })
              .optional(),
            $and: z.lazy(() => StoreGetProductsParams.array()).optional(),
            $or: z.lazy(() => StoreGetProductsParams.array()).optional(),
          })
          .optional(),
        $and: z.lazy(() => StoreGetProductsParams.array()).optional(),
        $or: z.lazy(() => StoreGetProductsParams.array()).optional(),
      })
      .merge(GetProductsParams)
      .strict()
  )
  .transform(transformProductParams)
