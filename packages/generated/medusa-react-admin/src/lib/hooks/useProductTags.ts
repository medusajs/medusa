/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetProductTagsParams } from '@medusajs/client-types';
import type { AdminProductTagsListRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useProductTagsList = (
  queryParams: AdminGetProductTagsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productTags.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productTags.list>>>(
    ['productTags', 'list', queryParams],
    () => client.productTags.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


