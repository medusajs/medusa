import { ClientHeaders, FetchError } from "@medusajs/js-sdk";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  AdminCreateStoreCreditAccount,
  AdminCreditStoreCreditAccount,
  AdminGetStoreCreditAccountsParams,
  AdminStoreCreditAccountResponse,
  AdminStoreCreditAccountsResponse,
} from "../../../types";
import { queryKeysFactory } from "../../lib/query-key";
import { sdk } from "../../lib/sdk";
import { transactionQueryKey } from "./transactions";

export const storeCreditAccountQueryKey = queryKeysFactory(
  "store-credit-account"
);

export const useStoreCreditAccounts = (
  query?: AdminGetStoreCreditAccountsParams,
  options?: Omit<
    UseQueryOptions<
      AdminStoreCreditAccountsResponse,
      FetchError,
      AdminStoreCreditAccountsResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const fetchStoreCreditAccounts = (
    query?: AdminGetStoreCreditAccountsParams,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminStoreCreditAccountsResponse>(
      `/admin/store-credit-accounts`,
      {
        query,
        headers,
      }
    );

  const { data, ...rest } = useQuery({
    queryFn: () => fetchStoreCreditAccounts(query),
    queryKey: storeCreditAccountQueryKey.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useStoreCreditAccount = (
  id: string,
  query?: AdminGetStoreCreditAccountsParams,
  options?: Omit<
    UseQueryOptions<
      AdminStoreCreditAccountResponse,
      FetchError,
      AdminStoreCreditAccountResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const fetchStoreCreditAccount = (
    query?: AdminGetStoreCreditAccountsParams,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminStoreCreditAccountResponse>(
      `/admin/store-credit-accounts/${id}`,
      {
        query,
        headers,
      }
    );

  const { data, ...rest } = useQuery({
    queryFn: () => fetchStoreCreditAccount(query),
    queryKey: storeCreditAccountQueryKey.detail(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreateStoreCreditAccount = (
  options?: UseMutationOptions<
    AdminStoreCreditAccountResponse,
    FetchError,
    AdminCreateStoreCreditAccount
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch<AdminStoreCreditAccountResponse>(
        `/admin/store-credit-accounts`,
        { body: payload, method: "POST" }
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: storeCreditAccountQueryKey.lists(),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useCreditStoreCreditAccount = (
  id: string,
  options?: UseMutationOptions<
    AdminStoreCreditAccountResponse,
    FetchError,
    AdminCreditStoreCreditAccount
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch<AdminStoreCreditAccountResponse>(
        `/admin/store-credit-accounts/${id}/credit`,
        { body: payload, method: "POST" }
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: storeCreditAccountQueryKey.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: transactionQueryKey.list({ sca_id: id }),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
