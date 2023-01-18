/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetRegionsParams } from '../models/AdminGetRegionsParams';
import type { AdminGetRegionsRegionFulfillmentOptionsRes } from '../models/AdminGetRegionsRegionFulfillmentOptionsRes';
import type { AdminPostRegionsRegionCountriesReq } from '../models/AdminPostRegionsRegionCountriesReq';
import type { AdminPostRegionsRegionFulfillmentProvidersReq } from '../models/AdminPostRegionsRegionFulfillmentProvidersReq';
import type { AdminPostRegionsRegionPaymentProvidersReq } from '../models/AdminPostRegionsRegionPaymentProvidersReq';
import type { AdminPostRegionsRegionReq } from '../models/AdminPostRegionsRegionReq';
import type { AdminPostRegionsReq } from '../models/AdminPostRegionsReq';
import type { AdminRegionsDeleteRes } from '../models/AdminRegionsDeleteRes';
import type { AdminRegionsListRes } from '../models/AdminRegionsListRes';
import type { AdminRegionsRes } from '../models/AdminRegionsRes';

export const useRegionList = (
  queryParams: AdminGetRegionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.region.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.region.list>>>(
    ['region', 'list', queryParams],
    () => client.region.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionCreate = (
  requestBody: AdminPostRegionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.create>>, unknown, AdminPostRegionsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.create>>, unknown, AdminPostRegionsReq>(
    ['region', 'create', requestBody],
    () => client.region.create(requestBody),
    options
  );
};

export const useRegionRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.region.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.region.retrieve>>>(
    ['region', 'retrieve', id],
    () => client.region.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionUpdate = (
  id: string,
  requestBody: AdminPostRegionsRegionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.update>>, unknown, AdminPostRegionsRegionReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.update>>, unknown, AdminPostRegionsRegionReq>(
    ['region', 'update', id,requestBody],
    () => client.region.update(id,requestBody),
    options
  );
};

export const useRegionDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.delete>>, unknown, void>(
    ['region', 'delete', id],
    () => client.region.delete(id),
    options
  );
};

export const useRegionAddCountry = (
  id: string,
  requestBody: AdminPostRegionsRegionCountriesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.addCountry>>, unknown, AdminPostRegionsRegionCountriesReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.addCountry>>, unknown, AdminPostRegionsRegionCountriesReq>(
    ['region', 'addCountry', id,requestBody],
    () => client.region.addCountry(id,requestBody),
    options
  );
};

export const useRegionDeleteCountry = (
  id: string,
  countryCode: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.deleteCountry>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.deleteCountry>>, unknown, void>(
    ['region', 'deleteCountry', id,countryCode],
    () => client.region.deleteCountry(id,countryCode),
    options
  );
};

export const useRegionRetrieveFulfillmentOptions = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.region.retrieveFulfillmentOptions>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.region.retrieveFulfillmentOptions>>>(
    ['region', 'retrieveFulfillmentOptions', id],
    () => client.region.retrieveFulfillmentOptions(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionAddFulfillmentProvider = (
  id: string,
  requestBody: AdminPostRegionsRegionFulfillmentProvidersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.addFulfillmentProvider>>, unknown, AdminPostRegionsRegionFulfillmentProvidersReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.addFulfillmentProvider>>, unknown, AdminPostRegionsRegionFulfillmentProvidersReq>(
    ['region', 'addFulfillmentProvider', id,requestBody],
    () => client.region.addFulfillmentProvider(id,requestBody),
    options
  );
};

export const useRegionDeleteFulfillmentProvider = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.deleteFulfillmentProvider>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.deleteFulfillmentProvider>>, unknown, void>(
    ['region', 'deleteFulfillmentProvider', id,providerId],
    () => client.region.deleteFulfillmentProvider(id,providerId),
    options
  );
};

export const useRegionAddPaymentProvider = (
  id: string,
  requestBody: AdminPostRegionsRegionPaymentProvidersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.addPaymentProvider>>, unknown, AdminPostRegionsRegionPaymentProvidersReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.addPaymentProvider>>, unknown, AdminPostRegionsRegionPaymentProvidersReq>(
    ['region', 'addPaymentProvider', id,requestBody],
    () => client.region.addPaymentProvider(id,requestBody),
    options
  );
};

export const useRegionDeletePaymentProvider = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.region.deletePaymentProvider>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('region')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.region.deletePaymentProvider>>, unknown, void>(
    ['region', 'deletePaymentProvider', id,providerId],
    () => client.region.deletePaymentProvider(id,providerId),
    options
  );
};


