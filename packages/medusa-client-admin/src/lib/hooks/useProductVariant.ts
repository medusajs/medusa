/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetVariantsParams } from '../models/AdminGetVariantsParams';
import type { AdminVariantsListRes } from '../models/AdminVariantsListRes';

const { client } = useMedusaAdmin()

export const useProductVariantList = (
  queryParams: AdminGetVariantsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productVariant.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productVariant.list>>>(
    ['productVariant', 'list', queryParams],
    () => client.productVariant.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


