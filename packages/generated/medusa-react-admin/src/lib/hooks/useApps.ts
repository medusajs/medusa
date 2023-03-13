/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminAppsListRes } from '@medusajs/client-types';
import type { AdminAppsRes } from '@medusajs/client-types';
import type { AdminPostAppsReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useAppsList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.apps.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.apps.list>>>(
    ['apps', 'list'],
    () => client.apps.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useAppsAuthorize = (
  requestBody: AdminPostAppsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.apps.authorize>>, unknown, AdminPostAppsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('apps')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.apps.authorize>>, unknown, AdminPostAppsReq>(
    ['apps', 'authorize', requestBody],
    () => client.apps.authorize(requestBody),
    options
  );
};


