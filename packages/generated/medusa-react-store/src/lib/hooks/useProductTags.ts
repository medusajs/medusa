/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetProductTagsParams } from '@medusajs/client-types';
import type { StoreProductTagsListRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useProductTagsList = (
  queryParams: StoreGetProductTagsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productTags.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productTags.list>>>(
    ['productTags', 'list', queryParams],
    () => client.productTags.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


