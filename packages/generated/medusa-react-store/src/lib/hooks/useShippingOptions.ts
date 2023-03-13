/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreCartShippingOptionsListRes } from '@medusajs/client-types';
import type { StoreGetShippingOptionsParams } from '@medusajs/client-types';
import type { StoreShippingOptionsListRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useShippingOptionsList = (
  queryParams: StoreGetShippingOptionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOptions.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOptions.list>>>(
    ['shippingOptions', 'list', queryParams],
    () => client.shippingOptions.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingOptionsListCartOptions = (
  cartId: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOptions.listCartOptions>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOptions.listCartOptions>>>(
    ['shippingOptions', 'listCartOptions', cartId],
    () => client.shippingOptions.listCartOptions(cartId),
    options
  );
  return { ...data, ...rest } as const
};


