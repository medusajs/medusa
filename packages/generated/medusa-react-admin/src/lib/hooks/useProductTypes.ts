/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetProductTypesParams } from '@medusajs/client-types';
import type { AdminProductTypesListRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useProductTypesList = (
  queryParams: AdminGetProductTypesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productTypes.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productTypes.list>>>(
    ['productTypes', 'list', queryParams],
    () => client.productTypes.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


