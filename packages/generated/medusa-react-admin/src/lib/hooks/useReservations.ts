/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetReservationsParams } from '@medusajs/client-types';
import type { AdminPostReservationsReq } from '@medusajs/client-types';
import type { AdminPostReservationsReservationReq } from '@medusajs/client-types';
import type { AdminReservationsDeleteRes } from '@medusajs/client-types';
import type { AdminReservationsListRes } from '@medusajs/client-types';
import type { AdminReservationsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useReservationsList = (
  queryParams: AdminGetReservationsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.reservations.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.reservations.list>>>(
    ['reservations', 'list', queryParams],
    () => client.reservations.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useReservationsPostReservations = (
  requestBody: AdminPostReservationsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.reservations.postReservations>>, unknown, AdminPostReservationsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('reservations')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.reservations.postReservations>>, unknown, AdminPostReservationsReq>(
    ['reservations', 'postReservations', requestBody],
    () => client.reservations.postReservations(requestBody),
    options
  );
};

export const useReservationsGetReservationsReservation = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.reservations.getReservationsReservation>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.reservations.getReservationsReservation>>>(
    ['reservations', 'getReservationsReservation', id],
    () => client.reservations.getReservationsReservation(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useReservationsPostReservationsReservation = (
  id: string,
  requestBody: AdminPostReservationsReservationReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.reservations.postReservationsReservation>>, unknown, AdminPostReservationsReservationReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('reservations')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.reservations.postReservationsReservation>>, unknown, AdminPostReservationsReservationReq>(
    ['reservations', 'postReservationsReservation', id,requestBody],
    () => client.reservations.postReservationsReservation(id,requestBody),
    options
  );
};

export const useReservationsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.reservations.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('reservations')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.reservations.delete>>, unknown, void>(
    ['reservations', 'delete', id],
    () => client.reservations.delete(id),
    options
  );
};


