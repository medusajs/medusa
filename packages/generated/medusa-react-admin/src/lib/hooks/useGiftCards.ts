/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetGiftCardsParams } from '@medusajs/client-types';
import type { AdminGiftCardsDeleteRes } from '@medusajs/client-types';
import type { AdminGiftCardsListRes } from '@medusajs/client-types';
import type { AdminGiftCardsRes } from '@medusajs/client-types';
import type { AdminPostGiftCardsGiftCardReq } from '@medusajs/client-types';
import type { AdminPostGiftCardsReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useGiftCardsList = (
  queryParams: AdminGetGiftCardsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.giftCards.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.giftCards.list>>>(
    ['giftCards', 'list', queryParams],
    () => client.giftCards.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useGiftCardsCreate = (
  requestBody: AdminPostGiftCardsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.giftCards.create>>, unknown, AdminPostGiftCardsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('giftCards')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.giftCards.create>>, unknown, AdminPostGiftCardsReq>(
    ['giftCards', 'create', requestBody],
    () => client.giftCards.create(requestBody),
    options
  );
};

export const useGiftCardsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.giftCards.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.giftCards.retrieve>>>(
    ['giftCards', 'retrieve', id],
    () => client.giftCards.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useGiftCardsUpdate = (
  id: string,
  requestBody: AdminPostGiftCardsGiftCardReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.giftCards.update>>, unknown, AdminPostGiftCardsGiftCardReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('giftCards')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.giftCards.update>>, unknown, AdminPostGiftCardsGiftCardReq>(
    ['giftCards', 'update', id,requestBody],
    () => client.giftCards.update(id,requestBody),
    options
  );
};

export const useGiftCardsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.giftCards.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('giftCards')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.giftCards.delete>>, unknown, void>(
    ['giftCards', 'delete', id],
    () => client.giftCards.delete(id),
    options
  );
};


