/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetStockLocationsLocationParams } from '@medusajs/client-types';
import type { AdminGetStockLocationsParams } from '@medusajs/client-types';
import type { AdminPostStockLocationsLocationReq } from '@medusajs/client-types';
import type { AdminPostStockLocationsReq } from '@medusajs/client-types';
import type { AdminStockLocationsListRes } from '@medusajs/client-types';
import type { AdminStockLocationsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useStockLocationsList = (
  queryParams: AdminGetStockLocationsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.stockLocations.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.stockLocations.list>>>(
    ['stockLocations', 'list', queryParams],
    () => client.stockLocations.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useStockLocationsCreate = (
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
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.stockLocations.create>>, unknown, AdminPostStockLocationsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('stockLocations')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.stockLocations.create>>, unknown, AdminPostStockLocationsReq>(
    ['stockLocations', 'create', requestBody,queryParams],
    () => client.stockLocations.create(requestBody,queryParams),
    options
  );
};

export const useStockLocationsRetrieve = (
  id: string,
  queryParams: AdminGetStockLocationsLocationParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.stockLocations.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.stockLocations.retrieve>>>(
    ['stockLocations', 'retrieve', id,queryParams],
    () => client.stockLocations.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useStockLocationsUpdate = (
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
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.stockLocations.update>>, unknown, AdminPostStockLocationsLocationReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('stockLocations')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.stockLocations.update>>, unknown, AdminPostStockLocationsLocationReq>(
    ['stockLocations', 'update', id,requestBody,queryParams],
    () => client.stockLocations.update(id,requestBody,queryParams),
    options
  );
};

export const useStockLocationsDeleteStockLocationsStockLocation = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.stockLocations.deleteStockLocationsStockLocation>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('stockLocations')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.stockLocations.deleteStockLocationsStockLocation>>, unknown, void>(
    ['stockLocations', 'deleteStockLocationsStockLocation', id],
    () => client.stockLocations.deleteStockLocationsStockLocation(id),
    options
  );
};


