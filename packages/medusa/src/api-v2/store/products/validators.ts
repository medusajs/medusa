import { z } from "zod"
import {
  GetProductsParams,
  ProductStatusEnum,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const StoreGetProductParams = createSelectParams()

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
}).merge(
  z
    .object({
      region_id: z.string().optional(),
      currency_code: z.string().optional(),
      variants: StoreGetProductVariantsParams.optional(),
      $and: z.lazy(() => StoreGetProductsParams.array()).optional(),
      $or: z.lazy(() => StoreGetProductsParams.array()).optional(),
    })
    .merge(GetProductsParams)
    .strict()
)
