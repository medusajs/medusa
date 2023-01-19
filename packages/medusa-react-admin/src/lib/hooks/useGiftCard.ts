/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetGiftCardsParams } from '../models/AdminGetGiftCardsParams';
import type { AdminGiftCardsDeleteRes } from '../models/AdminGiftCardsDeleteRes';
import type { AdminGiftCardsListRes } from '../models/AdminGiftCardsListRes';
import type { AdminGiftCardsRes } from '../models/AdminGiftCardsRes';
import type { AdminPostGiftCardsGiftCardReq } from '../models/AdminPostGiftCardsGiftCardReq';
import type { AdminPostGiftCardsReq } from '../models/AdminPostGiftCardsReq';

const { client } = useMedusaAdmin()

export const useGiftCardList = (
  queryParams: AdminGetGiftCardsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.giftCard.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.giftCard.list>>>(
    ['giftCard', 'list', queryParams],
    () => client.giftCard.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useGiftCardCreate = (
  requestBody: AdminPostGiftCardsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.giftCard.create>>, unknown, AdminPostGiftCardsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('giftCard')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.giftCard.create>>, unknown, AdminPostGiftCardsReq>(
    ['giftCard', 'create', requestBody],
    () => client.giftCard.create(requestBody),
    options
  );
};

export const useGiftCardRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.giftCard.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.giftCard.retrieve>>>(
    ['giftCard', 'retrieve', id],
    () => client.giftCard.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useGiftCardUpdate = (
  id: string,
  requestBody: AdminPostGiftCardsGiftCardReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.giftCard.update>>, unknown, AdminPostGiftCardsGiftCardReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('giftCard')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.giftCard.update>>, unknown, AdminPostGiftCardsGiftCardReq>(
    ['giftCard', 'update', id,requestBody],
    () => client.giftCard.update(id,requestBody),
    options
  );
};

export const useGiftCardDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.giftCard.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('giftCard')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.giftCard.delete>>, unknown, void>(
    ['giftCard', 'delete', id],
    () => client.giftCard.delete(id),
    options
  );
};


