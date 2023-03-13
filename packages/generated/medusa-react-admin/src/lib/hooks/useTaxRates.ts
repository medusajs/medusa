/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteTaxRatesTaxRateProductsParams } from '@medusajs/client-types';
import type { AdminDeleteTaxRatesTaxRateProductsReq } from '@medusajs/client-types';
import type { AdminDeleteTaxRatesTaxRateProductTypesParams } from '@medusajs/client-types';
import type { AdminDeleteTaxRatesTaxRateProductTypesReq } from '@medusajs/client-types';
import type { AdminDeleteTaxRatesTaxRateShippingOptionsParams } from '@medusajs/client-types';
import type { AdminDeleteTaxRatesTaxRateShippingOptionsReq } from '@medusajs/client-types';
import type { AdminGetTaxRatesParams } from '@medusajs/client-types';
import type { AdminGetTaxRatesTaxRateParams } from '@medusajs/client-types';
import type { AdminPostTaxRatesParams } from '@medusajs/client-types';
import type { AdminPostTaxRatesReq } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateParams } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateProductsParams } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateProductsReq } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateProductTypesParams } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateProductTypesReq } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateReq } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateShippingOptionsParams } from '@medusajs/client-types';
import type { AdminPostTaxRatesTaxRateShippingOptionsReq } from '@medusajs/client-types';
import type { AdminTaxRatesDeleteRes } from '@medusajs/client-types';
import type { AdminTaxRatesListRes } from '@medusajs/client-types';
import type { AdminTaxRatesRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useTaxRatesList = (
  queryParams: AdminGetTaxRatesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.taxRates.list>>>(
    ['taxRates', 'list', queryParams],
    () => client.taxRates.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useTaxRatesCreate = (
  requestBody: AdminPostTaxRatesReq,
  queryParams: AdminPostTaxRatesParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.create>>, unknown, AdminPostTaxRatesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.create>>, unknown, AdminPostTaxRatesReq>(
    ['taxRates', 'create', requestBody,queryParams],
    () => client.taxRates.create(requestBody,queryParams),
    options
  );
};

export const useTaxRatesRetrieve = (
  id: string,
  queryParams: AdminGetTaxRatesTaxRateParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.taxRates.retrieve>>>(
    ['taxRates', 'retrieve', id,queryParams],
    () => client.taxRates.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useTaxRatesUpdate = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateReq,
  queryParams: AdminPostTaxRatesTaxRateParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.update>>, unknown, AdminPostTaxRatesTaxRateReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.update>>, unknown, AdminPostTaxRatesTaxRateReq>(
    ['taxRates', 'update', id,requestBody,queryParams],
    () => client.taxRates.update(id,requestBody,queryParams),
    options
  );
};

export const useTaxRatesDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.delete>>, unknown, void>(
    ['taxRates', 'delete', id],
    () => client.taxRates.delete(id),
    options
  );
};

export const useTaxRatesAddProductTypes = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateProductTypesReq,
  queryParams: AdminPostTaxRatesTaxRateProductTypesParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.addProductTypes>>, unknown, AdminPostTaxRatesTaxRateProductTypesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.addProductTypes>>, unknown, AdminPostTaxRatesTaxRateProductTypesReq>(
    ['taxRates', 'addProductTypes', id,requestBody,queryParams],
    () => client.taxRates.addProductTypes(id,requestBody,queryParams),
    options
  );
};

export const useTaxRatesRemoveProductTypes = (
  id: string,
  requestBody: AdminDeleteTaxRatesTaxRateProductTypesReq,
  queryParams: AdminDeleteTaxRatesTaxRateProductTypesParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.removeProductTypes>>, unknown, AdminDeleteTaxRatesTaxRateProductTypesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.removeProductTypes>>, unknown, AdminDeleteTaxRatesTaxRateProductTypesReq>(
    ['taxRates', 'removeProductTypes', id,requestBody,queryParams],
    () => client.taxRates.removeProductTypes(id,requestBody,queryParams),
    options
  );
};

export const useTaxRatesAddProducts = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateProductsReq,
  queryParams: AdminPostTaxRatesTaxRateProductsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.addProducts>>, unknown, AdminPostTaxRatesTaxRateProductsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.addProducts>>, unknown, AdminPostTaxRatesTaxRateProductsReq>(
    ['taxRates', 'addProducts', id,requestBody,queryParams],
    () => client.taxRates.addProducts(id,requestBody,queryParams),
    options
  );
};

export const useTaxRatesRemoveProducts = (
  id: string,
  requestBody: AdminDeleteTaxRatesTaxRateProductsReq,
  queryParams: AdminDeleteTaxRatesTaxRateProductsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.removeProducts>>, unknown, AdminDeleteTaxRatesTaxRateProductsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.removeProducts>>, unknown, AdminDeleteTaxRatesTaxRateProductsReq>(
    ['taxRates', 'removeProducts', id,requestBody,queryParams],
    () => client.taxRates.removeProducts(id,requestBody,queryParams),
    options
  );
};

export const useTaxRatesAddShippingOptions = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateShippingOptionsReq,
  queryParams: AdminPostTaxRatesTaxRateShippingOptionsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.addShippingOptions>>, unknown, AdminPostTaxRatesTaxRateShippingOptionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.addShippingOptions>>, unknown, AdminPostTaxRatesTaxRateShippingOptionsReq>(
    ['taxRates', 'addShippingOptions', id,requestBody,queryParams],
    () => client.taxRates.addShippingOptions(id,requestBody,queryParams),
    options
  );
};

export const useTaxRatesRemoveShippingOptions = (
  id: string,
  requestBody: AdminDeleteTaxRatesTaxRateShippingOptionsReq,
  queryParams: AdminDeleteTaxRatesTaxRateShippingOptionsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRates.removeShippingOptions>>, unknown, AdminDeleteTaxRatesTaxRateShippingOptionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRates')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRates.removeShippingOptions>>, unknown, AdminDeleteTaxRatesTaxRateShippingOptionsReq>(
    ['taxRates', 'removeShippingOptions', id,requestBody,queryParams],
    () => client.taxRates.removeShippingOptions(id,requestBody,queryParams),
    options
  );
};


