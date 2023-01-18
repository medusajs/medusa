/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCurrenciesListRes } from '../models/AdminCurrenciesListRes';
import type { AdminCurrenciesRes } from '../models/AdminCurrenciesRes';
import type { AdminGetCurrenciesParams } from '../models/AdminGetCurrenciesParams';
import type { AdminPostCurrenciesCurrencyReq } from '../models/AdminPostCurrenciesCurrencyReq';

export const useCurrencyList = (
  queryParams: AdminGetCurrenciesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.currency.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.currency.list>>>(
    ['currency', 'list', queryParams],
    () => client.currency.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCurrencyUpdate = (
  code: string,
  requestBody: AdminPostCurrenciesCurrencyReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.currency.update>>, unknown, AdminPostCurrenciesCurrencyReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('currency')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.currency.update>>, unknown, AdminPostCurrenciesCurrencyReq>(
    ['currency', 'update', code,requestBody],
    () => client.currency.update(code,requestBody),
    options
  );
};


