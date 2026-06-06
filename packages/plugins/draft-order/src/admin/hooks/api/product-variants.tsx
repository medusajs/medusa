import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { sdk } from "../../lib/queries/sdk"

const PRODUCT_VARIANTS_QUERY_KEY = "product-variants"

export const productVariantsQueryKeys = {
  list: (query?: Record<string, any>) => [
    PRODUCT_VARIANTS_QUERY_KEY,
    query ? query : undefined,
  ],
}

export const useProductVariants = (
  query?: HttpTypes.AdminProductVariantParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductVariantListResponse,
      FetchError,
      HttpTypes.AdminProductVariantListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: productVariantsQueryKeys.list(query),
    queryFn: async () => await sdk.admin.productVariant.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
