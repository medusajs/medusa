/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreCustomersListOrdersRes } from '@medusajs/client-types';
import type { StoreCustomersListPaymentMethodsRes } from '@medusajs/client-types';
import type { StoreCustomersRes } from '@medusajs/client-types';
import type { StoreCustomersResetPasswordRes } from '@medusajs/client-types';
import type { StoreGetCustomersCustomerOrdersParams } from '@medusajs/client-types';
import type { StorePostCustomersCustomerAddressesAddressReq } from '@medusajs/client-types';
import type { StorePostCustomersCustomerAddressesReq } from '@medusajs/client-types';
import type { StorePostCustomersCustomerPasswordTokenReq } from '@medusajs/client-types';
import type { StorePostCustomersCustomerReq } from '@medusajs/client-types';
import type { StorePostCustomersReq } from '@medusajs/client-types';
import type { StorePostCustomersResetPasswordReq } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useCustomersCreate = (
  requestBody: StorePostCustomersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.create>>, unknown, StorePostCustomersReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.create>>, unknown, StorePostCustomersReq>(
    ['customers', 'create', requestBody],
    () => client.customers.create(requestBody),
    options
  );
};

export const useCustomersRetrieve = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customers.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customers.retrieve>>>(
    ['customers', 'retrieve'],
    () => client.customers.retrieve(),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomersUpdate = (
  requestBody: StorePostCustomersCustomerReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.update>>, unknown, StorePostCustomersCustomerReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.update>>, unknown, StorePostCustomersCustomerReq>(
    ['customers', 'update', requestBody],
    () => client.customers.update(requestBody),
    options
  );
};

export const useCustomersAddAddress = (
  requestBody: StorePostCustomersCustomerAddressesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.addAddress>>, unknown, StorePostCustomersCustomerAddressesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.addAddress>>, unknown, StorePostCustomersCustomerAddressesReq>(
    ['customers', 'addAddress', requestBody],
    () => client.customers.addAddress(requestBody),
    options
  );
};

export const useCustomersUpdateAddress = (
  addressId: string,
  requestBody: StorePostCustomersCustomerAddressesAddressReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.updateAddress>>, unknown, StorePostCustomersCustomerAddressesAddressReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.updateAddress>>, unknown, StorePostCustomersCustomerAddressesAddressReq>(
    ['customers', 'updateAddress', addressId,requestBody],
    () => client.customers.updateAddress(addressId,requestBody),
    options
  );
};

export const useCustomersDeleteAddress = (
  addressId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.deleteAddress>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.deleteAddress>>, unknown, void>(
    ['customers', 'deleteAddress', addressId],
    () => client.customers.deleteAddress(addressId),
    options
  );
};

export const useCustomersListOrders = (
  queryParams: StoreGetCustomersCustomerOrdersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customers.listOrders>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customers.listOrders>>>(
    ['customers', 'listOrders', queryParams],
    () => client.customers.listOrders(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomersListPaymentMethods = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customers.listPaymentMethods>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customers.listPaymentMethods>>>(
    ['customers', 'listPaymentMethods'],
    () => client.customers.listPaymentMethods(),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomersResetPassword = (
  requestBody: StorePostCustomersResetPasswordReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.resetPassword>>, unknown, StorePostCustomersResetPasswordReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.resetPassword>>, unknown, StorePostCustomersResetPasswordReq>(
    ['customers', 'resetPassword', requestBody],
    () => client.customers.resetPassword(requestBody),
    options
  );
};

export const useCustomersGeneratePasswordToken = (
  requestBody: StorePostCustomersCustomerPasswordTokenReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.generatePasswordToken>>, unknown, StorePostCustomersCustomerPasswordTokenReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.generatePasswordToken>>, unknown, StorePostCustomersCustomerPasswordTokenReq>(
    ['customers', 'generatePasswordToken', requestBody],
    () => client.customers.generatePasswordToken(requestBody),
    options
  );
};


