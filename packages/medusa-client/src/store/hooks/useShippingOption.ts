/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetShippingOptionsParams } from '../models/StoreGetShippingOptionsParams';
import type { StoreShippingOptionsListRes } from '../models/StoreShippingOptionsListRes';

export const useShippingOptionList = (
  queryParams: StoreGetShippingOptionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOption.list>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOption.list>>>(
    ['shippingOption', 'list', queryParams],
    () => client.shippingOption.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingOptionListCartOptions = (
  cartId: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOption.listCartOptions>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOption.listCartOptions>>>(
    ['shippingOption', 'listCartOptions', cartId],
    () => client.shippingOption.listCartOptions(cartId),
    options
  );
  return { ...data, ...rest } as const
};


