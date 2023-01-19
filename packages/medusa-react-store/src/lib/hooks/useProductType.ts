/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetProductTypesParams } from '../models/StoreGetProductTypesParams';
import type { StoreProductTypesListRes } from '../models/StoreProductTypesListRes';

const { client } = useMedusaStore()

export const useProductTypeList = (
  queryParams: StoreGetProductTypesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productType.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productType.list>>>(
    ['productType', 'list', queryParams],
    () => client.productType.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


