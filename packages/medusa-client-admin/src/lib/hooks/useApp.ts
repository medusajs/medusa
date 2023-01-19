/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminAppsListRes } from '../models/AdminAppsListRes';
import type { AdminAppsRes } from '../models/AdminAppsRes';
import type { AdminPostAppsReq } from '../models/AdminPostAppsReq';

const { client } = useMedusaAdmin()

export const useAppList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.app.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.app.list>>>(
    ['app', 'list'],
    () => client.app.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useAppAuthorize = (
  requestBody: AdminPostAppsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.app.authorize>>, unknown, AdminPostAppsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('app')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.app.authorize>>, unknown, AdminPostAppsReq>(
    ['app', 'authorize', requestBody],
    () => client.app.authorize(requestBody),
    options
  );
};


