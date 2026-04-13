import { FetchError } from "@medusajs/js-sdk";
import { HttpTypes } from "@medusajs/types";
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../lib/query-key";
import { sdk } from "../../lib/sdk";

const STORE_QUERY_KEY = "store" as const;
export const storeQueryKeys = queryKeysFactory(STORE_QUERY_KEY);

export async function retrieveActiveStore(
  query?: HttpTypes.AdminStoreParams
): Promise<HttpTypes.AdminStoreResponse> {
  const response = await sdk.admin.store.list(query);

  const activeStore = response.stores?.[0];

  if (!activeStore) {
    throw new FetchError("No active store found", "Not Found", 404);
  }

  return { store: activeStore };
}

export const useStore = (
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminStoreResponse,
      FetchError,
      HttpTypes.AdminStoreResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => retrieveActiveStore(query),
    queryKey: storeQueryKeys.details(),
    ...options,
  });

  return {
    ...data,
    ...rest,
  };
};
