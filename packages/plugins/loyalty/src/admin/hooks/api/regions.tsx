import { FetchError } from "@medusajs/js-sdk";
import { HttpTypes, PaginatedResponse } from "@medusajs/types";
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../lib/query-key";
import { sdk } from "../../lib/sdk";

const REGIONS_QUERY_KEY = "regions" as const;
export const regionsQueryKeys = queryKeysFactory(REGIONS_QUERY_KEY);

export const useRegions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>,
      FetchError,
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.region.list(query),
    queryKey: regionsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
