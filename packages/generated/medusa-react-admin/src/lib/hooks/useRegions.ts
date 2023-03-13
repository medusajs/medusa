/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetRegionsParams } from '@medusajs/client-types';
import type { AdminGetRegionsRegionFulfillmentOptionsRes } from '@medusajs/client-types';
import type { AdminPostRegionsRegionCountriesReq } from '@medusajs/client-types';
import type { AdminPostRegionsRegionFulfillmentProvidersReq } from '@medusajs/client-types';
import type { AdminPostRegionsRegionPaymentProvidersReq } from '@medusajs/client-types';
import type { AdminPostRegionsRegionReq } from '@medusajs/client-types';
import type { AdminPostRegionsReq } from '@medusajs/client-types';
import type { AdminRegionsDeleteRes } from '@medusajs/client-types';
import type { AdminRegionsListRes } from '@medusajs/client-types';
import type { AdminRegionsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useRegionsList = (
  queryParams: AdminGetRegionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.regions.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.regions.list>>>(
    ['regions', 'list', queryParams],
    () => client.regions.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionsCreate = (
  requestBody: AdminPostRegionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.create>>, unknown, AdminPostRegionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.create>>, unknown, AdminPostRegionsReq>(
    ['regions', 'create', requestBody],
    () => client.regions.create(requestBody),
    options
  );
};

export const useRegionsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.regions.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.regions.retrieve>>>(
    ['regions', 'retrieve', id],
    () => client.regions.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionsUpdate = (
  id: string,
  requestBody: AdminPostRegionsRegionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.update>>, unknown, AdminPostRegionsRegionReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.update>>, unknown, AdminPostRegionsRegionReq>(
    ['regions', 'update', id,requestBody],
    () => client.regions.update(id,requestBody),
    options
  );
};

export const useRegionsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.delete>>, unknown, void>(
    ['regions', 'delete', id],
    () => client.regions.delete(id),
    options
  );
};

export const useRegionsAddCountry = (
  id: string,
  requestBody: AdminPostRegionsRegionCountriesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.addCountry>>, unknown, AdminPostRegionsRegionCountriesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.addCountry>>, unknown, AdminPostRegionsRegionCountriesReq>(
    ['regions', 'addCountry', id,requestBody],
    () => client.regions.addCountry(id,requestBody),
    options
  );
};

export const useRegionsDeleteCountry = (
  id: string,
  countryCode: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.deleteCountry>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.deleteCountry>>, unknown, void>(
    ['regions', 'deleteCountry', id,countryCode],
    () => client.regions.deleteCountry(id,countryCode),
    options
  );
};

export const useRegionsRetrieveFulfillmentOptions = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.regions.retrieveFulfillmentOptions>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.regions.retrieveFulfillmentOptions>>>(
    ['regions', 'retrieveFulfillmentOptions', id],
    () => client.regions.retrieveFulfillmentOptions(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionsAddFulfillmentProvider = (
  id: string,
  requestBody: AdminPostRegionsRegionFulfillmentProvidersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.addFulfillmentProvider>>, unknown, AdminPostRegionsRegionFulfillmentProvidersReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.addFulfillmentProvider>>, unknown, AdminPostRegionsRegionFulfillmentProvidersReq>(
    ['regions', 'addFulfillmentProvider', id,requestBody],
    () => client.regions.addFulfillmentProvider(id,requestBody),
    options
  );
};

export const useRegionsDeleteFulfillmentProvider = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.deleteFulfillmentProvider>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.deleteFulfillmentProvider>>, unknown, void>(
    ['regions', 'deleteFulfillmentProvider', id,providerId],
    () => client.regions.deleteFulfillmentProvider(id,providerId),
    options
  );
};

export const useRegionsAddPaymentProvider = (
  id: string,
  requestBody: AdminPostRegionsRegionPaymentProvidersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.addPaymentProvider>>, unknown, AdminPostRegionsRegionPaymentProvidersReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.addPaymentProvider>>, unknown, AdminPostRegionsRegionPaymentProvidersReq>(
    ['regions', 'addPaymentProvider', id,requestBody],
    () => client.regions.addPaymentProvider(id,requestBody),
    options
  );
};

export const useRegionsDeletePaymentProvider = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.regions.deletePaymentProvider>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('regions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.regions.deletePaymentProvider>>, unknown, void>(
    ['regions', 'deletePaymentProvider', id,providerId],
    () => client.regions.deletePaymentProvider(id,providerId),
    options
  );
};


