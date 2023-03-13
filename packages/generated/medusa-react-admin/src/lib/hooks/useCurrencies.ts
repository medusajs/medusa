/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCurrenciesListRes } from '@medusajs/client-types';
import type { AdminCurrenciesRes } from '@medusajs/client-types';
import type { AdminGetCurrenciesParams } from '@medusajs/client-types';
import type { AdminPostCurrenciesCurrencyReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useCurrenciesList = (
  queryParams: AdminGetCurrenciesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.currencies.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.currencies.list>>>(
    ['currencies', 'list', queryParams],
    () => client.currencies.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCurrenciesUpdate = (
  code: string,
  requestBody: AdminPostCurrenciesCurrencyReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.currencies.update>>, unknown, AdminPostCurrenciesCurrencyReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('currencies')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.currencies.update>>, unknown, AdminPostCurrenciesCurrencyReq>(
    ['currencies', 'update', code,requestBody],
    () => client.currencies.update(code,requestBody),
    options
  );
};


