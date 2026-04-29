import { FetchError } from "@medusajs/js-sdk";
import { HttpTypes } from "@medusajs/types";
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../lib/query-key";
import { sdk } from "../../lib/sdk";

const PRICE_PREFERENCES_QUERY_KEY = "price-preferences" as const;
export const pricePreferencesQueryKeys = queryKeysFactory(
  PRICE_PREFERENCES_QUERY_KEY
);

export const usePricePreferences = (
  query?: HttpTypes.AdminPricePreferenceListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminPricePreferenceListResponse,
      FetchError,
      HttpTypes.AdminPricePreferenceListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.pricePreference.list(query),
    queryKey: pricePreferencesQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
