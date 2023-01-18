/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetProductTypesParams } from '../models/AdminGetProductTypesParams';
import type { AdminProductTypesListRes } from '../models/AdminProductTypesListRes';

export const useProductTypeList = (
  queryParams: AdminGetProductTypesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productType.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productType.list>>>(
    ['productType', 'list', queryParams],
    () => client.productType.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


