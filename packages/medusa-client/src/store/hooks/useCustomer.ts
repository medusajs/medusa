/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreCustomersListOrdersRes } from '../models/StoreCustomersListOrdersRes';
import type { StoreCustomersListPaymentMethodsRes } from '../models/StoreCustomersListPaymentMethodsRes';
import type { StoreCustomersRes } from '../models/StoreCustomersRes';
import type { StoreGetCustomersCustomerOrdersParams } from '../models/StoreGetCustomersCustomerOrdersParams';
import type { StorePostCustomersCustomerAddressesAddressReq } from '../models/StorePostCustomersCustomerAddressesAddressReq';
import type { StorePostCustomersCustomerAddressesReq } from '../models/StorePostCustomersCustomerAddressesReq';
import type { StorePostCustomersCustomerPasswordTokenReq } from '../models/StorePostCustomersCustomerPasswordTokenReq';
import type { StorePostCustomersCustomerReq } from '../models/StorePostCustomersCustomerReq';
import type { StorePostCustomersReq } from '../models/StorePostCustomersReq';
import type { StorePostCustomersResetPasswordReq } from '../models/StorePostCustomersResetPasswordReq';

export const useCustomerCreate = (
  requestBody: StorePostCustomersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.create>>, unknown, StorePostCustomersReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.create>>, unknown, StorePostCustomersReq>(
    ['customer', 'create', requestBody],
    () => client.customer.create(requestBody),
    options
  );
};

export const useCustomerRetrieve = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customer.retrieve>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customer.retrieve>>>(
    ['customer', 'retrieve'],
    () => client.customer.retrieve(),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerUpdate = (
  requestBody: StorePostCustomersCustomerReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.update>>, unknown, StorePostCustomersCustomerReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.update>>, unknown, StorePostCustomersCustomerReq>(
    ['customer', 'update', requestBody],
    () => client.customer.update(requestBody),
    options
  );
};

export const useCustomerAddAddress = (
  requestBody: StorePostCustomersCustomerAddressesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.addAddress>>, unknown, StorePostCustomersCustomerAddressesReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.addAddress>>, unknown, StorePostCustomersCustomerAddressesReq>(
    ['customer', 'addAddress', requestBody],
    () => client.customer.addAddress(requestBody),
    options
  );
};

export const useCustomerUpdateAddress = (
  addressId: string,
  requestBody: StorePostCustomersCustomerAddressesAddressReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.updateAddress>>, unknown, StorePostCustomersCustomerAddressesAddressReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.updateAddress>>, unknown, StorePostCustomersCustomerAddressesAddressReq>(
    ['customer', 'updateAddress', addressId,requestBody],
    () => client.customer.updateAddress(addressId,requestBody),
    options
  );
};

export const useCustomerDeleteAddress = (
  addressId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.deleteAddress>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.deleteAddress>>, unknown, void>(
    ['customer', 'deleteAddress', addressId],
    () => client.customer.deleteAddress(addressId),
    options
  );
};

export const useCustomerListOrders = (
  queryParams: StoreGetCustomersCustomerOrdersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customer.listOrders>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customer.listOrders>>>(
    ['customer', 'listOrders', queryParams],
    () => client.customer.listOrders(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerListPaymentMethods = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customer.listPaymentMethods>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customer.listPaymentMethods>>>(
    ['customer', 'listPaymentMethods'],
    () => client.customer.listPaymentMethods(),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerResetPassword = (
  requestBody: StorePostCustomersResetPasswordReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.resetPassword>>, unknown, StorePostCustomersResetPasswordReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.resetPassword>>, unknown, StorePostCustomersResetPasswordReq>(
    ['customer', 'resetPassword', requestBody],
    () => client.customer.resetPassword(requestBody),
    options
  );
};

export const useCustomerGeneratePasswordToken = (
  requestBody: StorePostCustomersCustomerPasswordTokenReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.generatePasswordToken>>, unknown, StorePostCustomersCustomerPasswordTokenReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.generatePasswordToken>>, unknown, StorePostCustomersCustomerPasswordTokenReq>(
    ['customer', 'generatePasswordToken', requestBody],
    () => client.customer.generatePasswordToken(requestBody),
    options
  );
};


