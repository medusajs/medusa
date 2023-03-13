/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminExtendedStoresRes } from '@medusajs/client-types';
import type { AdminPaymentProvidersList } from '@medusajs/client-types';
import type { AdminPostStoreReq } from '@medusajs/client-types';
import type { AdminStoresRes } from '@medusajs/client-types';
import type { AdminTaxProvidersList } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useStoreRetrieve = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.store.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.store.retrieve>>>(
    ['store', 'retrieve'],
    () => client.store.retrieve(),
    options
  );
  return { ...data, ...rest } as const
};

export const useStoreUpdate = (
  requestBody: AdminPostStoreReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.store.update>>, unknown, AdminPostStoreReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('store')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.store.update>>, unknown, AdminPostStoreReq>(
    ['store', 'update', requestBody],
    () => client.store.update(requestBody),
    options
  );
};

export const useStoreAddCurrency = (
  code: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.store.addCurrency>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('store')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.store.addCurrency>>, unknown, void>(
    ['store', 'addCurrency', code],
    () => client.store.addCurrency(code),
    options
  );
};

export const useStoreDeleteCurrency = (
  code: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.store.deleteCurrency>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('store')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.store.deleteCurrency>>, unknown, void>(
    ['store', 'deleteCurrency', code],
    () => client.store.deleteCurrency(code),
    options
  );
};

export const useStoreListPaymentProviders = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.store.listPaymentProviders>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.store.listPaymentProviders>>>(
    ['store', 'listPaymentProviders'],
    () => client.store.listPaymentProviders(),
    options
  );
  return { ...data, ...rest } as const
};

export const useStoreListTaxProviders = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.store.listTaxProviders>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.store.listTaxProviders>>>(
    ['store', 'listTaxProviders'],
    () => client.store.listTaxProviders(),
    options
  );
  return { ...data, ...rest } as const
};


