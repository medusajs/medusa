/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetNotificationsParams } from '@medusajs/client-types';
import type { AdminNotificationsListRes } from '@medusajs/client-types';
import type { AdminNotificationsRes } from '@medusajs/client-types';
import type { AdminPostNotificationsNotificationResendReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useNotificationsList = (
  queryParams: AdminGetNotificationsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.notifications.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.notifications.list>>>(
    ['notifications', 'list', queryParams],
    () => client.notifications.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useNotificationsResend = (
  id: string,
  requestBody: AdminPostNotificationsNotificationResendReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.notifications.resend>>, unknown, AdminPostNotificationsNotificationResendReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('notifications')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.notifications.resend>>, unknown, AdminPostNotificationsNotificationResendReq>(
    ['notifications', 'resend', id,requestBody],
    () => client.notifications.resend(id,requestBody),
    options
  );
};


