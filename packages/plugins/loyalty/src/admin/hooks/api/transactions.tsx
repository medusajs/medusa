import { ClientHeaders, FetchError } from "@medusajs/js-sdk";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  AdminGetTransactionsParams,
  AdminTransactionsResponse,
  ModuleListAccountTransactions,
} from "../../../types";
import { queryKeysFactory } from "../../lib/query-key";
import { sdk } from "../../lib/sdk";

export const transactionQueryKey = queryKeysFactory("transaction");

export const useStoreCreditAccountTransactions = (
  id: string,
  query?: AdminGetTransactionsParams,
  options?: Omit<
    UseQueryOptions<
      AdminTransactionsResponse,
      FetchError,
      AdminTransactionsResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const fetchStoreCreditAccountTransactions = (
    query?: ModuleListAccountTransactions,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminTransactionsResponse>(
      `/admin/store-credit-accounts/${id}/transactions`,
      {
        query,
        headers,
      }
    );

  const { data, ...rest } = useQuery({
    queryFn: () => fetchStoreCreditAccountTransactions(query),
    queryKey: transactionQueryKey.list({ sca_id: id, query }),
    ...options,
  });

  return { ...data, ...rest };
};
