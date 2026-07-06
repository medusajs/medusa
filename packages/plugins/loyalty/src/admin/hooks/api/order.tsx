import { FetchError } from "@medusajs/js-sdk";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeysFactory } from "../../lib/query-key";
import { sdk } from "../../lib/sdk";

const ORDERS_QUERY_KEY = "orders" as const;
const orderQueryKeys = queryKeysFactory(ORDERS_QUERY_KEY);

export const useOrder = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.retrieve(id, query),
    queryKey: orderQueryKeys.detail(id, query),
    ...options,
  });

  return { ...data, ...rest };
};
