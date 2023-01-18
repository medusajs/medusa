/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetNotificationsParams } from '../models/AdminGetNotificationsParams';
import type { AdminNotificationsListRes } from '../models/AdminNotificationsListRes';
import type { AdminNotificationsRes } from '../models/AdminNotificationsRes';
import type { AdminPostNotificationsNotificationResendReq } from '../models/AdminPostNotificationsNotificationResendReq';

export const useNotificationList = (
  queryParams: AdminGetNotificationsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.notification.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.notification.list>>>(
    ['notification', 'list', queryParams],
    () => client.notification.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useNotificationResend = (
  id: string,
  requestBody: AdminPostNotificationsNotificationResendReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.notification.resend>>, unknown, AdminPostNotificationsNotificationResendReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('notification')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.notification.resend>>, unknown, AdminPostNotificationsNotificationResendReq>(
    ['notification', 'resend', id,requestBody],
    () => client.notification.resend(id,requestBody),
    options
  );
};


