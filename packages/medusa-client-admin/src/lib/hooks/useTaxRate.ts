/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteTaxRatesTaxRateProductsParams } from '../models/AdminDeleteTaxRatesTaxRateProductsParams';
import type { AdminDeleteTaxRatesTaxRateProductsReq } from '../models/AdminDeleteTaxRatesTaxRateProductsReq';
import type { AdminDeleteTaxRatesTaxRateProductTypesParams } from '../models/AdminDeleteTaxRatesTaxRateProductTypesParams';
import type { AdminDeleteTaxRatesTaxRateProductTypesReq } from '../models/AdminDeleteTaxRatesTaxRateProductTypesReq';
import type { AdminDeleteTaxRatesTaxRateShippingOptionsParams } from '../models/AdminDeleteTaxRatesTaxRateShippingOptionsParams';
import type { AdminDeleteTaxRatesTaxRateShippingOptionsReq } from '../models/AdminDeleteTaxRatesTaxRateShippingOptionsReq';
import type { AdminGetTaxRatesParams } from '../models/AdminGetTaxRatesParams';
import type { AdminGetTaxRatesTaxRateParams } from '../models/AdminGetTaxRatesTaxRateParams';
import type { AdminPostTaxRatesParams } from '../models/AdminPostTaxRatesParams';
import type { AdminPostTaxRatesReq } from '../models/AdminPostTaxRatesReq';
import type { AdminPostTaxRatesTaxRateParams } from '../models/AdminPostTaxRatesTaxRateParams';
import type { AdminPostTaxRatesTaxRateProductsParams } from '../models/AdminPostTaxRatesTaxRateProductsParams';
import type { AdminPostTaxRatesTaxRateProductsReq } from '../models/AdminPostTaxRatesTaxRateProductsReq';
import type { AdminPostTaxRatesTaxRateProductTypesParams } from '../models/AdminPostTaxRatesTaxRateProductTypesParams';
import type { AdminPostTaxRatesTaxRateProductTypesReq } from '../models/AdminPostTaxRatesTaxRateProductTypesReq';
import type { AdminPostTaxRatesTaxRateReq } from '../models/AdminPostTaxRatesTaxRateReq';
import type { AdminPostTaxRatesTaxRateShippingOptionsParams } from '../models/AdminPostTaxRatesTaxRateShippingOptionsParams';
import type { AdminPostTaxRatesTaxRateShippingOptionsReq } from '../models/AdminPostTaxRatesTaxRateShippingOptionsReq';
import type { AdminTaxRatesDeleteRes } from '../models/AdminTaxRatesDeleteRes';
import type { AdminTaxRatesListRes } from '../models/AdminTaxRatesListRes';
import type { AdminTaxRatesRes } from '../models/AdminTaxRatesRes';

const { client } = useMedusaAdmin()

export const useTaxRateList = (
  queryParams: AdminGetTaxRatesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.taxRate.list>>>(
    ['taxRate', 'list', queryParams],
    () => client.taxRate.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useTaxRateCreate = (
  requestBody: AdminPostTaxRatesReq,
  queryParams: AdminPostTaxRatesParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.create>>, unknown, AdminPostTaxRatesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.create>>, unknown, AdminPostTaxRatesReq>(
    ['taxRate', 'create', requestBody,queryParams],
    () => client.taxRate.create(requestBody,queryParams),
    options
  );
};

export const useTaxRateRetrieve = (
  id: string,
  queryParams: AdminGetTaxRatesTaxRateParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.taxRate.retrieve>>>(
    ['taxRate', 'retrieve', id,queryParams],
    () => client.taxRate.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useTaxRateUpdate = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateReq,
  queryParams: AdminPostTaxRatesTaxRateParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.update>>, unknown, AdminPostTaxRatesTaxRateReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.update>>, unknown, AdminPostTaxRatesTaxRateReq>(
    ['taxRate', 'update', id,requestBody,queryParams],
    () => client.taxRate.update(id,requestBody,queryParams),
    options
  );
};

export const useTaxRateDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.delete>>, unknown, void>(
    ['taxRate', 'delete', id],
    () => client.taxRate.delete(id),
    options
  );
};

export const useTaxRateAddProductTypes = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateProductTypesReq,
  queryParams: AdminPostTaxRatesTaxRateProductTypesParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.addProductTypes>>, unknown, AdminPostTaxRatesTaxRateProductTypesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.addProductTypes>>, unknown, AdminPostTaxRatesTaxRateProductTypesReq>(
    ['taxRate', 'addProductTypes', id,requestBody,queryParams],
    () => client.taxRate.addProductTypes(id,requestBody,queryParams),
    options
  );
};

export const useTaxRateRemoveProductTypes = (
  id: string,
  requestBody: AdminDeleteTaxRatesTaxRateProductTypesReq,
  queryParams: AdminDeleteTaxRatesTaxRateProductTypesParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.removeProductTypes>>, unknown, AdminDeleteTaxRatesTaxRateProductTypesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.removeProductTypes>>, unknown, AdminDeleteTaxRatesTaxRateProductTypesReq>(
    ['taxRate', 'removeProductTypes', id,requestBody,queryParams],
    () => client.taxRate.removeProductTypes(id,requestBody,queryParams),
    options
  );
};

export const useTaxRateAddProducts = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateProductsReq,
  queryParams: AdminPostTaxRatesTaxRateProductsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.addProducts>>, unknown, AdminPostTaxRatesTaxRateProductsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.addProducts>>, unknown, AdminPostTaxRatesTaxRateProductsReq>(
    ['taxRate', 'addProducts', id,requestBody,queryParams],
    () => client.taxRate.addProducts(id,requestBody,queryParams),
    options
  );
};

export const useTaxRateRemoveProducts = (
  id: string,
  requestBody: AdminDeleteTaxRatesTaxRateProductsReq,
  queryParams: AdminDeleteTaxRatesTaxRateProductsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.removeProducts>>, unknown, AdminDeleteTaxRatesTaxRateProductsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.removeProducts>>, unknown, AdminDeleteTaxRatesTaxRateProductsReq>(
    ['taxRate', 'removeProducts', id,requestBody,queryParams],
    () => client.taxRate.removeProducts(id,requestBody,queryParams),
    options
  );
};

export const useTaxRateAddShippingOptions = (
  id: string,
  requestBody: AdminPostTaxRatesTaxRateShippingOptionsReq,
  queryParams: AdminPostTaxRatesTaxRateShippingOptionsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.addShippingOptions>>, unknown, AdminPostTaxRatesTaxRateShippingOptionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.addShippingOptions>>, unknown, AdminPostTaxRatesTaxRateShippingOptionsReq>(
    ['taxRate', 'addShippingOptions', id,requestBody,queryParams],
    () => client.taxRate.addShippingOptions(id,requestBody,queryParams),
    options
  );
};

export const useTaxRateRemoveShippingOptions = (
  id: string,
  requestBody: AdminDeleteTaxRatesTaxRateShippingOptionsReq,
  queryParams: AdminDeleteTaxRatesTaxRateShippingOptionsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.taxRate.removeShippingOptions>>, unknown, AdminDeleteTaxRatesTaxRateShippingOptionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('taxRate')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.taxRate.removeShippingOptions>>, unknown, AdminDeleteTaxRatesTaxRateShippingOptionsReq>(
    ['taxRate', 'removeShippingOptions', id,requestBody,queryParams],
    () => client.taxRate.removeShippingOptions(id,requestBody,queryParams),
    options
  );
};


