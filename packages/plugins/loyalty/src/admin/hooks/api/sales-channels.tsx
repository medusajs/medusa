import { FetchError } from "@medusajs/js-sdk";
import {
  AdminSalesChannelListResponse,
  AdminSalesChannelResponse,
  HttpTypes,
} from "@medusajs/types";
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeysFactory } from "../../lib/query-key";
import { sdk } from "../../lib/sdk";
import { productsQueryKeys } from "./products";

const SALES_CHANNELS_QUERY_KEY = "sales-channels" as const;
export const salesChannelsQueryKeys = queryKeysFactory(
  SALES_CHANNELS_QUERY_KEY
);

export const useSalesChannel = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      AdminSalesChannelResponse,
      FetchError,
      AdminSalesChannelResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: salesChannelsQueryKeys.detail(id),
    queryFn: async () => sdk.admin.salesChannel.retrieve(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useSalesChannels = (
  query?: HttpTypes.AdminSalesChannelListParams,
  options?: Omit<
    UseQueryOptions<
      AdminSalesChannelListResponse,
      FetchError,
      AdminSalesChannelListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.salesChannel.list(query),
    queryKey: salesChannelsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useSalesChannelRemoveProducts = (
  id: string,
  options?: UseMutationOptions<
    AdminSalesChannelResponse,
    FetchError,
    HttpTypes.AdminBatchLink["remove"]
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.salesChannel.batchProducts(id, { remove: payload }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.details(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useSalesChannelAddProducts = (
  id: string,
  options?: UseMutationOptions<
    AdminSalesChannelResponse,
    FetchError,
    HttpTypes.AdminBatchLink["add"]
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.salesChannel.batchProducts(id, { add: payload }),
    onSuccess: (data, variables, context) => {
      const queryClient = useQueryClient();

      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.detail(id),
      });

      // Invalidate the products that were removed
      for (const product of variables || []) {
        queryClient.invalidateQueries({
          queryKey: productsQueryKeys.detail(product),
        });
      }

      // Invalidate the products list query
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.lists(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
