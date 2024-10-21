import { z } from "zod"
import {
  GetProductsParams,
  recursivelyNormalizeSchema,
  StoreGetProductParamsDirectFields,
  transformProductParams,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const StoreGetProductParamsFields = z.object({
  region_id: z.string().optional(),
  country_code: z.string().optional(),
  province: z.string().optional(),
  cart_id: z.string().optional(),
})

export type StoreGetProductParamsType = z.infer<typeof StoreGetProductParams>

export const StoreGetProductParams = createSelectParams().merge(
  StoreGetProductParamsFields
)

const StoreGetProductVariantsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  options: z.object({ value: z.string(), option_id: z.string() }).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type StoreGetProductVariantsParamsType = z.infer<
  typeof StoreGetProductVariantsParams
>
export const StoreGetProductVariantsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreGetProductVariantsParamsFields)
  .merge(
    z.object({
      $and: z
        .lazy(() => StoreGetProductVariantsParamsFields.array())
        .optional(),
      $or: z.lazy(() => StoreGetProductVariantsParamsFields.array()).optional(),
    })
  )

const StoreGetProductsParamsFields = z
  .object({
    region_id: z.string().optional(),
    country_code: z.string().optional(),
    province: z.string().optional(),
    cart_id: z.string().optional(),
  })
  .merge(GetProductsParams)
  .strict()

export type StoreGetProductsParamsType = z.infer<typeof StoreGetProductsParams>
export const StoreGetProductsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreGetProductsParamsFields)
  .merge(
    z
      .object({
        variants: z
          .object({
            options: z
              .object({ value: z.string(), option_id: z.string() })
              .optional(),
            $and: z
              .lazy(() => StoreGetProductVariantsParamsFields.array())
              .optional(),
            $or: z
              .lazy(() => StoreGetProductVariantsParamsFields.array())
              .optional(),
          })
          .optional(),
        $and: z
          .lazy(() => StoreGetProductParamsDirectFields.strict().array())
          .optional(),
        $or: z
          .lazy(() => StoreGetProductParamsDirectFields.strict().array())
          .optional(),
      })
      .strict()
  )
  .transform(recursivelyNormalizeSchema(transformProductParams))
