/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminPostStockLocationsLocationReq } from '../models/AdminPostStockLocationsLocationReq';
import type { AdminPostStockLocationsReq } from '../models/AdminPostStockLocationsReq';
import type { AdminStockLocationsRes } from '../models/AdminStockLocationsRes';

const { client } = useMedusaAdmin()

export const useStockLocationCreate = (
  requestBody: AdminPostStockLocationsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the results.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the results.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.stockLocation.create>>, unknown, AdminPostStockLocationsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('stockLocation')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.stockLocation.create>>, unknown, AdminPostStockLocationsReq>(
    ['stockLocation', 'create', requestBody,queryParams],
    () => client.stockLocation.create(requestBody,queryParams),
    options
  );
};

export const useStockLocationRetrieve = (
  id: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the results.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the results.
     */
    fields?: string,
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.stockLocation.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.stockLocation.retrieve>>>(
    ['stockLocation', 'retrieve', id,queryParams],
    () => client.stockLocation.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useStockLocationUpdate = (
  id: string,
  requestBody: AdminPostStockLocationsLocationReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the results.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the results.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.stockLocation.update>>, unknown, AdminPostStockLocationsLocationReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('stockLocation')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.stockLocation.update>>, unknown, AdminPostStockLocationsLocationReq>(
    ['stockLocation', 'update', id,requestBody,queryParams],
    () => client.stockLocation.update(id,requestBody,queryParams),
    options
  );
};


