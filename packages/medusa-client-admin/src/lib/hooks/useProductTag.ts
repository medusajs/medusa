/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetProductTagsParams } from '../models/AdminGetProductTagsParams';
import type { AdminProductsListTagsRes } from '../models/AdminProductsListTagsRes';
import type { AdminProductTagsListRes } from '../models/AdminProductTagsListRes';

const { client } = useMedusaAdmin()

export const useProductTagList = (
  queryParams: AdminGetProductTagsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productTag.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productTag.list>>>(
    ['productTag', 'list', queryParams],
    () => client.productTag.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductTagListTags = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productTag.listTags>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productTag.listTags>>>(
    ['productTag', 'listTags'],
    () => client.productTag.listTags(),
    options
  );
  return { ...data, ...rest } as const
};


